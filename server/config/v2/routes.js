var worker = require('./handlers.js');

module.exports = function(app) {

  /* User Routes */

  /// NUMBER OF PRODUCTS of BANK
  // https://data.consumerfinance.gov/resource/jhzv-w97w.json?$select=company,count(product)&$group=company&state=FL&$order=-count_product

  // NUMBER OF PRODUCTS with issue 'x'
  // https://data.consumerfinance.gov/resource/jhzv-w97w.json?$select=issue,count(product)&$group=issue&state=FL&$order=-count_product
  
  // (Product) of [prodRank] most complaints in [state] of
  app.route('/api/v2/states/:state/:prodRank')
    .get(function(req, res) {
      worker.complaintsToProduct(req.params.state, req.params.prodRank, res); 
    });

  // (Number of births) in the [year] and states where [bank] had a complaint
  app.route('/api/v2/population/:bank/:year')
   .get(function(req, res) {
      worker.pop(req.params.bank, +req.params.year, res);
   });

  // (State) of [stateRank] most growth with [prodRank] most complaints about a product
  app.route('/api/v2/growth/:year/:stateRank/:prodRank')
    .get(function(req, res) {
      worker.states(+req.params.stateRank, +req.params.prodRank, +req.params.year, res)
    });
    
  // Initialize API-valid banks and products (states, years assumed stagnant params)
  app.route('/api/v2/initialize')
    .get(function(req, res) {
      worker.initialize(res);
    });
};
