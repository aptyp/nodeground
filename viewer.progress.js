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
//var imageList = {ONE:'1.jpg', TWO:'2.jpg'};
//var imageList = 


var imageList = getImages(imageDir, function(err,files) {
 if(err)
  console.log("error imageList: " +err)
 if(files == undefined)
  console.log("files are undefined")
 var imageLists = null
 for (var i=0; i<files.length; i++) {
  imageLists +=  files[i];
 }
 return imageLists;
});

function getImages(imageDir, callback) {
 var files = [], i;
 fs.readdir(imageDir, function (err, list) {
  if(err)  
   console.log("error getImages(): "+err)  
  for(i=0; i < list.length; i++) {
   files.push(list[i]); 
  }
  callback(err, files);
 });
}

app.get('/', function(req, res){
 // res.render('viewer', { title: 'Awesome Gallery Viewer', images: imageList })
 res.render('viewer', { title: 'Awesome Gallery Viewer', images: imageList })
});

app.listen( port, function(){ console.log('listening on port '+port); } );
