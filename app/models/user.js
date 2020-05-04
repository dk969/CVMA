var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');

//Validations for user back end
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
        arguments: [3, 40],
        message: "Email should be between {ARGS[0]} amd {ARGS[1]} characters"
    })
];

var usernameValidator = [ 
    validate({
        validator: 'isLength',
        arguments: [3, 25],
        message: "Username should be between {ARGS[0]} amd {ARGS[1]} characters"
    }),
    validate({
        validator: 'isAlphanumeric',
        message: "Username must contain numbers and letters only."
    })
];
var passwordValidator = [
    validate({
        validator: 'matches',
        arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/,
        message: "Password must be at least 8-35 charaters, with at least one special character, one lowercase and one uppercase."
    }),
    validate({
        validator: 'isLength',
        arguments: [8, 35],
        message: "Password should be between {ARGS[0]} amd {ARGS[1]} characters"
    })
];


var UserSchema = new Schema({

    name: {type: String, required: true, validate: nameValidator},
    username: {type: String, required: true, lowercase: true, unique: true, validate: usernameValidator},
    password: {type: String, required: true, validate: passwordValidator, select: false},
    email: {type: String, required: true, lowercase: true, unique: true, validate: emailValidator},
    active: { type: Boolean, required: true, default: false},
    temporarytoken: { type: String, required: true},
    resettoken: { type: String, required: false},
    permission: { type: String, required: true, default: 'user'}
});

UserSchema.pre('save', function(next){
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt.hash(user.password, null, null, function(err, hash){
        if (err) return next(err);
        user.password = hash;
        next();
    });
});
//User name Validation, first and last
UserSchema.plugin(titlize, {
    paths: [ 'name' ]
});

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User',UserSchema);