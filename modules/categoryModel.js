const mongoose = require('mongoose');
var config = require('../config/config');
mongoose.connect(config.mongoDB, {
useNewUrlParser: true,
useUnifiedTopology: true
});

var conn = mongoose.connection;

 var schemaCategory = new mongoose.Schema({
   name: String
 }, {
     collection: 'category'
 });

 var  modelCategory = mongoose.model('category', schemaCategory);
 module.exports = modelCategory;
