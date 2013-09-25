var addToDb = require('./mongoosehelpers').addToDb;
var response = require('./responseHelpers').postRes;
var helpers = require('./helperfunctions');
var fs = require('fs');
var request = require('request');
var uuid = require('node-uuid');
var client = helpers.awsClient();

module.exports = {
  //stream requested image to fs and store in s3 bucket
  upload: function(req, res, next) {
    var key = uuid.v4().split('-').pop();

    //if request is a url, fetch the requested url
    if (req.query.src.indexOf('http') !== -1) {
      console.log('http');
      var outStream = fs.createWriteStream(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg');
      
      request(req.query.src).pipe(outStream);

      outStream.on('close', function() {
        fs.readFile(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', function(err, buff) {
          var req = client.put(key, {
              'Content-Length': buff.length,
              'Content-Type': 'image/jpeg',
              'x-amz-acl': 'public-read'
            });

          req.on('response', function(resp){
            if (resp.statusCode === 200) {
              addToDb(req, res, key);
              response(req, res, key);
            }
          });

          req.end(buff);
        });
      });
    } else {
      console.log('not in http');
      var readStream = fs.createReadStream(req.query.src);
      var writeStream = fs.createWriteStream(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg');

      readStream.on('data', function(buff) {

        var req = client.put(key, {
            'Content-Length': buff.length,
            'Content-Type': 'image/jpeg',
            'x-amz-acl': 'public-read'
          });

        req.on('response', function(resp){
          if (resp.statusCode === 200) {
            addToDb(req, res, key);
            response(req, res, key);
          }
        });

        //TODO: response status code if s3 status is not too
        req.end(buff);
        writeStream.write(buff);
      });

      readStream.on('end', function() {
        writeStream.end();
      });

      writeStream.on('close', function() {
        console.log('close');
      });
    }
  }
};