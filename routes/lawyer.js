var express = require('express');
var router = express.Router();
var cors = require('cors'); // enable cross site url//
var config = require('../config/config');
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
const { check, validationResult } = require('express-validator');
var lawyersModel = require('../modules/lawyersModel');
var lawyersModelData = lawyersModel.find({}).sort({  _id: -1 });

var countryModel = require('../modules/countryModel');
var countryModelData = countryModel.find({}).sort({  _id: -1 });
/**************** Get all lawyer list *****************/
 router.get('/country', function(req, res, next) {
  countryModelData.exec(function(err, data){
		      if(err) throw err;
		      res.send(data);
			});
});

router.get('/list/:page', function(req, res, next) {
  var perPage = 3
  var page = req.params.page || 1
  lawyersModelData
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, result) {
            lawyersModel.estimatedDocumentCount().exec(function(err, count) {
                if (err) return next(err)
                res.render('lawyer-list', {
                     result: result,
                     current: page,
                     pages: Math.ceil(count / perPage),
                     countryList : countryList,
                })
            })
        })
});

router.get('/get-lawyer-details/:id', function(req, res, next) {
     var id = req.params.id;
     var del = lawyersModel.findOne({_id:id}).exec(function(err, result){
        if (err) return next(err)
          return res.status(200).jsonp(result);
        //console.log(result);
     });
});


function countryList() {
    countryModelData.exec(function(err, data){
          if(err) throw err;
          return data;
      });

        return 'Hello Nothing';
};

/*router.post("/save-lawyerss", (req, res) => {
   var myData = new lawyersModel(req.body);
   myData.save()
   .then(item => {
     res.redirect('list');
   })
   .catch(err => {
   res.status(400).send("unable to save to database");
   });
}); */
/************ Save lawyer data *******************/
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
