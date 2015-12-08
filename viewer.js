var express	= require('express');
var path	= require('path');
var fs		= require('fs');
var bodyParser	= require('body-parser');

var port 	= 81;
var app 	= new express();

var imageDir	= path.join(__dirname, 'storage');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());

// bulding array
var imageList = []; // {ONE:'1.jpg', TWO:'2.jpg'};
var files = [];

function getImages(imageDir,callback) {
 fs.readdir(imageDir, function (err, list){
  for(var i=0; i < list.length; i++)
   files.push(list[i]); 
  callback(null,files);
 })
 console.log("inside: "+files);
 return files;
}

var imageList = getImages(imageDir, function (err, files){
 console.log("outside: "+files);
});


app.get('/', function(req, res) {
 res.render('viewer', { title: 'Awesome Gallery Viewer', images: imageList})
})


app.get('/image/:id', function(req,res) {
 res.sendfile(imageDir + '/' + req.params.id);
})

app.listen( port, function(){ console.log('listening on port '+port); } );
