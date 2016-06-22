var express = require('express');

var app = express();

require('./config/middleware.js')(app, express);
// require('./config/routes.js')(app, express);

var port = process.env.PORT || 3333;
var server = app.listen(port, function() {
  console.log('Server listening on port: ' + port);
});

module.exports = {
  app: app
};
