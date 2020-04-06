const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let BusinessPost = new Schema({
  business_title: {
      type: String
  },
  business_name: {
    type: String
  },
  business_type: {
    type: String
  },
  website: {
    type: String
  },
  specialization: {
    type: String
  },
  post: {
      type: String
  }
 
},{
    collection: 'businessPost'
});

module.exports = mongoose.model('BusinessPost', BusinessPost);