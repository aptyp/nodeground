var express	= require('express');
var path	= require('path');
var fs		= require('fs');
var bodyParser	= require('body-parser');
var multer	= require('multer');
var cookieParser = require('cookie-parser')
// mongo
var mongo 	= require('mongodb');
var monk 	= require('monk');
var db 		= monk('localhost:27017/awesome1');
var mongoose 	= require('mongoose');

var https 	= require('https');
var key		= fs.readFileSync('sslcert/iamverycool.com.key', 'utf8');
var cert	= fs.readFileSync('sslcert/iamverycool.com.crt', 'utf8');

var https_options = {
    key: key,
    cert: cert
};

var Account 	= require('./models/account');

// passport
var passport 	= require('passport')
var LocalStrategy = require('passport-local').Strategy

var routes	= require('./routes/index')

var port 	= 443;
var app 	= new express();

var imageDir	= path.join(__dirname, 'storage');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// needed for mongo to work
// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});


//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false } ));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
//app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);


var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

mongoose.connect('mongodb://localhost/passport_local_mongoose_express4');

module.exports = app;

// needed to browse directory
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
  res.render('index', { user: req.user, title: 'Awesome Gallery Viewer', pictures: photos }) 
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
 res.status(401).redirect('https://iamverycool.com');
 //res.status(204).end();
});


// error handlers

// development error handler
// will print stacktrace
/*
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
*/
server = https.createServer(https_options, app).listen(port, '162.210.92.11');
//app.listen( port, function(){ console.log('listening on port '+port); } );
