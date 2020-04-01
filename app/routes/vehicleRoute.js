var Vehicle = require('../models/vehicle');
var User = require('../models/user');

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

     //gets current user
     vehicleRouter.post('/currentUser', function (req, res) {
        res.send(req.decoded);
    });
    vehicleRouter.get('/permission', function(req, res) {
        User.findOne({ username: req.decoded.username}, function(err, user) {
            if (err) throw err;
            if(!user) {
                res.json({ success: false, message: 'No users were found'});
            } else {
                res.json({ success: true, permission: user.permission });
            }
        });
    });

    vehicleRouter.get('/vehicle', function(req,res) {
        Vehicle.find({}, function(err, vehicles) {
            if (err) throw err;
            User.findOne({user: req.decoded }, function(err, mainUser) {
                if (err) throw err;
                if (!mainUser) {
                    res.json({ success: false, message: ' No User found'});
                } else {
                    if (mainUser.permission ==='admin' || mainUser.permission === 'moderator' || mainUser.permission === 'user') {
                        if (!vehicles) {
                            res.json ({ success: false, message: 'Vehicles not found'});
                        } else { 
                            res.json({ success: true, vehicles: vehicles, permission: mainUser.permission });
                        }


                    } else {
                        res.json({ success: false, message: 'Insufficient Permission'});
                    }
                }
            })
        });
    });

    vehicleRouter.delete('/vehicle/:_id', function(req, res) {
        var deletedVehicle = req.params._id;
        User.findOne({ user: req.decoded}, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser) {
                res.json({ success: false, message: 'No user found'});
            } else {
                if (mainUser.permission !== 'admin') {
                    res.json({ success: false, message: 'Insufficant Permission'});
                } else {
                    Vehicle.findOneAndRemove({ _id: deletedVehicle }, function(err, vehicle) {
                        if (err) throw err;
                        res.json({success: true, });
                    });
                }
            }
        });
    });
    return vehicleRouter;
}