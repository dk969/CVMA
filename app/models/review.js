const mongoose = require('mongoose');
const Schema = mongoose.Schema;




// Define collection and schema for Review
var Review = new Schema({
  business_id: { type: String, required: true},
  name: { type: String, required: true},
  rating: { type: Number, required: true},
  comments: { type: String, required: true},
  author:{ 
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },

  
 

});

module.exports = mongoose.model('Review', Review);