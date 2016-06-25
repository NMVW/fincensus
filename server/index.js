var express = require('express');
var app = express();

require('./config/middleware.js')(app, express);
// require('./config/routes.js')(app, express);

// Uncomment for testing server routes
// require('./config/worker.js').complaintsToProduct();
// require('./config/worker.js').pop();
require('./config/worker.js').states();

var port = process.env.PORT || 3333;
var server = app.listen(port, function() {
  console.log('Server listening on port: ' + port);
  console.log('Census API Key:', process.env.KEY);
});

module.exports = {
  app: app
};
