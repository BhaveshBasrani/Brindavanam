/**
 * Brindavanam Organic E-Commerce - Google Apps Script Master Backend & Email Engine
 * 
 * Features:
 * 1. Automatic Google Sheet creation & formatting.
 * 2. Instant Order Recording with Unique Order IDs.
 * 3. Automatic Customer Email Confirmation with HTML receipt.
 * 4. Automatic Store Admin Email Alert.
 * 5. Order Status Updates & Customer Notification Emails.
 * 6. Live API Endpoint for Next.js Admin Dashboard.
 * 
 * Deployment Instructions:
 * 1. Open Google Sheets (https://sheets.new)
 * 2. Click Extensions -> Apps Script
 * 3. Replace all code in Code.gs with this script and Save.
 * 4. Click Deploy -> New Deployment -> Select "Web app"
 * 5. Set "Execute as": Me
 * 6. Set "Who has access": Anyone (even anonymous)
 * 7. Deploy & Copy Web App URL into .env.local as NEXT_PUBLIC_GAS_WEB_APP_URL!
 */

var ADMIN_EMAIL = "care@brindavanamorganic.com"; // Change to your store admin email

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = getOrCreateSheet();
    var data = JSON.parse(e.postData.contents);
    var action = data.action || "create_order";

    if (action === "create_order") {
      return handleCreateOrder(sheet, data);
    } else if (action === "update_status") {
      return handleUpdateOrderStatus(sheet, data);
    } else {
      return jsonResponse({ status: "error", message: "Unknown action parameter" });
    }
  } catch (error) {
    return jsonResponse({ status: "error", message: error.toString() });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  try {
    var sheet = getOrCreateSheet();
    var rows = sheet.getDataRange().getValues();
    if (rows.length <= 1) {
      return jsonResponse({ status: "success", orders: [] });
    }

    var headers = rows[0];
    var orders = [];

    for (var i = 1; i < rows.length; i++) {
      var row = rows[i];
      orders.push({
        id: row[0],
        date: row[1],
        customerName: row[2],
        customerEmail: row[3],
        customerPhone: row[4],
        shippingAddress: row[5],
        city: row[6],
        pincode: row[7],
        itemsSummary: row[8],
        total: row[9],
        paymentMethod: row[10],
        paymentId: row[11],
        status: row[12]
      });
    }

    return jsonResponse({ status: "success", orders: orders });
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

function handleCreateOrder(sheet, data) {
  var itemsSummary = (data.items || []).map(function(item) {
    return item.product.name + " (" + item.selectedVariant.weight + ") x" + item.quantity;
  }).join(", ");

  var timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  var orderId = data.id || ("ORD-" + Date.now());
  var custEmail = data.shippingAddress ? data.shippingAddress.email : "";
  var custName = data.shippingAddress ? data.shippingAddress.fullName : "Valued Patron";

  // Append to Google Sheet
  sheet.appendRow([
    orderId,
    timestamp,
    custName,
    custEmail,
    data.shippingAddress ? data.shippingAddress.phone : "N/A",
    data.shippingAddress ? (data.shippingAddress.addressLine1 + ", " + (data.shippingAddress.addressLine2 || "")) : "N/A",
    data.shippingAddress ? data.shippingAddress.city : "N/A",
    data.shippingAddress ? data.shippingAddress.pincode : "N/A",
    itemsSummary,
    data.total || 0,
    data.paymentMethod || "Razorpay",
    data.paymentId || "N/A",
    data.status || "Processing"
  ]);

  // Send Email Receipts asynchronously/safely
  sendCustomerOrderEmail(custEmail, custName, orderId, data.total, itemsSummary);
  sendAdminNotificationEmail(orderId, custName, custEmail, data.total, itemsSummary);

  return jsonResponse({
    status: "success",
    message: "Order recorded & confirmation emails dispatched!",
    orderId: orderId
  });
}

function handleUpdateOrderStatus(sheet, data) {
  var targetOrderId = data.orderId;
  var newStatus = data.newStatus;

  var rows = sheet.getDataRange().getValues();
  var foundRow = -1;
  var customerEmail = "";
  var customerName = "";

  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] === targetOrderId) {
      foundRow = i + 1; // 1-based index
      customerName = rows[i][2];
      customerEmail = rows[i][3];
      break;
    }
  }

  if (foundRow > -1) {
    sheet.getRange(foundRow, 13).setValue(newStatus); // Status is column 13

    // Dispatch status update email to customer
    if (customerEmail) {
      sendStatusUpdateEmail(customerEmail, customerName, targetOrderId, newStatus);
    }

    return jsonResponse({
      status: "success",
      message: "Order " + targetOrderId + " status updated to " + newStatus
    });
  } else {
    return jsonResponse({ status: "error", message: "Order ID not found" });
  }
}

// Helper: Email to Customer on New Order
function sendCustomerOrderEmail(email, name, orderId, total, items) {
  if (!email) return;
  try {
    var subject = "🌱 Brindavanam Order Confirmation - #" + orderId;
    var htmlBody = "<div style='font-family: Arial, sans-serif; padding: 20px; color: #1c260b; bg-color: #F3F6F3;'>" +
      "<h2 style='color: #4B6B03;'>Thank You for Choosing Brindavanam Organic!</h2>" +
      "<p>Dear <strong>" + name + "</strong>,</p>" +
      "<p>Your order <strong>#" + orderId + "</strong> has been successfully placed and received by our organic farm desk.</p>" +
      "<div style='background: #white; border: 1px solid #4B6B03; padding: 15px; border-radius: 10px; margin: 15px 0;'>" +
      "<p><strong>Items Ordered:</strong> " + items + "</p>" +
      "<p><strong>Total Amount Paid:</strong> ₹" + total + "</p>" +
      "<p><strong>Status:</strong> Processing (Ships within 24 hours)</p>" +
      "</div>" +
      "<p>Pure Wood-Pressed Oils & A2 Bilona Ghee will be carefully packed in thermal protection for your family.</p>" +
      "<p style='color: #4B6B03; font-weight: bold;'>Warm Organic Regards,<br/>Brindavanam Farm Team</p>" +
      "</div>";

    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: htmlBody
    });
  } catch (err) {
    Logger.log("Customer email failed: " + err.toString());
  }
}

// Helper: Email to Admin
function sendAdminNotificationEmail(orderId, name, email, total, items) {
  try {
    var subject = "🚨 NEW ORDER RECEIVED - #" + orderId + " (₹" + total + ")";
    var body = "New Organic Order Received!\n\n" +
      "Order ID: " + orderId + "\n" +
      "Customer: " + name + " (" + email + ")\n" +
      "Items: " + items + "\n" +
      "Total: ₹" + total + "\n\n" +
      "Check your Google Sheet / Admin Dashboard to process shipment.";

    MailApp.sendEmail(ADMIN_EMAIL, subject, body);
  } catch (err) {
    Logger.log("Admin email alert failed: " + err.toString());
  }
}

// Helper: Email to Customer on Status Update
function sendStatusUpdateEmail(email, name, orderId, newStatus) {
  try {
    var subject = "🚚 Order #" + orderId + " Update: " + newStatus;
    var body = "Hello " + name + ",\n\n" +
      "Your Brindavanam order #" + orderId + " status has been updated to: " + newStatus.toUpperCase() + ".\n\n" +
      "Thank you for supporting sustainable organic farming!\n\n" +
      "Brindavanam Organic Farms";

    MailApp.sendEmail(email, subject, body);
  } catch (err) {
    Logger.log("Status update email failed: " + err.toString());
  }
}

function getOrCreateSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Order ID", "Timestamp", "Customer Name", "Customer Email", "Customer Phone",
      "Shipping Address", "City", "Pincode", "Items Purchased", "Total Amount (INR)",
      "Payment Method", "Payment ID / Ref", "Status"
    ]);
    sheet.getRange(1, 1, 1, 13).setFontWeight("bold").setBackground("#4B6B03").setFontColor("#FFFFFF");
  }
  return sheet;
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
