/**
 * Brindavanam Organic E-Commerce - Foolproof Master Backend & Email Engine
 * 
 * ADMIN EMAIL: brindavanam1902@gmail.com
 * 
 * Features:
 * 1. Self-Initializing Database: Auto-creates 'Orders', 'Customer_CRM', 'Promo_Codes' & 'Analytics' sheets.
 * 2. Auto-Formatting: Header styling (#3A5303), column widths, freezes, & data validations.
 * 3. Instant Order Recording with Unique Order IDs & Payment References.
 * 4. Promo Code Engine: Live promo code creation, active/disabled toggling, & instant lookup API.
 * 5. Resilient HTML Email Engine: Customer Order Receipts & Admin Alerts (brindavanam1902@gmail.com).
 * 6. Order Status Updates: Instant customer notification email when status changes to Shipped/Delivered.
 * 7. REST API Endpoint: Full CORS & JSON support for Admin Dashboard.
 * 
 * 1-Click Setup:
 * 1. Open Google Sheets (https://sheets.new)
 * 2. Extensions -> Apps Script -> Paste this code -> Click Save.
 * 3. Run function 'setupDatabase' ONCE (or let it auto-initialize on first request).
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
  getOrCreatePromosSheet(ss);
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
    } else if (action === "save_promos") {
      return handleSavePromos(ss, data);
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
 * GET Endpoint Handler - Returns live orders or promo codes
 */
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "get_orders";

    // Handle Promo Codes API GET Request
    if (action === "get_promos") {
      return handleGetPromos(ss);
    }

    // Handle User Orders GET Request
    if (action === "get_user_orders") {
      var userEmail = (e && e.parameter && e.parameter.email) ? e.parameter.email.toLowerCase() : "";
      return handleGetUserOrders(ss, userEmail);
    }

    // Default: Get All Orders for Admin Dashboard
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
 * Handle Promo Codes GET
 */
function handleGetPromos(ss) {
  var promosSheet = getOrCreatePromosSheet(ss);
  var rows = promosSheet.getDataRange().getValues();
  if (rows.length <= 1) {
    return jsonResponse({ status: "success", promos: [] });
  }

  var promos = [];
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    if (!r[0]) continue;
    promos.push({
      code: r[0].toString(),
      discountPercent: parseFloat(r[1]) || 10,
      active: (r[2] === true || r[2].toString().toLowerCase() === 'true'),
      description: r[3] ? r[3].toString() : ""
    });
  }

  return jsonResponse({ status: "success", promos: promos });
}

/**
 * Handle Save Promos POST
 */
function handleSavePromos(ss, data) {
  var promosSheet = getOrCreatePromosSheet(ss);
  var promosList = data.promos || [];

  // Clear existing promo rows (keep header)
  var lastRow = promosSheet.getLastRow();
  if (lastRow > 1) {
    promosSheet.getRange(2, 1, lastRow - 1, 4).clearContent();
  }

  // Insert updated promos list
  for (var i = 0; i < promosList.length; i++) {
    var p = promosList[i];
    promosSheet.appendRow([
      p.code.toString().toUpperCase(),
      p.discountPercent || 10,
      p.active !== false,
      p.description || ""
    ]);
  }

  return jsonResponse({ status: "success", message: "Promo codes successfully saved to Apps Script!" });
}

/**
 * Handle User Orders GET
 */
function handleGetUserOrders(ss, userEmail) {
  var sheet = getOrCreateOrdersSheet(ss);
  var rows = sheet.getDataRange().getValues();
  var userOrders = [];

  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var emailInRow = (row[3] || "").toString().toLowerCase();
    if (emailInRow && emailInRow === userEmail) {
      userOrders.push({
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
  }

  return jsonResponse({ status: "success", orders: userOrders });
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

  // Send Emails safely in background
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

    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold")
               .setBackground("#3A5303")
               .setFontColor("#FFFFFF")
               .setFontFamily("Arial")
               .setFontSize(10)
               .setVerticalAlignment("middle");

    sheet.setRowHeight(1, 35);
    sheet.setFrozenRows(1);

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
 * Self-Initializing Promo_Codes Sheet Creator
 */
function getOrCreatePromosSheet(ss) {
  var sheet = ss.getSheetByName("Promo_Codes");
  if (!sheet) {
    sheet = ss.insertSheet("Promo_Codes");
  }

  if (sheet.getLastRow() === 0) {
    var headers = ["Code", "Discount %", "Active", "Description"];
    sheet.appendRow(headers);

    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold")
               .setBackground("#3A5303")
               .setFontColor("#FFFFFF")
               .setFontFamily("Arial")
               .setFontSize(10)
               .setVerticalAlignment("middle");

    sheet.setRowHeight(1, 35);
    sheet.setFrozenRows(1);

    // Initial Default Seed Promos
    sheet.appendRow(["ORGANIC10", 10, true, "10% Discount on Produce"]);
    sheet.appendRow(["BRINDAVANAM20", 20, true, "20% Farm Harvest Special"]);
    sheet.appendRow(["FREESHIP", 15, true, "15% Express Shipping Coupon"]);
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
    var headers = ["Customer Name", "Email Address", "Phone Number", "City", "Total Orders", "First Seen"];
    sheet.appendRow(headers);

    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold")
               .setBackground("#3A5303")
               .setFontColor("#FFFFFF")
               .setFontFamily("Arial")
               .setFontSize(10)
               .setVerticalAlignment("middle");

    sheet.setRowHeight(1, 35);
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
    var headers = ["Metric", "Value", "Last Updated"];
    sheet.appendRow(headers);

    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold")
               .setBackground("#3A5303")
               .setFontColor("#FFFFFF")
               .setFontFamily("Arial")
               .setFontSize(10)
               .setVerticalAlignment("middle");

    sheet.setRowHeight(1, 35);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

/**
 * Customer CRM Logging Helper
 */
function logCustomerCRM(customerSheet, name, email, phone, city) {
  if (!email) return;

  var rows = customerSheet.getDataRange().getValues();
  var foundRow = -1;

  for (var i = 1; i < rows.length; i++) {
    if (rows[i][1].toString().toLowerCase() === email.toLowerCase()) {
      foundRow = i + 1;
      break;
    }
  }

  var nowStr = new Date().toLocaleDateString("en-IN");

  if (foundRow > -1) {
    var currentOrders = parseInt(customerSheet.getRange(foundRow, 5).getValue()) || 1;
    customerSheet.getRange(foundRow, 5).setValue(currentOrders + 1);
    if (phone) customerSheet.getRange(foundRow, 3).setValue(phone);
    if (city) customerSheet.getRange(foundRow, 4).setValue(city);
  } else {
    customerSheet.appendRow([name, email, phone, city, 1, nowStr]);
  }
}

/**
 * Email Helper: Send Customer Order Receipt
 */
function sendCustomerOrderEmail(email, name, orderId, total, items, address) {
  if (!email) return;

  var subject = "🌿 Order Confirmed! #" + orderId + " - Brindavanam Organic Farms";
  var htmlBody = 
    "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 16px; overflow: hidden;'>" +
      "<div style='background-color: #3A5303; padding: 24px; text-align: center; color: white;'>" +
        "<h1 style='font-family: Georgia, serif; margin: 0; font-size: 26px;'>Brindavanam Organic Farms</h1>" +
        "<p style='color: #94C000; font-size: 12px; margin-top: 4px; text-transform: uppercase; tracking-wider;'>100% Certified Native Farm Produce</p>" +
      "</div>" +
      "<div style='padding: 24px; background-color: #ffffff; color: #333; font-size: 14px; line-height: 1.6;'>" +
        "<h2 style='color: #3A5303; font-size: 20px;'>Thank you for your order, " + name + "!</h2>" +
        "<p>Your order for artisanal wood-pressed produce has been received and is being prepared for dispatch.</p>" +
        "<div style='background-color: #F7F6F2; border: 1px solid #e0e0e0; border-radius: 12px; padding: 16px; margin: 20px 0;'>" +
          "<p style='margin: 0 0 8px 0; font-weight: bold; color: #3A5303;'>Order Summary (Ref: " + orderId + ")</p>" +
          "<p style='margin: 4px 0;'><strong>Items:</strong> " + items + "</p>" +
          "<p style='margin: 4px 0;'><strong>Total Paid:</strong> ₹" + total + "</p>" +
          "<p style='margin: 4px 0;'><strong>Shipping Address:</strong> " + address + "</p>" +
        "</div>" +
        "<p style='font-size: 12px; color: #666;'>For any queries regarding your dispatch, reply to this email or write to <strong>brindavanam1902@gmail.com</strong>.</p>" +
      "</div>" +
      "<div style='background-color: #1c260b; padding: 16px; text-align: center; color: #888; font-size: 11px;'>" +
        "© 2026 Brindavanam Organic Farms • Brindavan Farm Hyd • Powered By Rendervoid" +
      "</div>" +
    "</div>";

  try {
    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: htmlBody
    });
  } catch (e) {
    console.warn("Customer Email failed:", e);
  }
}

/**
 * Email Helper: Send Admin Order Alert
 */
function sendAdminNotificationEmail(orderId, name, email, phone, total, items) {
  var subject = "🚨 NEW ORDER #" + orderId + " (₹" + total + ") - Brindavanam Admin";
  var htmlBody = 
    "<div style='font-family: Arial, sans-serif; padding: 20px; border: 2px solid #3A5303; border-radius: 12px;'>" +
      "<h2 style='color: #3A5303; margin-top: 0;'>New Order Dispatch Required!</h2>" +
      "<p><strong>Order ID:</strong> " + orderId + "</p>" +
      "<p><strong>Customer:</strong> " + name + " (" + email + " | Phone: " + phone + ")</p>" +
      "<p><strong>Total Amount:</strong> ₹" + total + "</p>" +
      "<p><strong>Items:</strong> " + items + "</p>" +
      "<p style='margin-top: 20px;'><a href='https://bhaveshbasrani.github.io/Brindavanam/#admin' style='background-color: #3A5303; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px;'>Open Admin Operations Desk</a></p>" +
    "</div>";

  try {
    MailApp.sendEmail({
      to: ADMIN_EMAIL,
      subject: subject,
      htmlBody: htmlBody
    });
  } catch (e) {
    console.warn("Admin Alert Email failed:", e);
  }
}

/**
 * Email Helper: Send Status Update Notification
 */
function sendStatusUpdateEmail(email, name, orderId, newStatus) {
  if (!email) return;

  var subject = "🚚 Order #" + orderId + " Status Update: " + newStatus + " - Brindavanam";
  var htmlBody = 
    "<div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px;'>" +
      "<h2 style='color: #3A5303;'>Order #" + orderId + " Status Updated!</h2>" +
      "<p>Hello " + name + ",</p>" +
      "<p>Your order status has been updated to: <strong style='color: #3A5303; text-transform: uppercase; font-size: 16px;'>" + newStatus + "</strong></p>" +
      "<p>Thank you for choosing Brindavanam 100% Certified Organic Farms.</p>" +
    "</div>";

  try {
    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: htmlBody
    });
  } catch (e) {
    console.warn("Status Email failed:", e);
  }
}

/**
 * Utility: Standard CORS & JSON HTTP Response
 */
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
