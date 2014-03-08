var fs = require('fs');
var server,
    ip   = "127.0.0.1",
    port = 1337,
    http = require('http'),
    url = require('url');

function onRequest(request, response) {
  var pathname = url.parse(request.url).pathname; 
  console.log("Request for " + pathname + " received.");
  response.writeHead(200, {"Content-Type": "text/html"});
  
  switch (pathname) {
    case "/index":
        fs.readFile('./index.html', function(error, content) {
		if(error){
			response.writeHead(500);
			response.end();
			
		}
		else {
			response.writeHead(200, { 'Content-Type': 'text/html' });	
			response.end(content, 'utf-8');	
				
		}
	});
	break;
    case "/test":
  	fs.readFile('./test.html', function(error, content) {
		if (error) {
			response.writeHead(500);
			response.end();
		}
		else {
			response.writeHead(200, { 'Content-Type': 'text/html' });
			console.log(content.ctx)
			response.end(content, 'utf-8');
		}
	});
      break;
    default:
      response.end('default page.\n');
      break;
  }
}
http.createServer(onRequest).listen(port, ip);
console.log("Server has started.");
