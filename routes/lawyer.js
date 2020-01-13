var express = require('express');
var router = express.Router();
var cors = require('cors'); // enable cross site url//
var config = require('../config/config');
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

var path = require('path'),
  fs = require('fs'),
  formidable = require('formidable'),
  readChunk = require('read-chunk'),
  fileType = require('file-type');

var multer = require('multer');
var Storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./public/uploads");
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});
var lawyerPhotoUpload = multer({ storage: Storage }).single('photo') ;

const { check, validationResult } = require('express-validator');
var lawyersModel = require('../modules/lawyersModel');
var lawyersModelData = lawyersModel.find({}).sort({  _id: -1 });
var categoryModel = require('../modules/categoryModel');
var categoryModelData = categoryModel.find({}).sort({  _id: -1 });

var countryModel = require('../modules/countryModel');
var countryModelData = countryModel.find({}).sort({  _id: -1 });
/**************** Get all lawyer list *****************/

 router.get('/country', function(req, res, next) {
  countryModelData.exec(function(err, data){
		      if(err) throw err;
          return res.status(200).jsonp(data)
		      //res.send(data);
			});
});

router.get('/category', function(req, res, next) {
 categoryModelData.exec(function(err, data){
         if(err) throw err;
         return res.status(200).jsonp(data)
         //res.send(data);
     });
});

router.get('/ab?cd', function (req, res) {
  res.send('ab?cd')
})

router.get('/list/:page?/:perp?', function(req, res, next) {
  var perPage = 3;
  var page = req.params.page || 1;
  lawyersModelData.populate("country").populate("category")
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, result) {
            lawyersModel.estimatedDocumentCount().exec(function(err, count) {
                if (err) return next(err)
                //res.send('result')
                res.render('lawyer-list', {
                     result: result,
                     current: page,
                     pages: Math.ceil(count / perPage),
                })
            })
        })
});

/************************ Example aggregate *******************/
router.get('/listt', function(req, res, next) {
    /* Palette.aggregate([
        {
            "$lookup": {
                "from": "country",
                "localField": "country",
                "foreignField": "_id",
                "as": "examples"
            }
        },
        {
         $unwind:"$examples"
       },
    ]).exec(function(err, docs){
         res.send(docs);
    });
  */
        var resources = {
         "_id": "$_id",
         "name": { "$first": "$name" },
         "email": { "$first": "$email" },
         "mobile_no": { "$first": "$mobile_no" },
      };

        lawyersModel.aggregate([
          {
            $match: {
            //  "name": 'Al Hamadi'
            }
         },
         {
         $sort: {  _id: -1 },
         },
         {
           $skip: 1
         },
         {
           $limit: 15
         },
          {
                $group: resources
            }, {
                $lookup: {
                    from: "countryggggggggggggg", // collection to join
                    localField: "countryfffffff",//field from the input documents
                    foreignField: "_idffffff",//field from the documents of the "from" collection
                    as: "comments"// output array field
                },
              } ,
              {
                $lookup: {
                    from: "category", // from collection name
                    localField: "_id",
                    foreignField: "category",
                    as: "posts"
                },
              }


              ],function (err, data) {
                if (err) return next(err)
             return res.json(data);

    });


});

/************************ Example aggregate *******************/
router.get('/get-lawyer-details/:id', function(req, res, next) {
     var id = req.params.id;
     var del = lawyersModel.findOne({_id:id}).exec(function(err, result){
        if (err) return next(err)
          return res.status(200).jsonp(result);
        //console.log(result);
     });
});


router.get('/upload-images', function(req, res, next) {
  res.render('upload-images')
});

 router.post("/upload-photos", (req, res) => {
     var postVal = req.body;
       res.send({'postVal' : postVal, 'msg' : 'Not'});
});

/************ Save & Update lawyer data *******************/
router.post('/save-lawyer', [
	   check('name', 'Name can not be blank').not().isEmpty(),
     check('gender').not().isEmpty().withMessage('Gender can not be blank'),
     check('email', 'Your email is not valid').not().isEmpty().isEmail().normalizeEmail(),
     check('mobile_no', 'Enter minimum 5 character for mobile').isLength({ min: 5 }),
	], function(req, res, next) {

          const errors = validationResult(req);
		  if (!errors.isEmpty()) {
           return res.status(422).jsonp(errors.array());
		  }else{
          // upload.single('photo');
           /*******  For lawyer create *****/
            if(req.body.lawyer_id == ""){
              var lawyerDetails = new lawyersModel({
              name: req.body.name,
              mobile_no: req.body.mobile_no,
              email: req.body.email,
              gender: req.body.gender,
              status: req.body.status,
              country : req.body.country,
              category : req.body.category
              });
              lawyerDetails.save(function(err, res1){
               if (err) throw err;
                 return res.status(200).jsonp({'status' : 200, 'msg' : 'Success'});
              });
            }
            /*******  For lawyer Update *****/
            if(req.body.lawyer_id != ""){

              lawyersModel.update({_id: req.body.lawyer_id},
              	      {
                        name: req.body.name,
                        mobile_no: req.body.mobile_no,
                        email: req.body.email,
                        gender: req.body.gender,
                        status: req.body.status,
                        country : req.body.country,
                        category : req.body.category
              			   }, function(err, docs){
              			    	if(err) res.json(err);
              				       //else    res.redirect('/user/'+req.params.id);
                             return res.status(200).jsonp({'status' : 201, 'msg' : 'Updated'});
              			 });





            }



  }
});

/******************** Delete Lawyer ******************/
router.get('/delete-lawyer/:id', function(req, res, next) {
	  var id = req.params.id;
       var del = lawyersModel.findByIdAndDelete(id);
     // console.log("Hello");
	  del.exec(function(err, data){
      if(err) throw err;
       return res.status(200).jsonp({'status' : 200, 'msg' : 'Success'});
	});

});

/*****************  Multiple image upload *************/
router.post('/upload_photos', function (req, res) {
    var photos = [],
        form = new formidable.IncomingForm();

    // Tells formidable that there will be multiple files sent.
    form.multiples = true;
    // Upload directory for the images
    form.uploadDir = path.join(__dirname, 'tmp_uploads');
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
            fs.rename(file.path, path.join(__dirname, 'uploads/' + filename));

            // Add to the list of photos
            photos.push({
                status: true,
                filename: filename,
                type: type.ext,
                publicPath: 'uploads/' + filename
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

/*********** single image upload *********/
 /*router.post('/profile', upload.single('avatar'), (req, res) => {
   if (!req.file) {
    console.log("No file received");
    return res.send({
      success: false
    });

  } else {
    console.log('file received');
    return res.send({
      success: true
    })
  }
}); */


/********** multiple image upload ***********/
/*var uploadMultiple = multer({ storage: Storage }).array("fieldLayers", 3);
router.post('/profile-image', (req, res) => {
  uploadMultiple(req, res, function(err) {
          if (err) {
              return res.end("Something went wrong!");
          }
          return res.end("File uploaded sucessfully!.");
      })
}); */




/*router.get('/', cors(), function(req, res) {
    var query = req.params.query;

    modelLawyer.find({
        'request': query
    }, function(err, result) {
        if (err) throw err;
        if (result) {
             res.render('index', { title: 'Express' });
             //res.json(result)
        } else {
            res.send(JSON.stringify({
                error : 'Error'
            }))
        }
    })
}) */

/*router.get('/list1', cors(), function(req, res) {
    var query = req.params.query;
    modelLawyer.find({
        'request': query
    }, function(err, result) {
        if (err) throw err;
        if (result) {
             res.render('lawyer-list', { result: result });
             //res.json(result)
        } else {
            res.send(JSON.stringify({
                error : 'Error'
            }))
        }
    })
})*/




module.exports = router;
