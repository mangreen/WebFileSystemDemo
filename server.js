var ip = "127.0.0.1",
    port = 1111,
    http = require('http'),
    fs = require("fs"),
    folderPath = "static",
    url = require('url'),
    path = require('path'),
    qs = require('querystring'),
    encode = "utf8";

http.createServer(function(req, res) {
    var myPath = url.parse(req.url);
    var	parameter = qs.parse(myPath.query);
    var filePath = folderPath + myPath.pathname;
    
    var contentType = "";
	if(req.url.indexOf('.html') != -1){
		contentType = 'text/html';
	}else if(req.url.indexOf('.js') != -1){
		contentType = 'text/javascript';
	}else if(req.url.indexOf('.css') != -1){
		contentType = 'text/css';
	}
	//console.log(myPath);
    if(myPath.pathname.substr(0,5) === "/file"){
    	
    	if(req.url.indexOf('?all=1') != -1){

    		readDir(filePath, res);
    	}else{
    		if(fs.statSync(filePath).isFile()){
    			readFile(res, filePath, 'text/plain');
    		}else{
    			readDir(filePath, res);
    		}
    	}
    	
    }else if(myPath.pathname.substr(0,6) === "/index" && myPath.pathname.indexOf('.html') === -1){
    	readFile(res, filePath+".html", contentType);
    }else{
    	readFile(res, filePath, contentType);
    }
    
}).listen(port, ip);

console.log("Server running at http://" + ip + ":" + port);


function readDir(filePath, res){
	fs.readdir(filePath, function(err, files) {
		if (err) {
            res.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            res.end();
            return;
        }
		
		var	dirObj = {};
		var dirAry= new Array();
		
		files.forEach(function(element, index, array){
			var fileObj = {};
			
			var slash = "";
			if(fs.statSync(filePath+element).isDirectory()){
				slash = "/";
				fileObj.size = "--";
			}else{
				fileObj.size = fs.statSync(filePath+element).size;
			}
			
			fileObj.name = element + slash;
			fileObj.time = fs.statSync(filePath+element).atime;

			dirAry.push(fileObj);
		});
		
		dirObj.dir = filePath.replace("static/", "");
		dirObj.files = dirAry;

		res.writeHead(200, {
            'Content-Type': 'application/json'
        });
		res.end(JSON.stringify(dirObj));
	});
}

function readFile(res, filePath, contentType){
	fs.readFile(filePath, encode, function(err, file) {
        if (err) {
            res.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            res.end();
            return;
        }

        res.writeHead(200, {
            'Content-Type': contentType
        });
        res.write(file);    
        res.end();
	});
}