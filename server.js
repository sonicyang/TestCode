var fs = require('fs');
var crypto = require('crypto');
var sys = require('sys');
var shell = require('shelljs/global');
var http = require('http');
var express = require('express');

var app = express();
var server = http.createServer(app);

app.use("/static", express.static(__dirname + '/static'));
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
    var code_hash = crypto.createHash('md5').update(code).digest('hex');
    
    fs.writeFileSync('uploaded/' + CC + "/" + code_hash.toString(), code);

    var result = exec(CC + ' uploaded/' + CC + "/" + code_hash.toString(),{silent:true}).output;
    
    sys.puts("\nExecuted Uploaded " + CC + "/" + code_hash.toString());
    sys.puts("Output:");
    sys.puts(result);    

    fs.unlinkSync('uploaded/' + CC + "/" + code_hash.toString());
    console.log('successfully deleted ' + 'uploaded/' + CC + "/" + code_hash.toString());

    return result;
}

function execStandardCode(CC, name){
    var name_hash = crypto.createHash('md5').update(name).digest('hex');
    
    var result = exec(CC + ' standard/' + CC + "/" + name_hash.toString(),{silent:true}).output;
    
    sys.puts("\nExecuted Standard " + CC + "/" + name_hash.toString());
    sys.puts("Output:");
    sys.puts(result);    

    return result;
}
app.post('/index',function(request, response){
    var ulo = execCode('python', request.param("ctx"))
    var stdo = execStandardCode('Python', "0000");
    
    var ulo_hash = crypto.createHash('md5').update(ulo).digest('hex');
    var stdo_hash = crypto.createHash('md5').update(stdo).digest('hex');
    fs.writeFileSync('compare/' + ulo_hash.toString(), ulo);
    fs.writeFileSync('compare/' + stdo_hash.toString(), stdo);

    var diffR = exec("diff " + "compare/" + ulo_hash.toString() + " " + "compare/" + stdo_hash.toString()).output;

    //if(diffR == "")
    response.end(diffR);
    //	console.log(request.body.test.ctx);
});
server.listen(8080,'127.0.0.1',function(){
    console.log('Server Running');
});
