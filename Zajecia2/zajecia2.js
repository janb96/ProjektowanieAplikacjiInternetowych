const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;

  if(req.url == "/kontakt"){
  	res.write("Strona kontaktowa");
  } else if(req.url == "/test"){
  	res.write("Strona testowa");
  } else {
  	res.write("Sprobuj /test lub /kontakt");
  }
  
  res.end();
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});