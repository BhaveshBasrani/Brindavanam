/**
 * Brindavanam Organic E-Commerce - Foolproof Master Backend & Email Engine
 * 
 * ADMIN EMAIL: brindavanam1902@gmail.com
 * 
 * Features:
 * 1. Self-Initializing Database: Auto-creates 'Orders', 'Customer_CRM', & 'Analytics' sheets.
 * 2. Auto-Formatting: Header styling (#3A5303), column widths, freezes, & data validations.
 * 3. Instant Order Recording with Unique Order IDs & Payment References.
 * 4. Resilient HTML Email Engine: Customer Order Receipts & Admin Alerts (brindavanam1902@gmail.com).
 * 5. Order Status Updates: Instant customer notification email when status changes to Shipped/Delivered.
 * 6. REST API Endpoint: Full CORS & JSON support for Next.js Admin Dashboard.
 * 
 * 1-Click Setup:
 * 1. Open Google Sheets (https://sheets.new)
 * 2. Extensions -> Apps Script -> Paste this code -> Click Save.
 * 3. Run function 'setupDatabase' ONCE (or let it auto-initialize on first order).
 * 4. Deploy -> New Deployment -> Web App -> Execute as: Me | Who has access: Anyone.
 * 5. Copy Web App URL into .env.local as NEXT_PUBLIC_GAS_WEB_APP_URL!
 */

var ADMIN_EMAIL = "brindavanam1902@gmail.com";

/**
 * 1-Click Manual Setup Helper
 */
function setupDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  getOrCreateOrdersSheet(ss);
  getOrCreateCustomerSheet(ss);
  getOrCreateAnalyticsSheet(ss);
  SpreadsheetApp.getUi().alert("✅ Brindavanam Database & Sheets Successfully Initialized!");
}

/**
 * Add custom menu to Google Sheet UI
 */
function onOpen() {
  try {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu("🌿 Brindavanam Admin")
      .addItem("Initialize / Reset Sheets", "setupDatabase")
      .addToUi();
  } catch (e) {
    // ignore if headless
  }
}

/**
 * POST Endpoint Handler
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (err) {
    return jsonResponse({ status: "error", message: "Server busy lock timeout. Please retry." });
  }

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var ordersSheet = getOrCreateOrdersSheet(ss);
    var customerSheet = getOrCreateCustomerSheet(ss);

    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ status: "error", message: "No post data payload received" });
    }

    var data = JSON.parse(e.postData.contents);
    var action = data.action || "create_order";

    if (action === "create_order") {
      return handleCreateOrder(ordersSheet, customerSheet, data);
    } else if (action === "update_status") {
      return handleUpdateOrderStatus(ordersSheet, data);
    } else {
      return jsonResponse({ status: "error", message: "Invalid action parameter specified" });
    }
  } catch (error) {
    return jsonResponse({ status: "error", message: error.toString() });
  } finally {
    try { lock.releaseLock(); } catch (l) {}
  }
}

/**
 * GET Endpoint Handler - Returns live orders for Admin Dashboard
 */
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = getOrCreateOrdersSheet(ss);
    var rows = sheet.getDataRange().getValues();

    if (rows.length <= 1) {
      return jsonResponse({ status: "success", orders: [] });
    }

    var orders = [];
    for (var i = 1; i < rows.length; i++) {
      var row = rows[i];
      if (!row[0]) continue;
      orders.push({
        id: row[0].toString(),
        date: row[1] ? row[1].toString() : "",
        customerName: row[2] ? row[2].toString() : "",
        customerEmail: row[3] ? row[3].toString() : "",
        customerPhone: row[4] ? row[4].toString() : "",
        shippingAddress: row[5] ? row[5].toString() : "",
        city: row[6] ? row[6].toString() : "",
        pincode: row[7] ? row[7].toString() : "",
        itemsSummary: row[8] ? row[8].toString() : "",
        total: parseFloat(row[9]) || 0,
        paymentMethod: row[10] ? row[10].toString() : "Razorpay",
        paymentId: row[11] ? row[11].toString() : "",
        status: row[12] ? row[12].toString() : "Processing"
      });
    }

    return jsonResponse({ status: "success", orders: orders });
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

/**
 * Create Order Logic
 */
function handleCreateOrder(ordersSheet, customerSheet, data) {
  var itemsSummary = (data.items || []).map(function(item) {
    return item.product.name + " (" + item.selectedVariant.weight + ") x" + item.quantity;
  }).join(", ");

  var timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  var orderId = data.id || ("ORD-" + Date.now());
  var custEmail = data.shippingAddress ? data.shippingAddress.email : (data.customerEmail || "");
  var custName = data.shippingAddress ? data.shippingAddress.fullName : (data.customerName || "Valued Patron");
  var custPhone = data.shippingAddress ? data.shippingAddress.phone : "";
  var fullAddress = data.shippingAddress ? (data.shippingAddress.addressLine1 + ", " + (data.shippingAddress.addressLine2 || "")) : "";
  var city = data.shippingAddress ? data.shippingAddress.city : "";
  var pincode = data.shippingAddress ? data.shippingAddress.pincode : "";
  var totalAmount = data.total || 0;

  // Append row to Orders Sheet
  ordersSheet.appendRow([
    orderId,
    timestamp,
    custName,
    custEmail,
    custPhone,
    fullAddress,
    city,
    pincode,
    itemsSummary,
    totalAmount,
    data.paymentMethod || "Razorpay",
    data.paymentId || "PAY-" + Date.now(),
    data.status || "Processing"
  ]);

  // Log/Update Customer CRM Sheet
  logCustomerCRM(customerSheet, custName, custEmail, custPhone, city);

  // Send Emails safely in background (errors caught so database never fails)
  sendCustomerOrderEmail(custEmail, custName, orderId, totalAmount, itemsSummary, fullAddress);
  sendAdminNotificationEmail(orderId, custName, custEmail, custPhone, totalAmount, itemsSummary);

  return jsonResponse({
    status: "success",
    message: "Order #" + orderId + " recorded & emails dispatched!",
    orderId: orderId
  });
}

/**
 * Update Order Status Logic
 */
function handleUpdateOrderStatus(ordersSheet, data) {
  var targetOrderId = data.orderId;
  var newStatus = data.newStatus;

  var rows = ordersSheet.getDataRange().getValues();
  var foundRow = -1;
  var customerEmail = "";
  var customerName = "";

  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0].toString() === targetOrderId.toString()) {
      foundRow = i + 1; // 1-indexed row number
      customerName = rows[i][2];
      customerEmail = rows[i][3];
      break;
    }
  }

  if (foundRow > -1) {
    ordersSheet.getRange(foundRow, 13).setValue(newStatus);

    if (customerEmail) {
      sendStatusUpdateEmail(customerEmail, customerName, targetOrderId, newStatus);
    }

    return jsonResponse({
      status: "success",
      message: "Order " + targetOrderId + " status updated to " + newStatus
    });
  } else {
    return jsonResponse({ status: "error", message: "Order ID " + targetOrderId + " not found" });
  }
}

/**
 * Self-Initializing Orders Sheet Creator
 */
function getOrCreateOrdersSheet(ss) {
  var sheet = ss.getSheetByName("Orders");
  if (!sheet) {
    sheet = ss.insertSheet("Orders");
  }

  if (sheet.getLastRow() === 0) {
    var headers = [
      "Order ID", "Timestamp", "Customer Name", "Customer Email", "Customer Phone",
      "Shipping Address", "City", "Pincode", "Items Purchased", "Total Amount (INR)",
      "Payment Method", "Payment ID / Ref", "Status"
    ];
    sheet.appendRow(headers);

    // Format Header Row
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold")
               .setBackground("#3A5303")
               .setFontColor("#FFFFFF")
               .setFontFamily("Arial")
               .setFontSize(10)
               .setVerticalAlignment("middle");

    sheet.setRowHeight(1, 35);
    sheet.setFrozenRows(1);

    // Set Data Validation for Status Column (Column 13)
    var statusRange = sheet.getRange("M2:M1000");
    var rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Processing", "Shipped", "Delivered", "Cancelled"], true)
      .setAllowInvalid(false)
      .build();
    statusRange.setDataValidation(rule);
  }

  return sheet;
}

/**
 * Self-Initializing Customer CRM Sheet Creator
 */
function getOrCreateCustomerSheet(ss) {
  var sheet = ss.getSheetByName("Customer_CRM");
  if (!sheet) {
    sheet = ss.insertSheet("Customer_CRM");
  }

  if (sheet.getLastRow() === 0) {
    var headers = ["Customer Name", "Email Address", "Phone Number", "City", "First Order Date", "Total Orders"];
    sheet.appendRow(headers);

    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold")
               .setBackground("#1c260b")
               .setFontColor("#94C000")
               .setFontFamily("Arial")
               .setFontSize(10);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

/**
 * Self-Initializing Analytics Sheet Creator
 */
function getOrCreateAnalyticsSheet(ss) {
  var sheet = ss.getSheetByName("Analytics");
  if (!sheet) {
    sheet = ss.insertSheet("Analytics");
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Brindavanam Store Analytics Summary", ""]);
    sheet.appendRow(["Total Revenue (INR)", "=SUM(Orders!J2:J1000)"]);
    sheet.appendRow(["Total Orders Placed", "=COUNTA(Orders!A2:A1000)"]);
    sheet.appendRow(["Average Order Value (INR)", "=AVERAGE(Orders!J2:J1000)"]);

    sheet.getRange("A1:B1").setFontWeight("bold").setBackground("#3A5303").setFontColor("#FFFFFF");
    sheet.getRange("A2:A4").setFontWeight("bold");
  }

  return sheet;
}

/**
 * Helper: Log Customer to CRM Sheet
 */
function logCustomerCRM(sheet, name, email, phone, city) {
  if (!email) return;
  try {
    var rows = sheet.getDataRange().getValues();
    var existingRow = -1;

    for (var i = 1; i < rows.length; i++) {
      if (rows[i][1].toString().toLowerCase() === email.toLowerCase()) {
        existingRow = i + 1;
        break;
      }
    }

    if (existingRow > -1) {
      var currentOrderCount = parseInt(sheet.getRange(existingRow, 6).getValue()) || 1;
      sheet.getRange(existingRow, 6).setValue(currentOrderCount + 1);
    } else {
      sheet.appendRow([name, email, phone, city, new Date().toLocaleDateString("en-IN"), 1]);
    }
  } catch (err) {
    Logger.log("CRM Log Error: " + err.toString());
  }
}

/**
 * Email Helper: Customer Order Confirmation Receipt
 */
function sendCustomerOrderEmail(email, name, orderId, total, items, address) {
  if (!email) return;
  try {
    var subject = "🌿 Brindavanam Order Confirmation - #" + orderId;
    var htmlBody = 
      "<div style='font-family: Arial, sans-serif; background-color: #F7F6F2; padding: 30px; color: #1c260b;'>" +
        "<div style='max-w: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 30px; border: 1px solid #e2e8f0;'>" +
          "<h2 style='color: #3A5303; margin-top: 0; font-family: Georgia, serif;'>Brindavanam Organic Farms</h2>" +
          "<p style='font-size: 14px;'>Dear <strong>" + name + "</strong>,</p>" +
          "<p style='font-size: 14px; color: #4a5568;'>Thank you for choosing pure organic produce! We have received your order and our village farm team is preparing your shipment.</p>" +
          
          "<div style='background-color: #F7F6F2; border-left: 4px solid #3A5303; padding: 15px; margin: 20px 0; border-radius: 4px;'>" +
            "<p style='margin: 0; font-size: 13px;'><strong>Order Number:</strong> #" + orderId + "</p>" +
            "<p style='margin: 5px 0 0 0; font-size: 13px;'><strong>Items Purchased:</strong> " + items + "</p>" +
            "<p style='margin: 5px 0 0 0; font-size: 13px;'><strong>Delivery Address:</strong> " + address + "</p>" +
            "<p style='margin: 5px 0 0 0; font-size: 15px; color: #3A5303;'><strong>Total Paid:</strong> ₹" + total + "</p>" +
          "</div>" +
          
          "<p style='font-size: 13px; color: #718096;'>Your Wood-Pressed Oils & A2 Bilona Ghee will be dispatched in thermal protective packaging within 24 hours.</p>" +
          "<hr style='border: none; border-top: 1px solid #edf2f7; margin: 20px 0;' />" +
          "<p style='font-size: 12px; color: #a0aec0; margin: 0;'>Brindavanam Organic Estate • brindavanam1902@gmail.com</p>" +
        "</div>" +
      "</div>";

    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: htmlBody
    });
  } catch (err) {
    Logger.log("Customer email dispatch notice: " + err.toString());
  }
}

/**
 * Email Helper: Admin Order Alert Email
 */
function sendAdminNotificationEmail(orderId, name, email, phone, total, items) {
  try {
    var subject = "🚨 NEW ORGANIC ORDER #" + orderId + " (₹" + total + ")";
    var body = "New Order Received at Brindavanam Store!\n\n" +
      "Order ID: #" + orderId + "\n" +
      "Customer: " + name + "\n" +
      "Email: " + email + "\n" +
      "Phone: " + phone + "\n" +
      "Items: " + items + "\n" +
      "Total Amount: ₹" + total + "\n\n" +
      "Open your Google Sheet to view complete shipping details & update tracking status.";

    MailApp.sendEmail(ADMIN_EMAIL, subject, body);
  } catch (err) {
    Logger.log("Admin email alert notice: " + err.toString());
  }
}

/**
 * Email Helper: Customer Status Update Email
 */
function sendStatusUpdateEmail(email, name, orderId, newStatus) {
  try {
    var subject = "🚚 Brindavanam Order #" + orderId + " Status Update: " + newStatus;
    var body = "Hello " + name + ",\n\n" +
      "Your order #" + orderId + " has been updated to: " + newStatus.toUpperCase() + ".\n\n" +
      "Thank you for supporting small-batch organic farming!\n\n" +
      "Warm Regards,\nBrindavanam Organic Farms";

    MailApp.sendEmail(email, subject, body);
  } catch (err) {
    Logger.log("Status update email notice: " + err.toString());
  }
}

/**
 * JSON Response Helper
 */
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
