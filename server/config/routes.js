var worker = require('./worker.js');

module.exports = function(app) {

  /* User Routes */

  // (Product) of [rank] most complaints in [state] of
  app.route('/api/complaints/:state/:rank')
    .get(function(req, res) {
      worker.complaintsToProduct(req.params.state, req.params.rank, res); 
    });

  // (Number of births) in the [year] and states where [bank] had a complaint
  app.route('/api/pop/:bank/:year')
   .get(function(req, res) {
    console.log(req.params, typeof req.params.bank, typeof req.params.year);
    res.status(401).send('Route under construction');
    // worker.pop(req.params.bank, +req.params.year, res);
   });

  // (State) of [rank] most growth with most complaints about [product]
  app.route('/api/states/:year/:rank/:product')
    .get(function(req, res) {
      worker.states(+req.params.rank, req.params.product, +req.params.year, res)
    });
    
  // Initialize API-valid states, banks, years, and products
  // app.route('/api/initialize')
    // .get(worker.)
};
