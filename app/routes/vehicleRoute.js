var Vehicle = require('../models/vehicle');

module.exports = function(vehicleRouter) {

   
    vehicleRouter.post('/vehicle', function(req,res) {
        var vehicle = Vehicle();
        vehicle.make = req.body.make;
        vehicle.model = req.body.model;
    if (req.body.make == null || req.body.make == '' || req.body.model == null || req.body.model == '') {
        res.json({ success: false, message: 'Ensure vehicle name is provided'});

        } else {
            vehicle.save(function(err) {
                if (err) {
                    res.json({ success: false, message: err});
                } else {
                    res.json({ success: true, message: 'Vehicle Posted'});
                }
            });
        }   
    });
    return vehicleRouter;
}