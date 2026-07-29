/**
 * Brindavanam Organic E-Commerce - Foolproof Master Backend & Email Engine
 * 
 * ADMIN EMAIL: brindavanam1902@gmail.com
 * FARM LOCATION: Brindavan Farm Hyd
 * 
 * Features:
 * 1. Self-Initializing Database: Auto-creates 'Orders', 'Customer_CRM', 'Promo_Codes', 'Custom_Products', & 'Analytics'.
 * 2. Wholesome Customer Emails: Beautiful HTML Invoice Receipt + Live Tracking & Estimated Date of Arrival (ETA) alerts.
 * 3. Complete Admin Order Control: Edit details, add private notes, set tracking URLs, update ETA, & delete orders.
 * 4. Custom Product Manager: Add, edit, & delete catalog produce directly from Admin Panel.
 * 5. REST API Endpoint: Full CORS & JSON support.
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
  getOrCreateProductsSheet(ss);
  getOrCreateAnalyticsSheet(ss);
  SpreadsheetApp.getUi().alert("✅ Brindavanam Master Database Successfully Initialized!");
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
    // ignore
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
    } else if (action === "update_order_details") {
      return handleUpdateOrderDetails(ordersSheet, data);
    } else if (action === "delete_order") {
      return handleDeleteOrder(ordersSheet, data);
    } else if (action === "save_promos") {
      return handleSavePromos(ss, data);
    } else if (action === "save_products") {
      return handleSaveProducts(ss, data);
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
 * GET Endpoint Handler
 */
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "get_orders";

    if (action === "get_promos") {
      return handleGetPromos(ss);
    }

    if (action === "get_products") {
      return handleGetProducts(ss);
    }

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
        status: row[12] ? row[12].toString() : "Processing",
        trackingUrl: row[13] ? row[13].toString() : "",
        estimatedArrival: row[14] ? row[14].toString() : "",
        adminNotes: row[15] ? row[15].toString() : ""
      });
    }

    return jsonResponse({ status: "success", orders: orders });
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

/**
 * Handle Create Order
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
  var trackingUrl = data.trackingUrl || "";
  var eta = data.estimatedArrival || "3-5 Business Days";
  var notes = data.adminNotes || "";

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
    data.status || "Processing",
    trackingUrl,
    eta,
    notes
  ]);

  logCustomerCRM(customerSheet, custName, custEmail, custPhone, city);

  // Send Wholesome Customer Invoice Email & Admin Alert
  sendWholesomeInvoiceEmail(custEmail, custName, orderId, totalAmount, itemsSummary, fullAddress, eta);
  sendAdminNotificationEmail(orderId, custName, custEmail, custPhone, totalAmount, itemsSummary);

  return jsonResponse({
    status: "success",
    message: "Order #" + orderId + " recorded & Wholesome Invoice Email sent!",
    orderId: orderId
  });
}

/**
 * Handle Update Order Status & Send ETA/Tracking Email
 */
function handleUpdateOrderStatus(ordersSheet, data) {
  var targetOrderId = data.orderId;
  var newStatus = data.newStatus;
  var trackingUrl = data.trackingUrl || "";
  var eta = data.estimatedArrival || "";

  var rows = ordersSheet.getDataRange().getValues();
  var foundRow = -1;
  var customerEmail = "";
  var customerName = "";

  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0].toString() === targetOrderId.toString()) {
      foundRow = i + 1;
      customerName = rows[i][2];
      customerEmail = rows[i][3];
      if (trackingUrl) ordersSheet.getRange(foundRow, 14).setValue(trackingUrl);
      if (eta) ordersSheet.getRange(foundRow, 15).setValue(eta);
      break;
    }
  }

  if (foundRow > -1) {
    ordersSheet.getRange(foundRow, 13).setValue(newStatus);

    if (customerEmail) {
      sendStatusUpdateEmail(customerEmail, customerName, targetOrderId, newStatus, trackingUrl, eta);
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
 * Handle Full Order Details Edit (Tracking, ETA, Admin Notes)
 */
function handleUpdateOrderDetails(ordersSheet, data) {
  var targetOrderId = data.orderId;
  var rows = ordersSheet.getDataRange().getValues();
  var foundRow = -1;

  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0].toString() === targetOrderId.toString()) {
      foundRow = i + 1;
      break;
    }
  }

  if (foundRow > -1) {
    if (data.customerName) ordersSheet.getRange(foundRow, 3).setValue(data.customerName);
    if (data.customerPhone) ordersSheet.getRange(foundRow, 5).setValue(data.customerPhone);
    if (data.shippingAddress) ordersSheet.getRange(foundRow, 6).setValue(data.shippingAddress);
    if (data.status) ordersSheet.getRange(foundRow, 13).setValue(data.status);
    if (data.trackingUrl !== undefined) ordersSheet.getRange(foundRow, 14).setValue(data.trackingUrl);
    if (data.estimatedArrival !== undefined) ordersSheet.getRange(foundRow, 15).setValue(data.estimatedArrival);
    if (data.adminNotes !== undefined) ordersSheet.getRange(foundRow, 16).setValue(data.adminNotes);

    return jsonResponse({ status: "success", message: "Order #" + targetOrderId + " details updated!" });
  } else {
    return jsonResponse({ status: "error", message: "Order not found" });
  }
}

/**
 * Handle Delete Order
 */
function handleDeleteOrder(ordersSheet, data) {
  var targetOrderId = data.orderId;
  var rows = ordersSheet.getDataRange().getValues();
  var foundRow = -1;

  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0].toString() === targetOrderId.toString()) {
      foundRow = i + 1;
      break;
    }
  }

  if (foundRow > -1) {
    ordersSheet.deleteRow(foundRow);
    return jsonResponse({ status: "success", message: "Order #" + targetOrderId + " deleted from database." });
  } else {
    return jsonResponse({ status: "error", message: "Order ID not found" });
  }
}

/**
 * Promo Codes & Custom Products Sheet Logic
 */
function handleGetPromos(ss) {
  var promosSheet = getOrCreatePromosSheet(ss);
  var rows = promosSheet.getDataRange().getValues();
  if (rows.length <= 1) return jsonResponse({ status: "success", promos: [] });

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

function handleSavePromos(ss, data) {
  var promosSheet = getOrCreatePromosSheet(ss);
  var promosList = data.promos || [];
  var lastRow = promosSheet.getLastRow();
  if (lastRow > 1) promosSheet.getRange(2, 1, lastRow - 1, 4).clearContent();

  for (var i = 0; i < promosList.length; i++) {
    var p = promosList[i];
    promosSheet.appendRow([
      p.code.toString().toUpperCase(),
      p.discountPercent || 10,
      p.active !== false,
      p.description || ""
    ]);
  }
  return jsonResponse({ status: "success", message: "Promos saved!" });
}

function handleGetProducts(ss) {
  var productsSheet = getOrCreateProductsSheet(ss);
  var rows = productsSheet.getDataRange().getValues();
  if (rows.length <= 1) return jsonResponse({ status: "success", products: [] });

  var products = [];
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    if (!r[0]) continue;
    try {
      products.push(JSON.parse(r[1].toString()));
    } catch (e) {}
  }
  return jsonResponse({ status: "success", products: products });
}

function handleSaveProducts(ss, data) {
  var productsSheet = getOrCreateProductsSheet(ss);
  var productsList = data.products || [];
  var lastRow = productsSheet.getLastRow();
  if (lastRow > 1) productsSheet.getRange(2, 1, lastRow - 1, 2).clearContent();

  for (var i = 0; i < productsList.length; i++) {
    var prod = productsList[i];
    productsSheet.appendRow([prod.id, JSON.stringify(prod)]);
  }
  return jsonResponse({ status: "success", message: "Catalog products saved!" });
}

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
        status: row[12] ? row[12].toString() : "Processing",
        trackingUrl: row[13] ? row[13].toString() : "",
        estimatedArrival: row[14] ? row[14].toString() : ""
      });
    }
  }

  return jsonResponse({ status: "success", orders: userOrders });
}

/**
 * Self-Initializing Sheet Creators
 */
function getOrCreateOrdersSheet(ss) {
  var sheet = ss.getSheetByName("Orders");
  if (!sheet) sheet = ss.insertSheet("Orders");

  if (sheet.getLastRow() === 0) {
    var headers = [
      "Order ID", "Timestamp", "Customer Name", "Customer Email", "Customer Phone",
      "Shipping Address", "City", "Pincode", "Items Purchased", "Total Amount (INR)",
      "Payment Method", "Payment ID / Ref", "Status", "Tracking URL", "Estimated Arrival (ETA)", "Admin Notes"
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
  }
  return sheet;
}

function getOrCreatePromosSheet(ss) {
  var sheet = ss.getSheetByName("Promo_Codes");
  if (!sheet) sheet = ss.insertSheet("Promo_Codes");

  if (sheet.getLastRow() === 0) {
    var headers = ["Code", "Discount %", "Active", "Description"];
    sheet.appendRow(headers);

    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold")
               .setBackground("#3A5303")
               .setFontColor("#FFFFFF")
               .setFontFamily("Arial")
               .setFontSize(10);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getOrCreateProductsSheet(ss) {
  var sheet = ss.getSheetByName("Custom_Products");
  if (!sheet) sheet = ss.insertSheet("Custom_Products");

  if (sheet.getLastRow() === 0) {
    var headers = ["Product ID", "JSON Data"];
    sheet.appendRow(headers);
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold").setBackground("#3A5303").setFontColor("#FFFFFF");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getOrCreateCustomerSheet(ss) {
  var sheet = ss.getSheetByName("Customer_CRM");
  if (!sheet) sheet = ss.insertSheet("Customer_CRM");

  if (sheet.getLastRow() === 0) {
    var headers = ["Customer Name", "Email Address", "Phone Number", "City", "Total Orders", "First Seen"];
    sheet.appendRow(headers);
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold").setBackground("#3A5303").setFontColor("#FFFFFF");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getOrCreateAnalyticsSheet(ss) {
  var sheet = ss.getSheetByName("Analytics");
  if (!sheet) sheet = ss.insertSheet("Analytics");

  if (sheet.getLastRow() === 0) {
    var headers = ["Metric", "Value", "Last Updated"];
    sheet.appendRow(headers);
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold").setBackground("#3A5303").setFontColor("#FFFFFF");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

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
 * Wholesome Customer Invoice Email Template
 */
function sendWholesomeInvoiceEmail(email, name, orderId, total, items, address, eta) {
  if (!email) return;

  var subject = "🌸 Order Confirmed & Official Invoice #" + orderId + " - Brindavanam Organic Farms";
  var htmlBody = 
    "<div style='font-family: Georgia, serif; max-width: 650px; margin: 0 auto; border: 1px solid #d4cfc5; border-radius: 20px; overflow: hidden; background-color: #faf9f6;'>" +
      "<div style='background-color: #3A5303; padding: 32px 24px; text-align: center; color: white; border-bottom: 4px solid #94C000;'>" +
        "<h1 style='font-family: Georgia, serif; margin: 0; font-size: 28px; font-weight: normal; letter-spacing: 0.5px;'>Brindavanam Organic Farms</h1>" +
        "<p style='color: #94C000; font-size: 11px; margin-top: 6px; text-transform: uppercase; letter-spacing: 2px; font-family: sans-serif; font-weight: bold;'>Brindavan Farm Hyd • Handcrafted Vedic Produce</p>" +
      "</div>" +
      "<div style='padding: 32px 28px; color: #2c2a29; font-size: 15px; line-height: 1.7;'>" +
        "<p style='font-size: 18px; color: #3A5303; margin-top: 0;'>Namaste " + name + " 🙏</p>" +
        "<p>Thank you for welcoming <strong>Brindavanam</strong> into your home. Your order has been registered at our native farm in Hyderabad and is being freshly prepared using traditional wood-fire hand-churning and zero-heat Marachekku pressing methods.</p>" +
        
        "<div style='background-color: #ffffff; border: 1px solid #e2ded4; border-radius: 16px; padding: 24px; margin: 24px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.03);'>" +
          "<div style='display: flex; justify-content: space-between; border-bottom: 2px solid #3A5303; padding-bottom: 12px; margin-bottom: 16px;'>" +
            "<span style='font-family: sans-serif; font-size: 12px; font-weight: bold; color: #3A5303; text-transform: uppercase;'>Official Invoice Receipt</span>" +
            "<span style='font-family: monospace; font-size: 13px; font-weight: bold; color: #3A5303;'>" + orderId + "</span>" +
          "</div>" +
          "<p style='margin: 6px 0; font-size: 14px;'><strong>Items Purchased:</strong> " + items + "</p>" +
          "<p style='margin: 6px 0; font-size: 14px;'><strong>Total Paid:</strong> <span style='color: #3A5303; font-weight: bold; font-size: 16px;'>₹" + total + "</span> (100% Tax Inclusive)</p>" +
          "<p style='margin: 6px 0; font-size: 14px;'><strong>Delivery Address:</strong> " + address + "</p>" +
          "<p style='margin: 6px 0; font-size: 14px;'><strong>Estimated Arrival (ETA):</strong> <span style='color: #2b3e02; font-weight: bold;'>" + eta + "</span></p>" +
        "</div>" +

        "<p style='font-size: 13px; color: #5c5855; font-style: italic;'>\"Our Gir cows roam freely in native green pastures, and our wood-pressed oils are extracted with zero chemicals or bleach. Every glass jar carries the warmth of Vedic purity.\"</p>" +
        "<p style='font-size: 13px; color: #5c5855;'>With warm farm blessings,<br><strong style='color: #3A5303;'>The Brindavanam Farm Team</strong><br><a href='mailto:brindavanam1902@gmail.com' style='color: #3A5303;'>brindavanam1902@gmail.com</a></p>" +
      "</div>" +
      "<div style='background-color: #1c260b; padding: 20px; text-align: center; color: #a39e93; font-size: 11px; font-family: sans-serif;'>" +
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
    console.warn("Wholesome Customer Email failed:", e);
  }
}

/**
 * Status Update Email with Live Tracking URL & ETA
 */
function sendStatusUpdateEmail(email, name, orderId, newStatus, trackingUrl, eta) {
  if (!email) return;

  var subject = "🚚 Order #" + orderId + " Update: " + newStatus + " - Brindavanam Organic";
  var htmlBody = 
    "<div style='font-family: Georgia, serif; max-width: 600px; margin: 0 auto; border: 1px solid #d4cfc5; border-radius: 16px; overflow: hidden; background-color: #ffffff;'>" +
      "<div style='background-color: #3A5303; padding: 24px; text-align: center; color: white;'>" +
        "<h2 style='margin: 0; font-weight: normal;'>Brindavanam Dispatch Update</h2>" +
      "</div>" +
      "<div style='padding: 24px; color: #333; font-size: 14px; line-height: 1.6;'>" +
        "<p>Hello <strong>" + name + "</strong>,</p>" +
        "<p>Your order <strong>#" + orderId + "</strong> has been updated to: <span style='background-color: #3A5303; color: white; padding: 4px 12px; border-radius: 20px; font-family: sans-serif; font-size: 12px; font-weight: bold; text-transform: uppercase;'>" + newStatus + "</span></p>" +
        (eta ? "<p style='background-color: #F7F6F2; padding: 12px; border-radius: 8px; border-left: 4px solid #3A5303;'>📅 <strong>Estimated Arrival Date (ETA):</strong> " + eta + "</p>" : "") +
        (trackingUrl ? "<p style='margin-top: 16px;'><a href='" + trackingUrl + "' target='_blank' style='background-color: #3A5303; color: white; padding: 12px 24px; text-decoration: none; border-radius: 10px; font-family: sans-serif; font-weight: bold; font-size: 13px; display: inline-block;'>📍 Track Your Parcel Live</a></p>" : "") +
        "<p style='margin-top: 24px; font-size: 12px; color: #666;'>For assistance, email us directly at <strong>brindavanam1902@gmail.com</strong>.</p>" +
      "</div>" +
      "<div style='background-color: #1c260b; padding: 14px; text-align: center; color: #a39e93; font-size: 11px; font-family: sans-serif;'>" +
        "Brindavan Farm Hyd • Powered By Rendervoid" +
      "</div>" +
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

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
