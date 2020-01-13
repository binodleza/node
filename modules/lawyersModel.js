const mongoose = require('mongoose');
var config = require('../config/config');
mongoose.connect(config.mongoDB, {
useNewUrlParser: true,
useUnifiedTopology: true
});

var conn = mongoose.connection;
var Schema = mongoose.Schema;
 var schemaLawyer = new mongoose.Schema({
   name: String,
   mobile_no: String,
   email: String,
   gender: String,
   status: Number,
    category: {
     type: Schema.Types.ObjectId,
     ref: "category"
   },
   country: {
    type: Schema.Types.ObjectId,
    ref: "country"
  },
 }, {
     collection: 'lawyer'
 });

 var  modelLawyer = mongoose.model('lawyer', schemaLawyer);
 module.exports = modelLawyer;
