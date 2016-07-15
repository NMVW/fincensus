var express = require('express');
var app = express();

require('./config/middleware.js')(app, express);
require('./config/v2/routes.js')(app, express);

// Uncomment for testing server routes
// require('./config/v2/handlers.js').complaintsToProduct();
// require('./config/v2/handlers.js').initialize();
// require('./config/v2/handlers.js').pop();
// require('./config/v2/handlers.js').states();

var port = process.env.PORT || 3333;
var server = app.listen(port, function() {
  console.log('Server listening on port: ' + port);
  console.log('Census API Key:', process.env.KEY);
  console.log('Consumer Complaints App Token:', process.env.TOKEN);
});

module.exports = {
  app: app
};
