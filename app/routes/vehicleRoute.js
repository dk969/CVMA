var Vehicle = require('../models/vehicle');

module.exports = function(vehicleRouter) {

   
    vehicleRouter.post('/vehicle', function(req,res) {
        var vehicle = Vehicle();
        vehicle.vehicle_make = req.body.vehicle_make;
        vehicle.vehicle_model = req.body.vehicle_model;
        vehicle.year = req.body.year;
        vehicle.engine_size = req.body.engine_size;
        vehicle.colour = req.body.colour;
        vehicle.MOT_date = req.body.MOT_date;
        vehicle.tax_date = req.body.tax_date;
        vehicle.service_date = req.body.service_date;

    if (req.body.vehicle_make == null || req.body.vehicle_make == '' || req.body.vehicle_model == null || req.body.vehicle_model == '' || req.body.year == null || req.body.year == '' || req.body.engine_size == null || req.body.engine_size == ''
    || req.body.colour == null || req.body.colour == '' || req.body.MOT_date == null || req.body.MOT_date == '' || req.body.tax_date == null || req.body.tax_date == '' || req.body.service_date == null || req.body.service_date == ''
    ) {
        res.json({ success: false, message: 'Ensure all vehicle details are provided'});

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