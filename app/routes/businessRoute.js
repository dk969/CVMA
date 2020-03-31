var Business = require('../models/business');

module.exports = function(businessRouter) {

   
    businessRouter.post('/business', function(req,res) {
        var business = Business();
        business.name = req.body.name;
        business.type = req.body.type;
    if (req.body.name == null || req.body.name == '' || req.body.type == null || req.body.type == '') {
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