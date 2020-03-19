var express = require('express');
var bodyParser = require('body-parser');
var querystring = require('querystring');
var debug = require('debug')('botkit:webserver');
var http = require('http');
var fs = require('fs');
var hbs = require('express-hbs');
var shell = require('shelljs');


module.exports = function(controller) {


    var webserver = express();
    webserver.use(bodyParser.json());
    webserver.use(bodyParser.urlencoded({ extended: true }));

    // set up handlebars ready for tabs
    webserver.engine('hbs', hbs.express4({partialsDir: __dirname + '/../views/partials'}));
    webserver.set('view engine', 'hbs');
    webserver.set('views', __dirname + '/../views/');

    webserver.use(express.static('public'));

    var server = http.createServer(webserver);

    server.listen(process.env.PORT || 3024, null, function() {

        debug('Express webserver configured and listening at http://localhost:' + process.env.PORT || 3024);

    });

    // import all the pre-defined routes that are present in /components/routes
    var normalizedPathToRoutes = require('path').join(__dirname, 'routes');
    if (fs.existsSync(normalizedPathToRoutes)) {
        fs.readdirSync(normalizedPathToRoutes).forEach(function (file) {
            require('./routes/' + file)(webserver, controller);
        });
    }

    controller.webserver = webserver;
    controller.httpserver = server;

    return webserver;

};
