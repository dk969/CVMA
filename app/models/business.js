const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let Business = new Schema({
  business_name: {
    type: String
  },
  business_type: {
    type: String
  },
  business_address: {
    type: String
  },
  business_postcode: {
    type: String
  },
  website: {
    type: String
  },
  business_email: {
    type: String
  },
  business_contact: {
    type: String
  },
  specialization: {
    type: String
  }
 
},{
    collection: 'business'
});

module.exports = mongoose.model('Business', Business);