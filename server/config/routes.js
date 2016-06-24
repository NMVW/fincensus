var worker = require('./worker.js');

module.exports = function(app) {

  /* User Routes */

  // (Product) of [rank] most complaints in [state] of
  // app.route('/api/complaints/:state/:rank')
  //   .get(worker.productRankByState(state, rank));

  // (Number of births) in the [year] and states where [bank] had a complaint
  // app.route('/api/births/:bank/:year')
  //  .get(worker.birthsInRange(bank, year))

  // (State) of [rank] most growth with most complaints about [product]
  // app.route('/api/states/:rank/:product')
    // .get(worker.stateByProd(rank, product))
};
