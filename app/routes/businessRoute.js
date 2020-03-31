var Business = require('../models/business');

module.exports = function(businessRouter) {

   
    businessRouter.post('/business', function(req,res) {
        var business = Business();
        business.business_name = req.body.business_name;
        business.business_type = req.body.business_type;
        business.business_address = req.body.business_address;
        business.business_postcode = req.body.business_postcode;
        business.website = req.body.website;
        business.business_email = req.body.business_email;
        business.business_contact = req.body.business_contact;
        business.specialization = req.body.specialization;
    if (req.body.business_name == null || req.body.business_name == '' || req.body.business_type == null || req.body.business_type == '' || req.body.business_address == null || req.body.business_address == '' || req.body.business_postcode == null || req.body.business_postcode == ''
    || req.body.website == null || req.body.website == '' || req.body.business_email == null || req.body.business_email == '' || req.body.business_contact == null || req.body.business_contact == '' || req.body.specialization == null || req.body.specialization == '') {
        res.json({ success: false, message: 'Ensure Business name is provided'});

        } else {
             business.save(function(err) {
                if (err) {
                    res.json({ success: false, message: err});
                } else {
                    res.json({ success: true, message: 'Business Posted'});
                }
            });
        }   
    });
    return businessRouter;
}