var worker = require('./worker.js');

module.exports = function(app) {

  /* User Routes */

  // (Product) of [rank] most complaints in [state] of
  app.route('/api/states/:state/:rank')
    .get(function(req, res) {
      worker.complaintsToProduct(req.params.state, req.params.rank, res); 
    });

  // (Number of births) in the [year] and states where [bank] had a complaint
  app.route('/api/pop/:bank/:year')
   .get(function(req, res) {
      worker.pop(req.params.bank, +req.params.year, res);
   });

  // (State) of [rank] most growth with most complaints about [product]
  app.route('/api/growth/:year/:rank/:product')
    .get(function(req, res) {
      worker.states(+req.params.rank, req.params.product, +req.params.year, res)
    });
    
  // Initialize API-valid banks and products (states, years assumed stagnant params)
  app.route('/api/initialize')
    .get(function(req, res) {
      worker.initialize(res);
    });
};
