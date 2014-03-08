var http = require('http');
var fs = require('fs');
var express = require('express');
var app = express();
var server = http.createServer(app);
app.use(express.json());
app.use(express.urlencoded());
app.get('/',function(request, response){
	fs.createReadStream('./index.html').pipe(response);
});
app.post('/index',function(request, response){
  	
	console.log(request.body.ctx);
	response.end();
});
server.listen(8080,'127.0.0.1',function(){
	console.log('Server running');
});
