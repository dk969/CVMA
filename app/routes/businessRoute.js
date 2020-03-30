var Business = require('../models/business');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

module.exports = function(businessRouter) {

    var options = {
    auth: {
        api_user: 'dking215',
        api_key: 'King1995!'
    }
    }

    var client = nodemailer.createTransport(sgTransport(options));

    businessRouter.post('/business', function(req,res) {
        var business = Business();
        business.business_name = req.body.business_name;
    if (req.body.business_name == null) {
        res.json({ success: false, message: 'Ensure Business name is provided'});

        } else {
             business.save(function(err) {

            });
        }   
    });
    return businessRouter;
}