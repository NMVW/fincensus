var express = require('express');
var app = express();

require('./config/middleware.js')(app, express);
require('./config/routes.js')(app, express);

// Uncomment for testing server routes
require('./config/worker.js').productRankByState('NY');
require('./config/worker.js').birthsInRange('bank', 2015);

var port = process.env.PORT || 3333;
var server = app.listen(port, function() {
  console.log('Server listening on port: ' + port);
  console.log(process.env.PORT, typeof ''+process.env.KEY);
});

module.exports = {
  app: app
};
