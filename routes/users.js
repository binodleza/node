var express = require('express');
var router = express.Router();
var cors = require('cors'); // enable cross site url//
/*************** mongoose with DB connect************/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoDB = 'mongodb+srv://binod:Create1.@clusterbinod-i0vsn.mongodb.net/lawyerapp';
mongoose.connect(mongoDB, { useNewUrlParser: true,  useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var schemaLawyer = new Schema({
  name: String,
  mobile_no: String
}, {
    collection: 'lawyer'
});

//var User = mongoose.model('lawyer', UserSchema);
var  modelLawyer = mongoose.model('Model', schemaLawyer);

router.get('/get', cors(), function(req, res) {
    var query = req.params.query;

    modelLawyer.find({
        'request': query
    }, function(err, result) {
        if (err) throw err;
        if (result) {
            res.json(result)
        } else {
            res.send(JSON.stringify({
                error : 'Error'
            }))
        }
    })
})



/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.all('/all', function(req, res, next) {
    User.findOne({}, function (err, user) {
      if (err) throw err;
      if (! user) return res.send(401);
        res.send('data get');
  });
});

module.exports = router;
