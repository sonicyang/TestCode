var fs = require('fs');
var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
function checkCode(data){
    var sp   = data.split("\n");
    var reg1 = /import[\s\t]/;
    var reg2 = /(\s|\t)(math)(\s|\t|.)/;
    for (key in sp){
    	if (reg1.test(sp[key])){
	    if(!reg2.test(sp[key])){
		return false;		
	    }
	}
    }	    
    return true;		
}
app.configure(function() {
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.logger());
});
app.get('/',function(request, response){
    fs.createReadStream('./index.html').pipe(response); 
});

app.get('/jquery',function(request, response){
    fs.createReadStream('./static/jQuery/jquery-1.11.0.min.js').pipe(response);
});
app.post('/index',function(request, response){
    fs.writeFile('in.py', request.param("ctx"), function (err) {
        if (err) throw err;
	var sys = require('sys');
        var result = "";
        var exec = require('child_process').exec;
        exec('python3 in.py', function callback(error, stdout, stderr){
            sys.puts("Python STDOUT:");
            sys.puts(stdout);    
            sys.puts("Python STDERR:");
            sys.puts(stderr);    
            result = stdout.toString() + stderr.toString();
            sys.puts(result);
            });
        response.end(result);
        });
//	console.log(request.body.test.ctx);
});
server.listen(8080,'127.0.0.1',function(){
    console.log('Server Running');
});
