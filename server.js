var fs = require('fs');
var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
app.configure(function() {
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.logger());
});

app.get('/',function(request, response){
    //response.end('你好！');
    fs.createReadStream('./index.html').pipe(response); 
});
app.post('/index',function(request, response){
    console.log(request.param("ctx"));
    //fs.writeFile('message.txt', request., function (err) {
    //    if (err) throw err;
    //    response.end("Saved");
    //    });
//	console.log(request.body.test.ctx);
});
server.listen(8080,'127.0.0.1',function(){
    console.log('Server Running');
});
