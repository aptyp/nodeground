var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    url = require('url');
    imageDir = '/opt/node/gall/storage/';
 
http.createServer(function (req, res) {
    var query = url.parse(req.url,true).query;
        pic = query.image;
 
    if (typeof pic === 'undefined') {
        getImages(imageDir, function (err, files) {
            var imageLists = '<div align=center>';
            for (var i=0; i<files.length; i++) {
                imageLists += '<div><a href="/?image=' + files[i] + '"><img src="/?image=' + files[i] + '" style="height: auto; width: auto; max-width: 400px; max-height: 400px;" /></a></div>';
            }
            imageLists += '</div>';
            res.writeHead(200, {'Content-type':'text/html'});
            res.end(imageLists);
        });
    } else {
        fs.readFile(imageDir + pic, function (err, content) {
            if (err) {
                res.writeHead(400, {'Content-type':'text/html'})
                console.log(err);
                res.end("No such image");    
            } else {
                res.writeHead(200,{'Content-type':'image/jpg'});
                res.end(content);
            }
        });
    }
 
}).listen(3000);
console.log("Server running at http://localhost:3000/");
 
function getImages(imageDir, callback) {
    var fileType = '.jpg',
        files = [], i;
    fs.readdir(imageDir, function (err, list) {
        for(i=list.length; i > 0; i--) {
           files.push(list[i]); 
        }
        callback(err, files);
    });
}
