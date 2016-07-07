// populate Products table from Consumer Complaints DB API
var request = require('request-promise');
var baseComplaints = 'https://data.consumerfinance.gov/resource/jhzv-w97w.json?';

function initProductsTable(Product) {
  // get all products from consumer complaints DB
  return request(baseComplaints + '$select=product&$group=product')
    .then(function(data) {
      var products = JSON.parse(data);
      var promisedProducts = products.map(function(product) {
        return Product.create({name: product.product});
      });
      console.log('Products initialized.');
      return Promise.all(promisedProducts);
    })
    .catch(function(err) {
      console.log('Products not initialized properly!');
    });
};

exports.initProductsTable = initProductsTable;
