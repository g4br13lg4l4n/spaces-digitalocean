// Load dependencies
const aws = require('aws-sdk');
const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');

const app = express();

aws.config.update({
  accessKeyId: '',
  secretAccessKey: '',
});

// Set S3 endpoint to DigitalOcean Spaces
const spacesEndpoint = new aws.Endpoint('sfo2.digitaloceanspaces.com');
const s3 = new aws.S3({
  endpoint: spacesEndpoint
});

// Change bucket property to your Space name
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'movie-spaces',
    acl: 'private',
    key: function (request, file, cb) {
      console.log(file);
      cb(null, file.originalname);
    }
  })
}).array('upload', 1);



app.use(express.static('public'));

// Main, error and success views
app.get('/', function (request, response) {
  response.sendFile(__dirname + '/public/index.html');
});

app.get("/success", function (request, response) {
  response.sendFile(__dirname + '/public/success.html');
});

app.get("/error", function (request, response) {
  response.sendFile(__dirname + '/public/error.html');
});


app.post('/upload', function (request, response, next) {
  upload(request, response, function (error) {
    if (error) {
      console.log(error);
      return response.redirect("/error");
    }
    console.log('File uploaded successfully.');
    response.redirect("/success");
  });
});


app.listen(5000, function () {
  console.log('Server listening on port 5000.');
});

