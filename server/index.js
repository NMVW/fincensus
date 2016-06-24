var express = require('express');
var app = express();

require('./config/middleware.js')(app, express);
require('./config/routes.js')(app, express);

// Uncomment for testing server routes
// require('./config/worker.js').productRankByState('NY');
// require('./config/worker.js').birthsInRange('Bank of America', 2014);
// require('./config/worker.js').stateByProduct(0, 'Mortgage', 2014);

var port = process.env.PORT || 3333;
var server = app.listen(port, function() {
  console.log('Server listening on port: ' + port);
  console.log('Census API Key:', process.env.KEY);
});

module.exports = {
  app: app
};
