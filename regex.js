fs = require("fs");
var sp;
var re = /import[\s\t]/g;
var re2= /(\s|\t)(os|sys)(.|\s|\t)/;
code = "import os \nfor i in range(0,10):\n\tfor j in range(0,10):\n\t\tprint (i,j)\nprint (\"end\")"
//code = code.replace(/\t/g,"")
sp = code.split("\n");
console.log(re.test(sp[0]))
console.log(re2.test(sp[0]))
console.log(sp);
