const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var validate = require('mongoose-validator');


var nameValidator = [ 
  validate({
      validator: 'matches',
      arguments: /^(([a-zA-Z]{2,20})+[ ]+([a-zA-Z]{2,20})+)+$|([a-zA-Z]{2,20})+/,
      message: "Must be at least 2 charaters, max 20, no special characters and must have space in between"
  }),
  validate({
      validator: 'isLength',
      arguments: [3, 20],
      message: "Name should be between {ARGS[0]} amd {ARGS[1]} characters"
  })
];
var typeValidator = [ 
  validate({
    validator: 'matches',
    arguments: /garage|Garage|Parts Supplier|parts supplier|garage and parts supplier/,
    message: "Please specify if you are a garage or part's supplier"
}),
  validate({
      validator: 'isAlphanumeric',
      message: "Please check the type entered"
  })
];

var websiteValidator = [
  validate({
      validator: 'matches',
      arguments: /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
      message: "Website should follow these examples: www.cool.com, http://www.cool.com.au"
      
  }),
  validate({
      validator: 'isLength',
      arguments: [3, 30],
      message: "Website should be between {ARGS[0]} amd {ARGS[1]} characters"
  })
];
// Define collection and schema for Business
let BusinessPost = new Schema({
  business_title: {type: String, required: true,},
  business_name: {type: String, required: true, validate: nameValidator},
  business_type: {type: String, required: true, validate: typeValidator},
  website: {type: String, required: true, validate: websiteValidator},
  specialization: {type: String, required: true,},
  post: {type: String, required: true, },
 
  author:{ 
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  }
});

module.exports = mongoose.model('BusinessPost', BusinessPost);