const mongoose = require('mongoose');
var config = require('../config/config');
mongoose.connect(config.mongoDB, {
useNewUrlParser: true,
useUnifiedTopology: true
});

var conn = mongoose.connection;

 var schemaCountry = new mongoose.Schema({
   name: String
 }, {
     collection: 'country'
 });

 var  modelCountry = mongoose.model('modelCountry', schemaCountry);
 module.exports = modelCountry;
