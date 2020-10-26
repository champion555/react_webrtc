#!/usr/bin/env node

/**
 * Module dependencies.
 */

var https = require('https');
const fs = require('fs');
var http = require('http');
var express = require('express');
var path = require('path');
/**
 * Get port from environment and store in Express.
 */
// var port = normalizePort(process.env.PORT || '3004');
// app.set('port', port);
var app = express();
var appHTTP = express();
http.createServer(appHTTP).listen(80);
var port = normalizePort(process.env.PORT || '443');

app.use(express.static(path.join(__dirname, 'build')));

// app.use('/public', express.static('build'))
appHTTP.get('*', (req, res) => {
    res.redirect('https://remote.ikyx.net/');
});

app.get('/', (req, res) => {
    res.render('index', { title: 'test' });
});
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.set('port', '443')
/**
 * Create HTTP server.
 */
var http_options = {
    key: fs.readFileSync('./private.key'),
    cert: fs.readFileSync('./certificate.crt'),
    ca: [
        fs.readFileSync('./ca_bundle.crt'),
    ]
}


var server = https.createServer(http_options, app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}
