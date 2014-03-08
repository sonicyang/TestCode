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
    fs.writeFile('in.py', request.param("ctx"), function (err) {
        if (err) throw err;

        var result = "";
        var exec = require('child_process').exec;
        exec('c:\\Python33\\python.exe in.py', function callback(error, stdout, stderr){
            result = stdout;    
        });

        
        response.end(result);
        });
//	console.log(request.body.test.ctx);
});
server.listen(8080,'127.0.0.1',function(){
    console.log('Server Running');
});
