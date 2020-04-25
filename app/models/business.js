const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var validate = require('mongoose-validator');

//Business Validator backend
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


var addressValidator = [
  validate({
      validator: 'matches',
      arguments: /^\d+\s[A-z]+\s[A-z]+,\s[A-z]+/,
      message: "Must be like this example: 61 Park Street, Leicester"
  }),
  validate({
      validator: 'isLength',
      arguments: [3, 35],
      message: "Address should be between {ARGS[0]} amd {ARGS[1]} characters"
  })
];

var postcodeValidator = [
  validate({
      validator: 'matches',
      arguments: /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/,
      message: "Postcode to resemble these examples: SE50EG, se5 0eg, WC2H 7LT"
  }),
  validate({
      validator: 'isLength',
      arguments: [4, 10],
      message: "Postcode should be between {ARGS[0]} amd {ARGS[1]} characters"
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

var emailValidator = [
  validate({
      validator: 'isEmail',
      message: "Is not a valid Email."
  }),
  validate({
      validator: 'isLength',
      arguments: [3, 25],
      message: "Email should be between {ARGS[0]} amd {ARGS[1]} characters"
  })
];
var contactValidator = [
  validate({
      validator: 'matches',
      arguments: /^((\(?0\d{4}\)?\s?\d{3}\s?\d{3})|(\(?0\d{3}\)?\s?\d{3}\s?\d{4})|(\(?0\d{2}\)?\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/,
      message: "Must be like examples 01222 555 555 | (010) 55555555 #2222 | 0122 555 5555#222"
  }),
  validate({
      validator: 'isLength',
      arguments: [3, 20],
      message: "Contact Number should be between {ARGS[0]} amd {ARGS[1]} characters"
  })
];

// Define collection and schema for Business
var Business = new Schema({
  business_name: { type: String, required: true, validate: nameValidator },
  business_type: { type: String, required: true, },
  business_address: { type: String, required: true, validate:addressValidator},
  business_postcode: { type: String, required: true, validate:postcodeValidator},
  website: { type: String, required: true,  validate: websiteValidator},
  business_email: {type: String, required: true, lowercase: true, unique: true, validate: emailValidator},
  business_contact: {  type: String, required: true, validate: contactValidator},
  specialization: { type: String, required: true},
  author:{ 
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  }
 

});

module.exports = mongoose.model('Business', Business);