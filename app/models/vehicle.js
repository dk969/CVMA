const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let Vehicle = new Schema({
  make: {
    type: String
  },
  model: {
    type: String
  },
 
},{
    collection: 'vehicle'
});

module.exports = mongoose.model('Vehicle', Vehicle);