const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let Business = new Schema({
  name: {
    type: String
  },
  type: {
    type: String
  },
 
},{
    collection: 'business'
});

module.exports = mongoose.model('Business', Business);