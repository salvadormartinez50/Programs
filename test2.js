var http = require('http');
var dt = require('./myfirstmodule');
var url = require('url');

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write("The date and time are currently: " + dt.myDateTime());
    res.write(req.url);
    var q = url.parse(req.url, true).query;
    var text = q.year + " " + q.month;
    res.end(text);
}).listen(8081);