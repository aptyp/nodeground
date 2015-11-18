//inspired by https://www.codementor.io/tips/9172397814/setup-file-uploading-in-an-express-js-application-using-multer-js

var express = require('express');
var multer = require('multer'),
	bodyParser = require('body-parser'),
	path = require('path');

var app = new express();
app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.get('/', function(req, res){
  res.render('uploader');
});
app.post('/', multer({ dest: './storage/'}).single('upl'), function(req,res){
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
	res.status(401).redirect('http://162.210.92.11:3000');
	//res.status(204).end();
});

var port = 3001;
app.listen( port, function(){ console.log('listening on port '+port); } );
