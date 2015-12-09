var express     = require('express');
var path        = require('path');
var fs          = require('fs');
var bodyParser  = require('body-parser');
var multer      = require('multer');

var port        = 80;
var app         = new express();

var imageDir    = path.join(__dirname, 'storage');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());

function getImages(imageDir,callback) {
 var files = []
 fs.readdir(imageDir, function (err, list){
  for(i=0; i < list.length; i++){
   files.push(list[i])
  }
  callback(null,files);
 })
}


var runner = function (err, files){
 console.log(files)
}

getImages(imageDir,runner)
