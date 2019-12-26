const mongoose = require('mongoose');
var config = require('../config/config');
mongoose.connect(config.mongoDB, {
useNewUrlParser: true,
useUnifiedTopology: true
});

var conn = mongoose.connection;

 var schemaLawyer = new mongoose.Schema({
   name: String,
   mobile_no: String,
   email: String,
   gender: String,
   status: Number,
   country : Number,
   category : Number
 }, {
     collection: 'lawyer'
 });

 var  modelLawyer = mongoose.model('modelLawyer', schemaLawyer);
 module.exports = modelLawyer;
