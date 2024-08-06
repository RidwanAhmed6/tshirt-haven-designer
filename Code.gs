function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index');
}


function getProducts() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Products');
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  const products = [];

  data.forEach(row => {
    let product = {};
    headers.forEach((header, index) => {
      product[header] = row[index];
    });
    products.push(product);
  });

  Logger.log(products);
  return products;
}






function submitOrder(order) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders');
  const lastRow = sheet.getLastRow();
  const orderNo = lastRow + 1; // Order No will be the next row number
  sheet.appendRow([
    orderNo,
    new Date(),
    order.productName,
    order.size,
    order.color,
    order.quantity,
    order.name,
    order.mobile,
    order.area,
    order.thana,
    order.district,
    order.shippingMethod,
    order.total
  ]);
}

const getStyle = e => HtmlService.createHtmlOutputFromFile(e ? 'css1' : 'css2').getContent();

function doGet() {
  var html = HtmlService.createHtmlOutputFromFile('Index');
  var pageData = html
    .setTitle('T Shirt Haven')
    .setFaviconUrl('https://www.gstatic.com/images/icons/material/product/2x/apps_script_64dp.png')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
  return pageData;
}


function getProducts() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Products');
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  const products = [];

  data.forEach(row => {
    let product = {};
    headers.forEach((header, index) => {
      product[header] = row[index];
    });
    products.push(product);
  });

  Logger.log(products);
  return products;
}






function submitOrder(order) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders');
  const lastRow = sheet.getLastRow();
  const orderNo = lastRow + 1; // Order No will be the next row number
  sheet.appendRow([
    orderNo,
    new Date(),
    order.productName,
    order.size,
    order.color,
    order.quantity,
    order.name,
    order.mobile,
    order.area,
    order.thana,
    order.district,
    order.shippingMethod,
    order.total
  ]);
}

