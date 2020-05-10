var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validate = require('mongoose-validator');


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
// The array for email subscriptions
let Subscribe = new Schema({
emails: [ { validate: emailValidator
}],

},{
    collection: 'subscribe'
});

module.exports = mongoose.model('Subscribe', Subscribe);