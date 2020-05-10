const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var validate = require('mongoose-validator');

//Validation for vehicle
var sizeValidator = [ 
  validate({
      validator: 'matches',
      arguments: /^\d{1,2}(\.\d{1})?$/,
      message: "Please enter your engine size example: 1.2"
  }),
  validate({
      validator: 'isLength',
      arguments: [2, 4],
      message: "Name should be between {ARGS[0]} amd {ARGS[1]} characters"
  })
];

// Define collection and schema for Vehicle
let Vehicle = new Schema({
    vehicle_make: {type: String, required: true },
      vehicle_model: {type: String, required: true},
      year: {type: Number, required: true, },
      engine_size: {type: String, required: true, validate: sizeValidator},
      colour: {type: String, required: true},
      MOT_date: {type: Date },
      tax_date: {type: Date },
      service_date: {type: Date },
      author:{ 
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        username: String
      }

});

module.exports = mongoose.model('Vehicle', Vehicle);