#!/usr/bin/env node

var connect = require('connect'),
    https = require('https'),
    fs = require('fs');

var options = {
    key: fs.readFileSync(__dirname + '/ssl/server.key'),
    cert: fs.readFileSync(__dirname + '/ssl/server.crt')
};

var app = connect(connect.static(__dirname + '/www'))
https.createServer(options, app).listen(8080);
