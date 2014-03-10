var fs = require('fs');
var crypto = require('crypto');
var sys = require('sys');
var shell = require('shelljs/global');
var http = require('http');
var express = require('express');

var app = express();
var server = http.createServer(app);

app.configure(function() {
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.logger());
});

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

app.get('/',function(request, response){
    response.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream('./index.html').pipe(response); 
});

app.get('/jquery',function(request, response){
    fs.createReadStream('./static/jQuery/jquery-1.11.0.min.js').pipe(response);
});


function execCode(CC, code){
    var cc_hash = crypto.createHash('md5').update(CC).digest('hex');
    var code_hash = crypto.createHash('md5').update(code).digest('hex');
    
    fs.writeFileSync('uploaded/' + cc_hash.toString() + "/" + code_hash.toString(), code);

    var result = exec(CC + ' uploaded/' + cc_hash.toString() + "/" + code_hash.toString(),{silent:true}).output;
    
    sys.puts("\nExecuted " +  cc_hash.toString() + "/" + code_hash.toString());
    sys.puts("Output:");
    sys.puts(result);    

    fs.unlinkSync('uploaded/' + cc_hash.toString() + "/" + code_hash.toString());
    console.log('successfully deleted ' + 'uploaded/' + cc_hash.toString() + "/" + code_hash.toString());

    return result;
}

app.post('/index',function(request, response){
    response.end(execCode('Python', request.param("ctx")));
    //	console.log(request.body.test.ctx);
});
server.listen(8080,'127.0.0.1',function(){
    console.log('Server Running');
});
