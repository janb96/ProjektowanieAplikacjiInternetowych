const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;

  if(req.url == "/kalkulator"){
      fs.readFile('kalkulator.html', function(err, data) {
      res.write(data);
      res.end();
    })
  } else if(req.url == "/kontakt"){
    fs.readFile('kontakt.html', function(err, data) {
      res.write(data);
      res.end();
    })
  } else {
      fs.readFile('index.html', function(err, data) {
      res.write(data);
      res.end();
    })
  }

});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});