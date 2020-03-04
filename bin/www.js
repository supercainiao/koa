var http = require('http');
var serverhandle = require('../app');

var PORT = 8000;

var app = http.createServer(serverhandle);

app.listen(PORT);


