var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validate = require('mongoose-validator');



let Address = new Schema({


address: [ {

}

],




},{
    collection: 'address'
});

module.exports = mongoose.model('Address', Address);