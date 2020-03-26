var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
var User             = require('../models/user');
var session          = require('express-session');
var jwt              = require('jsonwebtoken');
var secret           = 'cvmaapp';

module.exports = function(app, passport) {
    // cannot get Individual Verification due to Covid-19

   
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { secure: false }}));

    passport.serializeUser(function(id, done) {
        token = jwt.sign({ username: user.username, email: user.email}, secret,{ expiresIn: '24h'});
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    passport.use(new FacebookStrategy({
        clientID: '203635277586309',
        clientSecret: 'b4a8f106acf635518841d02fb27decfe',
        callbackURL:"http://localhost:4200/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos','email']
    },
    function(accessToken, refreshToken, profile, done){
        console.log(profile._json.emails);
        User.findOne({ email: profile._json.emails }).select('username password,email').exec(function(err, user) {
            if (err) done(err);

            if (user && user != null) {
                done(null,user);
            } else {
                done(err);
            }
        });
      }
    ));

    passport.use(new GoogleStrategy({
        clientID:'920463717498-703mocfejh2kkspqjaggt3jc0e3aos57.apps.googleusercontent.com',
        clientSecret: 'N6qJmk2K4pFO-3eVBdrU44-9',
        callbackURL: 'http://localhost:4200/auth/google/callback'
    },
    
    function(accessToken, refreshToken, profile, done){
        console.log(profile.emails[0].value);
        User.findOne({ email: profile.emails[0].value}).select('username password,email').exec(function(err, user) {
            if (err) done(err);

            if (user && user != null) {
                done(null,user);
            } else {
                done(err);
            }
        });
      }
    ));

    app.get('/auth/google', passport.authenticate('google', {scope: ['http://www.googleapis.com/auth/plus.login', 'profile', 'email']}));

    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/googleerror'}), function(req, res) {
        res.redirect('/google/' + token);
    });





    app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/facebookerror'}), function(req, res) {
        res.redirect('/facebook/' + token);
    });

    app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

    return passport;
}