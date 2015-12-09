var express	= require('express');
var path	= require('path');
var fs		= require('fs');
var bodyParser	= require('body-parser');
var multer	= require('multer');

// mongo
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/awesome1');

var port 	= 80;
var app 	= new express();

var imageDir	= path.join(__dirname, 'storage');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());

// needed for mongo to work
// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});


function getImages(imageDir,callback) {
 var files = [];
 fs.readdir(imageDir, function (err, list){
  for(i=0; i < list.length; i++){
   files.push(list[i]) 
  }
  callback(null,files);
 })
}

// default index page
app.get('/', function(req, res) {
 getImages(imageDir,function(err, photos) {
  res.render('index', { title: 'Awesome Gallery Viewer', pictures: photos }) 
 })
})

// photo detail page
app.get('/detail/:id', function(req,res) {
 var db = req.db
 var collection = db.get('gallery')
 collection.find({filename : req.params.id}, function(err, data) {
  if(err) {
   console.log("could not pull file details from db")
  }
  else {
   console.log("data from db: "+data)
  }
  res.render('detail', { title: 'Awesome Gallery Photo', photo: req.params.id, photodetails: data })
 })
})


// individual image server
app.get('/image/:id/image.jpg', function(req,res) {
 res.statusCode = 200;
 res.setHeader('Content-type', 'image/jpeg');
 res.sendFile(imageDir + '/' + req.params.id);
})

// upload submit form initial
app.get('/upload', function(req, res){
  res.render('uploader', { title: 'Awesome Gallery Uploader'});
});

// upload form POST results
app.post('/upload', multer({ dest: './storage/'}).single('upl'), function(req,res){
 console.log(req.body); //form fields
 /* example output:
 { title: 'abc' }
 */
 console.log(req.file); //form files
 /* example output:
 { fieldname: 'upl',
   originalname: 'grumpy.png',
   encoding: '7bit',
   mimetype: 'image/png',
   destination: './uploads/',
   filename: '436ec561793aa4dc475a88e84776b1b9',
   path: 'uploads/436ec561793aa4dc475a88e84776b1b9',
   size: 277056 }
  */
 // insert into database
 var db = req.db
 var collection = db.get('gallery')
 collection.insert(req.file, function (err, response) {
  if (err) {
   console.log("problem inserting into database")
  }
  else {
   console.log("great success, inserted into db")
  }
 })
 res.status(401).redirect('http://162.210.92.11');
 //res.status(204).end();
});




app.listen( port, function(){ console.log('listening on port '+port); } );
