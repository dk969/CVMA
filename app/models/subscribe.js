var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validate = require('mongoose-validator');



// The array for email subscriptions
let Subscribe = new Schema({
emails: [ {
}],

},{
    collection: 'subscribe'
});

module.exports = mongoose.model('Subscribe', Subscribe);