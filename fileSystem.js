var http = require('http');
var fs = require('fs');
http.createServer(function (req, res) {

    fs.appendFile('mynewfile1.txt', 'Hello content!', function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
    fs.rename('mynewfile1.txt', 'myrenamedfile.txt', function (err) {
        if (err) throw err;
        console.log('File Renamed!');
    });

    fs.open('mynewfile2.txt', 'w', function (err, file) {
        //if (err) throw err;
        console.log('SavedOpen!');
    });
    fs.writeFile('mynewfile3.txt', 'Hello content!', function (err) {
        if (err) throw err;
        console.log('Savedwrite!');
    });
    fs.unlink('mynewfile2.txt', function (err) {

        console.log('File deleted!');
    });
    fs.readFile('demofile1.html', function (err, data) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        return res.end();
    });
}).listen(8080);