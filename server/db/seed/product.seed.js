// populate Products table from Consumer Complaints DB API
var request = require('request-promise');
var baseComplaints = 'https://data.consumerfinance.gov/resource/jhzv-w97w.json?';

function initProductsTable(Product) {
  console.log('in init function', Product.toString());
  // get all products from consumer complaints DB
  return request(baseComplaints + '$select=company&$group=company&$limit=50000')
    .then(function(data) {
      var products = JSON.parse(data);
      console.log('products incoming:',products);
      var promisedProducts = products.map(function(Product) {
        return Product.create({name: Product.company});
      });
      console.log('Products initialized.');
      return Promise.all(promisedProducts);
    })
    .catch(function(err) {
      console.log('Products not initialized properly!');
    });
};

exports.initProductsTable = initProductsTable;
