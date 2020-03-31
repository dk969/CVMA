const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let Vehicle = new Schema({
    vehicle_make: {
        type: String
      },
      vehicle_model: {
        type: String
      },
      year: {
        type: Number
      },
      engine_size: {
        type: String
      },
      colour: {
        type: String
      },
      MOT_date: {
        type: Date
      },
      tax_date: {
        type: Date
      },
      service_date: {
        type: Date
      }

 
},{
    collection: 'vehicle'
});

module.exports = mongoose.model('Vehicle', Vehicle);