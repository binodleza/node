var express = require('express'),
      path = require('path'),
      fs = require('fs'),
      formidable = require('formidable'),
      readChunk = require('read-chunk'),
      fileType = require('file-type');

//var router = express();
var router = express.Router();
var uploadPath = path.join(__dirname, '../public/');

// Tell express to serve static files from the following directories
router.use(express.static('public'));
router.use('/uploads', express.static('uploads'));

router.get('/', function (req, res) {
    res.render('upload-images');
});

router.get('/path', function (req, res){
  var filename = 'myfile.png';
  //app.use(express.static(path.join(__dirname, 'public')));
  res.send(uploadPath);
});

/*****************  Multiple image upload *************/
router.post('/upload_photos', function (req, res) {


    var photos = [],
        form = new formidable.IncomingForm();

    // Tells formidable that there will be multiple files sent.
    form.multiples = true;
    // Upload directory for the images
    form.uploadDir = uploadPath +'tmp_uploads';  //  path.join(__dirname, 'tmp_uploads');
    // return 1;
    // Invoked when a file has finished uploading.
    form.on('file', function (name, file) {
        // Allow only 3 files to be uploaded.
        if (photos.length === 3) {
            fs.unlink(file.path);
            return true;
        }

        var buffer = null,
            type = null,
            filename = '';

        // Read a chunk of the file.
        buffer = readChunk.sync(file.path, 0, 262);
        // Get the file type using the buffer read using read-chunk
        type = fileType(buffer);

        // Check the file type, must be either png,jpg or jpeg
        if (type !== null && (type.ext === 'png' || type.ext === 'jpg' || type.ext === 'jpeg')) {
            // Assign new file name
             filename = Date.now() + '-' + file.name;

            // Move the file with the new file name
          //  fs.rename(file.path, path.join(__dirname, 'uploads/' + filename));
             fs.rename(file.path, uploadPath+'uploads/'+ filename, function (err) {
              if (err) throw err;
              console.log('renamed complete');
            });
            // Add to the list of photos
            photos.push({
                status: true,
                filename: filename,
                type: type.ext,
                publicPath: uploadPath + 'uploads/' + filename
            });
        } else {
            photos.push({
                status: false,
                filename: file.name,
                message: 'Invalid file type'
            });
            fs.unlink(file.path);
        }
    });

    form.on('error', function(err) {
        console.log('Error occurred during processing - ' + err);
    });

    // Invoked when all the fields have been processed.
    form.on('end', function() {
        console.log('All the request fields have been processed.');
    });

    // Parse the incoming form fields.
    form.parse(req, function (err, fields, files) {
        res.status(200).json(photos);
    });
});


module.exports = router;
