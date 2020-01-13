const mongoose = require('mongoose');
var config = require('../config/config');
mongoose.connect(config.mongoDB, {
useNewUrlParser: true,
useUnifiedTopology: true
});

var conn = mongoose.connection;

 var schemaCountry = new mongoose.Schema({ 
   name: {
    type: String,
    required: true
  }
 }, {
     collection: 'country'
 });

 var  modelCountry = mongoose.model('country', schemaCountry);
 module.exports = modelCountry;
