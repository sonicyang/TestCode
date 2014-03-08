var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
app.get('/',function(request, response){
	response.end('你好！');
});
app.get('/index',function(request, response){
  	response.end("ss");
//	console.log(request.body.test.ctx);
});
server.listen(8080,'127.0.0.1',function(){
	console.log('Server Running');
});
