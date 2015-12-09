var express	= require('express');
var path	= require('path');
var fs		= require('fs');
var bodyParser	= require('body-parser');
var multer	= require('multer');

var port 	= 80;
var app 	= new express();

var imageDir	= path.join(__dirname, 'storage');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());

function getImages(imageDir,callback) {
 var files = [];
 fs.readdir(imageDir, function (err, list){
  if(err) return console.error(err)
  for(i=0; i < list.length; i++){
   files.push(list[i]) 
  }
  callback(null,files);
 })
 return files;
}

//console.log(fakeList)
app.get('/', function(req, res) {
 res.render('index', { title: 'Awesome Gallery Viewer', pictures: getImages(imageDir, function (err, list){
  console.log(list)
  })
 })
})

app.get('/image/:id/image.jpg', function(req,res) {
 res.statusCode = 200;
 res.setHeader('Content-type', 'image/jpeg');
 res.sendFile(imageDir + '/' + req.params.id);
})

app.get('/upload', function(req, res){
  res.render('uploader', { title: 'Awesome Gallery Uploader'});
});

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
 res.status(401).redirect('http://162.210.92.11');
 //res.status(204).end();
});




app.listen( port, function(){ console.log('listening on port '+port); } );
