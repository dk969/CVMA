const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var validate = require('mongoose-validator');


var yearValidator = [ 
  validate({
      validator: 'matches',
      arguments: /^\d{4}$/,
      message: "Please enter a Year example: 2008"
  }),
  validate({
      validator: 'isLength',
      arguments: [0, 4],
      message: "Year should be between {ARGS[0]} amd {ARGS[1]} characters"
  })
];
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
var dateValidator = [ 
  validate({
      validator: 'matches',
      arguments: /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/,
      message: "Please enter a valid date example: 24/02/1998"
  }),
  validate({
      validator: 'isLength',
      arguments: [3, 10],
      message: "date should be between {ARGS[0]} amd {ARGS[1]} characters"
  })
];
// Define collection and schema for Business
let Vehicle = new Schema({
    vehicle_make: {type: String, required: true },
      vehicle_model: {type: String, required: true},
      year: {type: Number, required: true, },
      engine_size: {type: String, required: true, validate: sizeValidator},
      colour: {type: String, required: true},
      MOT_date: {type: Date, required: true, },
      tax_date: {type: Date, required: true, },
      service_date: {type: Date, required: true, }

 
},{
    collection: 'vehicle'
});

module.exports = mongoose.model('Vehicle', Vehicle);