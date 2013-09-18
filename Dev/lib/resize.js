//dependencies
var helpers = require('./helperfunctions');
var upload = require('./upload');
var fs = require('fs');
var im = require('imagemagick');
var uuid = require('node-uuid');
var knox = require('knox');
var imageDataController = require('../app/controllers/ImageData.js');


module.exports = {
  identify: function(req, res) {
    var w;
    var h;

    im.identify(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg', function(err, features) {
      if (err) {
        console.error('could not process image </3');
        throw err;
      }

      //TODO: change default to square?
      //set dimensions to queries || dimensions of original image
      w = req.query.w || features.width;
      h = req.query.h || features.height; 

      resize(req, res, w, h);
    });
  }
};

var resize = function(req, res, w, h) {
  //create new key for rezied image
  var key = uuid.v4().split('-').pop();

  im.resize({
    srcPath: process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg',
    dstPath: process.env.LOCAL_FILE_PATH + '/' + key + '.jpg',
    width: w,
    height: h
  }, function(err, stdout, stderr) {
    if (err) {
      console.error('could not process image </3');
      throw err;
    }

    if (stderr) {
      throw stderr;
    }

    //upload resized image to fs and s3
    helpers.helper.upload(req, res, process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', 'resize', key);
  });
};

