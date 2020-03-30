var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');

//Validations
var nameValidator = [
    validate({
        validator: 'matches',
        arguments: /^(([a-zA-Z]{2,20})+[ ]+([a-zA-Z]{2,20})+)+$/,
        message: "Must be at least 2 charaters, max 20, no special characters and must have space in between"
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 20],
        message: "Name should be between {ARGS[0]} amd {ARGS[1]} characters"
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

const businessSchema = mongoose.Schema({

  business_name: {type: String,  required: true, validate: nameValidator},
  business_type: {type: String},
  business_address: {type: String},
  business_postcode: {type: String},
  website: { type: String},
  business_email: {type: String, required: true, lowercase: true, unique: true, validate: emailValidator },
  business_contact: {type: String},
  specialization: {type: String}
});

module.exports = mongoose.model('Business', businessSchema)