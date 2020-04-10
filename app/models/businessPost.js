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
      arguments: /(https?:\/\/)?(www\.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)|(https?:\/\/)?(www\.)?(?!ww)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
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
  post: {type: String, required: true, }
 
},{
    collection: 'businessPost'
});

module.exports = mongoose.model('BusinessPost', BusinessPost);