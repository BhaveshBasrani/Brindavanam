/**
 * BRINDAVANAM NATURE CENTRE - GOOGLE APPS SCRIPT BACKEND ENGINE
 * Spreadsheet ID: 1j023yC9z_V6T_Bohb-t6Euh_fDInM_vSdrS3-H2sR8w
 *
 * EXACT COLUMN LAYOUT MATCHING USER SPREADSHEET (16 COLUMNS):
 * A (1): Order ID
 * B (2): Timestamp / Date
 * C (3): Customer Name
 * D (4): Customer Email
 * E (5): Customer Phone
 * F (6): Shipping Address
 * G (7): City
 * H (8): Pincode
 * I (9): Items Purchased
 * J (10): Total Amount (INR)
 * K (11): Payment Method
 * L (12): Payment ID / Ref
 * M (13): Status
 * N (14): Tracking URL
 * O (15): ETA
 * P (16): Admin Notes
 */

var DEFAULT_ANNOUNCEMENTS = [
  "FESTIVE HARVEST SALE: FREE SHIPPING ON ALL ORDERS ABOVE ₹2000 PAN-INDIA",
  "100% PURE A2 DESI COW BILONA GHEE — TRADITIONALLY HAND-CHURNED IN EARTHEN POTS",
  "AUTOMATIC 10% BULK FARM DISCOUNT APPLIED ON ₹5000+ PURCHASES",
  "WOOD-PRESSED COLD-EXTRACTED OILS — KUSUMA, SESAME & MUSTARD OILS DIRECT FROM FARM"
];

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ensureAndRepairSheetStructure(ss);

  var action = e && e.parameter ? e.parameter.action : '';

  if (action === 'repairSheets') {
    return handleRepairSheets(ss);
  }

  if (action === 'getAnnouncements' || action === 'get_announcements') {
    return handleGetAnnouncements(ss);
  }

  if (action === 'getPromos') {
    return handleGetPromos(ss);
  }

  if (action === 'getProducts') {
    return handleGetProducts(ss);
  }

  if (action === 'getReviews') {
    return handleGetReviews(ss);
  }

  if (action === 'get_user_orders') {
    var email = e.parameter.email || '';
    return handleGetUserOrders(ss, email);
  }

  // Default: Get all orders
  return handleGetOrders(ss);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    ensureAndRepairSheetStructure(ss);

    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'ignored',
        message: 'Empty request body ignored'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var postData = JSON.parse(e.postData.contents);
    var action = postData && postData.action ? postData.action : '';

    if (action === 'repairSheets') {
      return handleRepairSheets(ss);
    }

    if (action === 'updateAnnouncements' || action === 'save_announcements') {
      return handleUpdateAnnouncements(ss, postData.announcements);
    }

    if (action === 'resetAnnouncements' || action === 'reset_announcements') {
      return handleResetAnnouncements(ss);
    }

    if (action === 'updatePromos' || action === 'save_promos') {
      return handleUpdatePromos(ss, postData.promos);
    }

    if (action === 'updateProducts' || action === 'save_products') {
      return handleUpdateProducts(ss, postData.products);
    }

    if (action === 'updateSingleProduct' || action === 'update_product') {
      return handleUpdateSingleProduct(ss, postData.product);
    }

    if (action === 'updateOrderDetails' || action === 'update_order_details') {
      return handleUpdateOrderDetails(ss, postData.orderId, postData);
    }

    if (action === 'deleteOrder' || action === 'delete_order') {
      return handleDeleteOrder(ss, postData.orderId);
    }

    if (action === 'submitReview') {
      return handleSubmitReview(ss, postData.review);
    }

    if (action === 'updateReviews') {
      return handleUpdateReviews(ss, postData.reviews);
    }

    if (action === 'deleteReview') {
      return handleDeleteReview(ss, postData.reviewId);
    }

    if (action === 'saveOrder' || action === 'create_order') {
      return handleSaveOrder(ss, postData);
    }

    // Default response for unknown action
    return ContentService.createTextOutput(JSON.stringify({
      status: 'ignored',
      message: 'No valid action provided'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * SELF-HEALING ENGINE: Auto-Repair & Normalize Headers Without Data Loss
 */
function ensureAndRepairSheetStructure(ss) {
  var expectedOrdersHeaders = [
    'Order ID', 'Timestamp', 'Customer Name', 'Customer Email', 'Customer Phone', 
    'Shipping Address', 'City', 'Pincode', 'Items Purchased', 'Total Amount (INR)', 
    'Payment Method', 'Payment ID / Ref', 'Status', 'Tracking URL', 'ETA', 'Admin Notes'
  ];

  // 1. Repair Orders Sheet Tab
  var ordersSheet = ss.getSheetByName('Orders');
  if (!ordersSheet) {
    ordersSheet = ss.insertSheet('Orders');
    ordersSheet.appendRow(expectedOrdersHeaders);
    formatHeaderRow(ordersSheet, 16);
  } else {
    var firstRow = ordersSheet.getRange(1, 1, 1, 16).getValues()[0];
    var needsHeaderRepair = false;

    for (var i = 0; i < expectedOrdersHeaders.length; i++) {
      if (!firstRow[i] || firstRow[i].toString().trim().toLowerCase() !== expectedOrdersHeaders[i].toLowerCase()) {
        needsHeaderRepair = true;
        break;
      }
    }

    if (needsHeaderRepair) {
      ordersSheet.getRange(1, 1, 1, 16).setValues([expectedOrdersHeaders]);
      formatHeaderRow(ordersSheet, 16);
    }
  }

  // 2. Repair Announcements Tab
  var annSheet = ss.getSheetByName('Announcements');
  if (!annSheet) {
    annSheet = ss.insertSheet('Announcements');
    annSheet.appendRow(['Announcement Message', 'Is Active', 'Created Date']);
    formatHeaderRow(annSheet, 3);
    for (var a = 0; a < DEFAULT_ANNOUNCEMENTS.length; a++) {
      annSheet.appendRow([DEFAULT_ANNOUNCEMENTS[a], true, new Date().toLocaleDateString('en-IN')]);
    }
  }

  // 3. Repair PromoCodes Sheet Tab
  var promoSheet = ss.getSheetByName('PromoCodes');
  if (!promoSheet) {
    promoSheet = ss.insertSheet('PromoCodes');
    promoSheet.appendRow(['Coupon Code', 'Discount Percent', 'Is Active', 'Description']);
    formatHeaderRow(promoSheet, 4);
  }

  // 4. Repair Products Sheet Tab
  var prodSheet = ss.getSheetByName('Products');
  if (!prodSheet) {
    prodSheet = ss.insertSheet('Products');
    prodSheet.appendRow(['Product ID', 'Product JSON Payload', 'Name', 'Category']);
    formatHeaderRow(prodSheet, 4);
  }

  // 5. Repair Reviews Sheet Tab
  var revSheet = ss.getSheetByName('Reviews');
  if (!revSheet) {
    revSheet = ss.insertSheet('Reviews');
    revSheet.appendRow(['Review ID', 'Author Name', 'Location', 'Rating', 'Produce Tag', 'Produce Name', 'Headline', 'Review Text', 'Is Verified', 'Date']);
    formatHeaderRow(revSheet, 10);
  }

  // 6. Repair Customers Sheet Tab (CRM)
  var custSheet = ss.getSheetByName('Customers');
  if (!custSheet) {
    custSheet = ss.insertSheet('Customers');
    custSheet.appendRow(['Full Name', 'Email', 'Phone', 'City', 'Total Orders', 'First Registered Date']);
    formatHeaderRow(custSheet, 6);
  }
}

/**
 * Format Sheet Header Row with Professional Olive Green Theme
 */
function formatHeaderRow(sheet, colCount) {
  try {
    var range = sheet.getRange(1, 1, 1, colCount);
    range.setBackground('#3A5303');
    range.setFontColor('#FFFFFF');
    range.setFontWeight('bold');
    range.setFontFamily('Arial');
    sheet.setRowHeight(1, 32);
  } catch (e) {}
}

/**
 * Announcement Ticker Handlers
 */
function handleGetAnnouncements(ss) {
  var annSheet = ss.getSheetByName('Announcements');
  if (!annSheet) return ContentService.createTextOutput(JSON.stringify({ status: 'success', announcements: DEFAULT_ANNOUNCEMENTS })).setMimeType(ContentService.MimeType.JSON);

  var data = annSheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] && (data[i][1] === true || data[i][1] === 'true' || data[i][1] === 'TRUE' || data[i][1] === '')) {
      list.push(data[i][0].toString());
    }
  }

  if (list.length === 0) list = DEFAULT_ANNOUNCEMENTS;

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    announcements: list
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleUpdateAnnouncements(ss, announcementsList) {
  var annSheet = ss.getSheetByName('Announcements');
  if (!annSheet) annSheet = ss.insertSheet('Announcements');

  annSheet.clear();
  annSheet.appendRow(['Announcement Message', 'Is Active', 'Created Date']);
  formatHeaderRow(annSheet, 3);

  if (Array.isArray(announcementsList) && announcementsList.length > 0) {
    for (var i = 0; i < announcementsList.length; i++) {
      annSheet.appendRow([announcementsList[i], true, new Date().toLocaleDateString('en-IN')]);
    }
  } else {
    for (var d = 0; d < DEFAULT_ANNOUNCEMENTS.length; d++) {
      annSheet.appendRow([DEFAULT_ANNOUNCEMENTS[d], true, new Date().toLocaleDateString('en-IN')]);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Announcement ticker offers updated successfully!'
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleResetAnnouncements(ss) {
  return handleUpdateAnnouncements(ss, DEFAULT_ANNOUNCEMENTS);
}

/**
 * Manual Repair Sheets Action Endpoint
 */
function handleRepairSheets(ss) {
  ensureAndRepairSheetStructure(ss);
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'All Google Sheet tabs and header columns have been repaired & normalized with ZERO data loss!'
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Fetch All Orders List
 */
function handleGetOrders(ss) {
  var ordersSheet = ss.getSheetByName('Orders');
  if (!ordersSheet) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'success', orders: [] })).setMimeType(ContentService.MimeType.JSON);
  }

  var data = ordersSheet.getDataRange().getValues();
  var orders = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[0]) continue;

    var orderId = row[0].toString();
    var timestamp = row[1] ? row[1].toString() : '';
    var name = row[2] ? row[2].toString() : '';
    var email = row[3] ? row[3].toString() : '';
    var phone = row[4] ? row[4].toString() : '';
    var addressStr = row[5] ? row[5].toString() : '';
    var city = row[6] ? row[6].toString() : '';
    var pincode = row[7] ? row[7].toString() : '';
    var itemsSummary = row[8] ? row[8].toString() : '';
    var totalAmount = parseFloat(row[9]) || 0;
    var paymentMethod = row[10] ? row[10].toString() : 'Razorpay';
    var paymentId = row[11] ? row[11].toString() : 'pay_online';
    var status = row[12] ? row[12].toString() : 'Processing';
    var trackingUrl = row[13] ? row[13].toString() : '';
    var eta = row[14] ? row[14].toString() : '3-5 Business Days';
    var adminNotes = row[15] ? row[15].toString() : '';

    orders.push({
      id: orderId,
      date: timestamp,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      itemsSummary: itemsSummary,
      items: [],
      subtotal: totalAmount,
      discount: 0,
      total: totalAmount,
      status: status,
      shippingAddress: {
        fullName: name,
        email: email,
        phone: phone,
        addressLine1: addressStr,
        city: city,
        state: 'Telangana',
        pincode: pincode
      },
      paymentMethod: paymentMethod,
      paymentId: paymentId,
      city: city,
      trackingUrl: trackingUrl,
      estimatedArrival: eta,
      adminNotes: adminNotes
    });
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    orders: orders.reverse()
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Fetch Specific User Orders By Email
 */
function handleGetUserOrders(ss, userEmail) {
  if (!userEmail) return handleGetOrders(ss);

  var ordersSheet = ss.getSheetByName('Orders');
  if (!ordersSheet) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'success', orders: [] })).setMimeType(ContentService.MimeType.JSON);
  }

  var data = ordersSheet.getDataRange().getValues();
  var orders = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[0]) continue;
    var rowEmail = row[3] ? row[3].toString().toLowerCase() : '';
    
    if (rowEmail === userEmail.toLowerCase()) {
      orders.push({
        id: row[0].toString(),
        date: row[1] ? row[1].toString() : '',
        customerName: row[2] ? row[2].toString() : '',
        customerEmail: row[3] ? row[3].toString() : '',
        customerPhone: row[4] ? row[4].toString() : '',
        itemsSummary: row[8] ? row[8].toString() : '',
        total: parseFloat(row[9]) || 0,
        paymentMethod: row[10] ? row[10].toString() : 'Razorpay',
        paymentId: row[11] ? row[11].toString() : '',
        status: row[12] ? row[12].toString() : 'Processing',
        trackingUrl: row[13] ? row[13].toString() : '',
        estimatedArrival: row[14] ? row[14].toString() : '3-5 Business Days',
        shippingAddress: {
          fullName: row[2] ? row[2].toString() : '',
          email: row[3] ? row[3].toString() : '',
          phone: row[4] ? row[4].toString() : '',
          addressLine1: row[5] ? row[5].toString() : '',
          city: row[6] ? row[6].toString() : '',
          state: 'Telangana',
          pincode: row[7] ? row[7].toString() : ''
        }
      });
    }
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    orders: orders.reverse()
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Save New Customer Order (With Payload Verification To Reject Ghost Orders)
 */
function handleSaveOrder(ss, order) {
  // STRICT VERIFICATION: Ignore empty ping/ghost order requests
  if (!order || (!order.id && !order.itemsSummary && (!order.total || order.total <= 0) && (!order.customerEmail && !order.customerPhone))) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'ignored',
      message: 'Empty or invalid order payload ignored'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // Reject orders with total 0 and no customer info
  if ((!order.total || order.total <= 0) && (!order.shippingAddress || !order.shippingAddress.fullName)) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'ignored',
      message: 'Zero-rupee ghost order rejected'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  var ordersSheet = ss.getSheetByName('Orders');
  
  var itemsSummary = order.items && order.items.length > 0
    ? order.items.map(function(item) {
        return (item.product ? item.product.name : 'Produce') + ' (' + (item.selectedVariant ? item.selectedVariant.weight : '') + ') x' + item.quantity;
      }).join(', ')
    : (order.itemsSummary || 'Organic Produce Basket');

  var fullName = order.shippingAddress ? order.shippingAddress.fullName : (order.customerName || 'Valued Patron');
  var email = order.shippingAddress ? order.shippingAddress.email : (order.customerEmail || '');
  var phone = order.shippingAddress ? order.shippingAddress.phone : (order.customerPhone || '');
  var addressLine = order.shippingAddress ? order.shippingAddress.addressLine1 : '';
  var city = order.shippingAddress ? order.shippingAddress.city : (order.city || 'Hyderabad');
  var pincode = order.shippingAddress ? order.shippingAddress.pincode : '';

  var orderId = order.id || ('BRND-' + Date.now().toString().slice(-6));
  var timestamp = order.date || new Date().toLocaleString('en-IN');

  ordersSheet.appendRow([
    orderId,
    timestamp,
    fullName,
    email,
    phone,
    addressLine,
    city,
    pincode,
    itemsSummary,
    order.total || 0,
    order.paymentMethod || 'Razorpay',
    order.paymentId || 'pay_online',
    order.status || 'Processing',
    order.trackingUrl || '',
    order.estimatedArrival || '3-5 Business Days',
    order.adminNotes || ''
  ]);

  updateCustomerCRMRecord(ss, fullName, email, phone, city);

  if (email) {
    sendWholesomeInvoiceEmail(email, fullName, orderId, order.total, itemsSummary, addressLine + ', ' + city, order.estimatedArrival || '3-5 Business Days');
  }

  sendAdminOrderNotificationEmail(fullName, email, phone, orderId, order.total, itemsSummary, addressLine + ', ' + city);

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Order #' + orderId + ' saved to sheet perfectly and invoice dispatched!'
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Update Specific Order Details
 */
function handleUpdateOrderDetails(ss, orderId, details) {
  var ordersSheet = ss.getSheetByName('Orders');
  if (!ordersSheet) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Orders sheet not found' })).setMimeType(ContentService.MimeType.JSON);
  }

  var data = ordersSheet.getDataRange().getValues();
  var foundRow = -1;

  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString() === orderId.toString()) {
      foundRow = i + 1;
      break;
    }
  }

  if (foundRow === -1) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Order #' + orderId + ' not found' })).setMimeType(ContentService.MimeType.JSON);
  }

  if (details.customerName) ordersSheet.getRange(foundRow, 3).setValue(details.customerName);
  if (details.customerPhone) ordersSheet.getRange(foundRow, 5).setValue(details.customerPhone);
  if (details.shippingAddress && details.shippingAddress.addressLine1) ordersSheet.getRange(foundRow, 6).setValue(details.shippingAddress.addressLine1);
  if (details.status) ordersSheet.getRange(foundRow, 13).setValue(details.status);
  if (details.trackingUrl !== undefined) ordersSheet.getRange(foundRow, 14).setValue(details.trackingUrl);
  if (details.estimatedArrival) ordersSheet.getRange(foundRow, 15).setValue(details.estimatedArrival);
  if (details.adminNotes !== undefined) ordersSheet.getRange(foundRow, 16).setValue(details.adminNotes);

  var customerEmail = ordersSheet.getRange(foundRow, 4).getValue();
  var customerName = ordersSheet.getRange(foundRow, 3).getValue();
  var newStatus = details.status || ordersSheet.getRange(foundRow, 13).getValue();
  var trackingUrl = details.trackingUrl || ordersSheet.getRange(foundRow, 14).getValue();
  var eta = details.estimatedArrival || ordersSheet.getRange(foundRow, 15).getValue();

  if (customerEmail && details.status) {
    sendStatusUpdateEmail(customerEmail, customerName, orderId, newStatus, trackingUrl, eta);
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Order #' + orderId + ' details updated successfully in sheet!'
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Delete Order Record
 */
function handleDeleteOrder(ss, orderId) {
  var ordersSheet = ss.getSheetByName('Orders');
  if (!ordersSheet) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Orders sheet not found' })).setMimeType(ContentService.MimeType.JSON);
  }

  var data = ordersSheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString() === orderId.toString()) {
      ordersSheet.deleteRow(i + 1);
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Order #' + orderId + ' deleted permanently!'
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: 'error',
    message: 'Order #' + orderId + ' not found'
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Fetch Reviews List
 */
function handleGetReviews(ss) {
  var revSheet = ss.getSheetByName('Reviews');
  if (!revSheet) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'success', reviews: [] })).setMimeType(ContentService.MimeType.JSON);
  }

  var data = revSheet.getDataRange().getValues();
  var reviews = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    reviews.push({
      id: data[i][0].toString(),
      name: data[i][1] ? data[i][1].toString() : 'Valued Patron',
      location: data[i][2] ? data[i][2].toString() : 'Hyderabad',
      rating: parseInt(data[i][3]) || 5,
      produceTag: data[i][4] ? data[i][4].toString() : 'ghee',
      produceName: data[i][5] ? data[i][5].toString() : 'A2 Desi Cow Bilona Ghee',
      headline: data[i][6] ? data[i][6].toString() : '',
      review: data[i][7] ? data[i][7].toString() : '',
      verified: data[i][8] === true || data[i][8] === 'TRUE' || data[i][8] === 'true',
      date: data[i][9] ? data[i][9].toString() : new Date().toLocaleDateString('en-IN')
    });
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    reviews: reviews.reverse()
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Submit New Customer Review
 */
function handleSubmitReview(ss, review) {
  var revSheet = ss.getSheetByName('Reviews');
  var revId = 'REV-' + Date.now();
  var dateStr = new Date().toLocaleDateString('en-IN');

  revSheet.appendRow([
    revId,
    review.name || 'Valued Patron',
    review.location || 'Hyderabad',
    review.rating || 5,
    review.produceTag || 'ghee',
    review.produceName || 'A2 Desi Cow Bilona Ghee',
    review.headline || 'Excellent Produce!',
    review.review || '',
    true,
    dateStr
  ]);

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Thank you! Your review has been saved to Brindavanam Nature Centre!'
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Update Reviews List
 */
function handleUpdateReviews(ss, reviewsList) {
  var revSheet = ss.getSheetByName('Reviews');

  revSheet.clear();
  revSheet.appendRow(['Review ID', 'Author Name', 'Location', 'Rating', 'Produce Tag', 'Produce Name', 'Headline', 'Review Text', 'Is Verified', 'Date']);
  formatHeaderRow(revSheet, 10);

  if (Array.isArray(reviewsList)) {
    for (var i = 0; i < reviewsList.length; i++) {
      var r = reviewsList[i];
      revSheet.appendRow([r.id, r.name, r.location, r.rating, r.produceTag, r.produceName, r.headline, r.review, r.verified, r.date]);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Reviews updated successfully!'
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Delete Review
 */
function handleDeleteReview(ss, reviewId) {
  var revSheet = ss.getSheetByName('Reviews');
  if (!revSheet) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Reviews sheet not found' })).setMimeType(ContentService.MimeType.JSON);
  }

  var data = revSheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString() === reviewId.toString()) {
      revSheet.deleteRow(i + 1);
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Review #' + reviewId + ' deleted permanently!'
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: 'error',
    message: 'Review #' + reviewId + ' not found'
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Fetch Promo Coupons List
 */
function handleGetPromos(ss) {
  var promoSheet = ss.getSheetByName('PromoCodes');
  if (!promoSheet) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'success', promos: [] })).setMimeType(ContentService.MimeType.JSON);
  }

  var data = promoSheet.getDataRange().getValues();
  var promos = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    promos.push({
      code: data[i][0].toString(),
      discountPercent: parseFloat(data[i][1]) || 10,
      active: data[i][2] === true || data[i][2] === 'true' || data[i][2] === 'TRUE',
      description: data[i][3] ? data[i][3].toString() : ''
    });
  }

  return ContentService.createTextOutput(JSON.stringify({ status: 'success', promos: promos })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Update Promo Coupons List
 */
function handleUpdatePromos(ss, promosList) {
  var promoSheet = ss.getSheetByName('PromoCodes');

  promoSheet.clear();
  promoSheet.appendRow(['Coupon Code', 'Discount Percent', 'Is Active', 'Description']);
  formatHeaderRow(promoSheet, 4);

  if (Array.isArray(promosList)) {
    for (var i = 0; i < promosList.length; i++) {
      var p = promosList[i];
      promoSheet.appendRow([p.code, p.discountPercent, p.active, p.description || '']);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Promo coupons updated successfully!' })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Fetch Products Catalog
 */
function handleGetProducts(ss) {
  var prodSheet = ss.getSheetByName('Products');
  if (!prodSheet) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'success', products: [] })).setMimeType(ContentService.MimeType.JSON);
  }

  var data = prodSheet.getDataRange().getValues();
  var products = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    try {
      var prodObj = JSON.parse(data[i][1]);
      products.push(prodObj);
    } catch (e) {}
  }

  return ContentService.createTextOutput(JSON.stringify({ status: 'success', products: products })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Update Products Catalog
 */
function handleUpdateProducts(ss, productsList) {
  var prodSheet = ss.getSheetByName('Products');

  prodSheet.clear();
  prodSheet.appendRow(['Product ID', 'Product JSON Payload', 'Name', 'Category']);
  formatHeaderRow(prodSheet, 4);

  if (Array.isArray(productsList)) {
    for (var i = 0; i < productsList.length; i++) {
      var p = productsList[i];
      prodSheet.appendRow([p.id, JSON.stringify(p), p.name, p.category]);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Products catalog updated successfully!' })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Update Single Product
 */
function handleUpdateSingleProduct(ss, product) {
  if (!product || !product.id) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Invalid product payload' })).setMimeType(ContentService.MimeType.JSON);
  }
  var prodSheet = ss.getSheetByName('Products');
  if (!prodSheet) prodSheet = ss.insertSheet('Products');

  var data = prodSheet.getDataRange().getValues();
  var foundRow = -1;

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] && data[i][0].toString() === product.id.toString()) {
      foundRow = i + 1;
      break;
    }
  }

  if (foundRow > -1) {
    prodSheet.getRange(foundRow, 2).setValue(JSON.stringify(product));
    prodSheet.getRange(foundRow, 3).setValue(product.name);
    prodSheet.getRange(foundRow, 4).setValue(product.category);
  } else {
    prodSheet.appendRow([product.id, JSON.stringify(product), product.name, product.category]);
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Product ' + product.name + ' updated successfully!'
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Update CRM Record
 */
function updateCustomerCRMRecord(ss, name, email, phone, city) {
  if (!email) return;
  var customerSheet = ss.getSheetByName('Customers');

  var data = customerSheet.getDataRange().getValues();
  var foundRow = -1;
  for (var i = 1; i < data.length; i++) {
    if (data[i][1] && data[i][1].toString().toLowerCase() === email.toLowerCase()) {
      foundRow = i + 1;
      break;
    }
  }

  var nowStr = new Date().toLocaleDateString('en-IN');
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
 * 1. BREATHTAKING WHOLESOME CUSTOMER INVOICE EMAIL TEMPLATE
 */
function sendWholesomeInvoiceEmail(email, name, orderId, total, items, address, eta) {
  if (!email) return;

  var subject = "Order Confirmed & Official Invoice #" + orderId + " - Brindavanam Nature Centre";
  var htmlBody = 
    "<div style='font-family: Georgia, serif; max-width: 650px; margin: 0 auto; border: 1px solid #d4cfc5; border-radius: 20px; overflow: hidden; background-color: #faf9f6; shadow: 0 10px 30px rgba(0,0,0,0.05);'>" +
      "<div style='background-color: #3A5303; padding: 36px 24px; text-align: center; color: white; border-bottom: 5px solid #94C000;'>" +
        "<span style='background-color: #94C000; color: #1c260b; font-size: 10px; font-weight: font-extrabold; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 2px; font-family: sans-serif;'>Authentic Farm Produce</span>" +
        "<h1 style='font-family: Georgia, serif; margin: 12px 0 4px 0; font-size: 30px; font-weight: normal; letter-spacing: 0.5px;'>Brindavanam Nature Centre</h1>" +
        "<p style='color: #e2ded4; font-size: 12px; margin: 0; font-family: sans-serif; font-weight: 300;'>Pure • Natural • Honest — Direct from Hyderabad Farm</p>" +
      "</div>" +
      "<div style='padding: 36px 30px; color: #2c2a29; font-size: 15px; line-height: 1.7;'>" +
        "<p style='font-size: 20px; color: #3A5303; margin-top: 0; font-weight: normal;'>Namaste " + name + ",</p>" +
        "<p>Thank you for welcoming <strong>Brindavanam Nature Centre</strong> into your home. Your order has been registered at our native farm in Hyderabad and is being freshly prepared using traditional wood-fire hand-churning and zero-heat Marachekku pressing methods.</p>" +
        
        "<div style='background-color: #ffffff; border: 1px solid #e2ded4; border-radius: 16px; padding: 24px; margin: 28px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.03);'>" +
          "<div style='display: flex; justify-content: space-between; border-bottom: 2px solid #3A5303; padding-bottom: 12px; margin-bottom: 16px;'>" +
            "<span style='font-family: sans-serif; font-size: 12px; font-weight: bold; color: #3A5303; text-transform: uppercase;'>Official Tax Invoice Receipt</span>" +
            "<span style='font-family: monospace; font-size: 13px; font-weight: bold; color: #3A5303;'>" + orderId + "</span>" +
          "</div>" +
          "<p style='margin: 8px 0; font-size: 14px;'><strong>Items Purchased:</strong> " + items + "</p>" +
          "<p style='margin: 8px 0; font-size: 14px;'><strong>Total Paid:</strong> <span style='color: #3A5303; font-weight: bold; font-size: 17px;'>₹" + total + "</span> (100% Tax Inclusive)</p>" +
          "<p style='margin: 8px 0; font-size: 14px;'><strong>Delivery Address:</strong> " + address + "</p>" +
          "<p style='margin: 8px 0; font-size: 14px;'><strong>Estimated Arrival (ETA):</strong> <span style='color: #2b3e02; font-weight: bold;'>" + eta + "</span></p>" +
        "</div>" +

        "<div style='background-color: #f0f4e8; border-left: 4px solid #3A5303; padding: 16px; border-radius: 8px; margin: 20px 0; font-size: 13px; color: #3A5303; font-style: italic;'>" +
          "\"Our Gir cows roam freely in native green pastures, and our wood-pressed oils are extracted with zero chemicals or bleach. Every glass jar carries the warmth of Vedic purity.\"" +
        "</div>" +

        "<p style='font-size: 13px; color: #5c5855;'>With warm farm blessings,<br><strong style='color: #3A5303; font-size: 14px;'>Brindavanam Nature Centre Team</strong><br><a href='mailto:brundavanamteam@gmail.com' style='color: #3A5303; font-weight: bold;'>brundavanamteam@gmail.com</a></p>" +
      "</div>" +

      "<div style='background-color: #1c260b; padding: 24px; text-align: center; color: #a39e93; font-size: 11px; font-family: sans-serif;'>" +
        "© 2026 Brindavanam Nature Centre • Hyderabad, Telangana, India • Powered By Rendervoid" +
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
 * 2. REAL-TIME DISPATCH / TRACKING STATUS UPDATE EMAIL
 */
function sendStatusUpdateEmail(email, name, orderId, newStatus, trackingUrl, eta) {
  if (!email) return;

  var subject = "Order #" + orderId + " Transit Status: " + newStatus + " - Brindavanam Nature Centre";
  var htmlBody = 
    "<div style='font-family: Georgia, serif; max-width: 600px; margin: 0 auto; border: 1px solid #d4cfc5; border-radius: 16px; overflow: hidden; background-color: #ffffff; shadow: 0 8px 24px rgba(0,0,0,0.04);'>" +
      "<div style='background-color: #3A5303; padding: 28px; text-align: center; color: white; border-bottom: 4px solid #94C000;'>" +
        "<h2 style='margin: 0; font-weight: normal; font-size: 24px;'>Brindavanam Dispatch Update</h2>" +
        "<p style='color: #94C000; font-size: 11px; font-weight: bold; margin-top: 4px; text-transform: uppercase; font-family: sans-serif;'>Parcel Transit Notification</p>" +
      "</div>" +
      "<div style='padding: 28px; color: #333; font-size: 14px; line-height: 1.7;'>" +
        "<p style='font-size: 16px;'>Hello <strong>" + name + "</strong>,</p>" +
        "<p>Your order <strong>#" + orderId + "</strong> has been updated to: <span style='background-color: #3A5303; color: white; padding: 5px 14px; border-radius: 20px; font-family: sans-serif; font-size: 12px; font-weight: bold; text-transform: uppercase; display: inline-block;'>" + newStatus + "</span></p>" +
        
        (trackingUrl ? "<div style='background-color: #F7F6F2; border: 1px solid #e0ddd5; border-radius: 12px; margin: 20px 0; padding: 16px;'><p style='margin: 0 0 6px 0; font-size: 12px; text-transform: uppercase; font-weight: bold; color: #3A5303;'>Live Parcel Tracking URL:</p><a href='" + trackingUrl + "' target='_blank' style='color: #3A5303; font-weight: bold; font-family: monospace; word-break: break-all; font-size: 13px;'>" + trackingUrl + "</a></div>" : "") +
        (eta ? "<p style='font-size: 14px;'><strong>Approx Date of Arrival (ETA):</strong> <span style='color: #3A5303; font-weight: bold;'>" + eta + "</span></p>" : "") +

        "<p style='margin-top: 24px; font-size: 12px; color: #666;'>If you have any questions about your parcel, reply to this mail or contact us at <a href='mailto:brundavanamteam@gmail.com' style='color: #3A5303; font-weight: bold;'>brundavanamteam@gmail.com</a>.</p>" +
      "</div>" +
      "<div style='background-color: #1c260b; padding: 18px; text-align: center; color: #aaa; font-size: 10px; font-family: sans-serif;'>" +
        "© 2026 Brindavanam Nature Centre • Hyderabad • Handcrafted Farm Produce" +
      "</div>" +
    "</div>";

  try {
    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: htmlBody
    });
  } catch (e) {
    console.warn("Status Update Email failed:", e);
  }
}

/**
 * 3. INSTANT ADMIN ORDER NOTIFICATION ALERT EMAIL
 */
function sendAdminOrderNotificationEmail(name, email, phone, orderId, total, items, address) {
  var adminEmail = "brundavanamteam@gmail.com";
  var subject = "NEW ORDER RECEIVED #" + orderId + " (₹" + total + ") - Brindavanam Nature";
  var htmlBody = 
    "<div style='font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #3A5303; border-radius: 16px; padding: 24px; background-color: #ffffff;'>" +
      "<div style='background-color: #3A5303; color: white; padding: 16px; border-radius: 12px; text-align: center; margin-bottom: 20px;'>" +
        "<h2 style='margin: 0;'>New Farm Order Received</h2>" +
        "<p style='margin: 4px 0 0 0; font-size: 12px; color: #94C000; font-weight: bold;'>Order ID: #" + orderId + "</p>" +
      "</div>" +
      "<p style='font-size: 14px;'><strong>Customer Name:</strong> " + name + "</p>" +
      "<p style='font-size: 14px;'><strong>Email:</strong> " + email + "</p>" +
      "<p style='font-size: 14px;'><strong>Phone:</strong> " + phone + "</p>" +
      "<p style='font-size: 14px;'><strong>Items Purchased:</strong> " + items + "</p>" +
      "<p style='font-size: 16px; color: #3A5303; font-weight: bold;'>Total Amount Paid: ₹" + total + "</p>" +
      "<p style='font-size: 14px;'><strong>Delivery Address:</strong> " + address + "</p>" +
      "<div style='margin-top: 20px; border-top: 1px solid #eee; padding-top: 12px; text-align: center; font-size: 11px; color: #777;'>" +
        "Open your Admin Operations Desk to inspect and update ETA / Tracking info." +
      "</div>" +
    "</div>";

  try {
    MailApp.sendEmail({
      to: adminEmail,
      subject: subject,
      htmlBody: htmlBody
    });
  } catch (e) {
    console.warn("Admin Notification Email failed:", e);
  }
}
