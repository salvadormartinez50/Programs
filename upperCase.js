var http = require('http');
http.createServer(function (req, res) {
    var uc = require('C:/Users/cchha/node_modules/upper-case');
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(uc.upperCase("Hello World, I'm here working very hard!"));
  res.end();
}).listen(8080);