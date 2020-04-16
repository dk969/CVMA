var Vehicle = require('../models/vehicle');
var User = require('../models/user');

module.exports = function(vehicleRouter) {

   
    // vehicleRouter.post('/vehicle', function(req,res) {
    //     var vehicle = Vehicle();
    //     User.findOne({user: req.decoded}, function(err, user) {
    //         if (err) throw err;
    //         if (!user) {
    //             res.json({ success: false, message: ' No User found'});
    //         } else {
    //     vehicle.vehicle_make = req.body.vehicle_make;
    //     vehicle.vehicle_model = req.body.vehicle_model;
    //     vehicle.year = req.body.year;
    //     vehicle.engine_size = req.body.engine_size;
    //     vehicle.colour = req.body.colour;
    //     vehicle.MOT_date = req.body.MOT_date;
    //     vehicle.tax_date = req.body.tax_date;
    //     vehicle.service_date = req.body.service_date;
    //     vehicle.author = {
    //         id: user._id,
    //         username: user.username
    //      }

    // if (req.body.vehicle_make == null || req.body.vehicle_make == '' || req.body.vehicle_model == null || req.body.vehicle_model == '' || req.body.year == null || req.body.year == '' || req.body.engine_size == null || req.body.engine_size == ''
    // || req.body.colour == null || req.body.colour == '' || req.body.MOT_date == null || req.body.MOT_date == '' || req.body.tax_date == null || req.body.tax_date == '' || req.body.service_date == null || req.body.service_date == ''
    // ) {
    //     res.json({ success: false, message: 'Ensure all vehicle details are provided'});

    //     } else {
    //         vehicle.save(function(err) {
    //             if (err) {
    //                 if (err.errors != null) {
    //                     if (err.errors.vehicle_make) {
    //                         res.json({ success: false, message: err.errors.vehicle_make.message});
    //                     } else if (err.errors.vehicle_model) {
    //                         res.json({ success: false, message: err.errors.vehicle_model.message});
    //                     } else if (err.errors.year) {
    //                         res.json({ success: false, message: err.errors.year.message});
    //                     } else if (err.errors.engine_size) {
    //                         res.json({ success: false, message: err.errors.engine_size.message});
    //                     } else if (err.errors.colour) {
    //                         res.json({ success: false, message: err.errors.colour.message});
    //                     } else if (err.errors.MOT_date) {
    //                         res.json({ success: false, message: err.errors.MOT_date.message});
    //                     } else if (err.errors.tax_date) {
    //                         res.json({ success: false, message: err.errors.tax_date.message});
    //                     } else if (err.errors.service_date) {
    //                         res.json({ success: false, message: err.errors.service_date.message});
    //                     } else {
    //                         res.json({success: false, message: err});
    //                     }
    //                 }else if(err) {
    //                     res.json({success:false, message: err});
    //                 }
    //             } else {
    //                 res.json({ success: true, message: 'Vehicle Posted'});
    //             }
    //         });
    //          }   
    //      }
    //     })      
    // });

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
            User.findOne({user: req.decoded}, function(err, user) {
                if (err) throw err;
                if (!user) {
                    res.json({ success: false, message: ' No User found'});
                } else {
                    Vehicle.find({'author.id': user._id}, function(err, vehicles) {
                        if (err) throw err;
                    if (user.permission ==='admin' || user.permission === 'moderator' || user.permission === 'user') {
                        if (!vehicles) {
                            res.json ({ success: false, message: 'Vehicles not found'});
                        } else { 
                            res.json({ success: true, vehicles: vehicles, permission: user.permission, id: user._id });
                        }


                    } else {
                        res.json({ success: false, message: 'Insufficient Permission'});
                    }
                });
                }
            })
        
    });
//     vehicleRouter.get('/vehicle/:id', function(req,res) {
//         User.findOne( {user: req.decoded}, function(err, user) {
            
          
//                if (err) throw err;
//                if (!user) {
//                    res.json({ success: false, message: ' No User found'});
//                } else {
                   
//                    Vehicle.find({'author.id': req.user._id}, function(err, vehicles) {
//                    if (user.permission ==='admin' || user.permission === 'moderator' || user.permission === 'user') {
//                        if (!vehicles) {
//                            res.json ({ success: false, message: 'Vehicles not found'});
//                        } else { 
//                            console.log(user);
//                            res.json({ success: true, vehicles: vehicles, permission: user.permission, user: req.user});
//                        }


//                    } else {
//                        res.json({ success: false, message: 'Insufficient Permission'});
//                    }
//                })
//                }
          
//        });
//    });

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

    vehicleRouter.get('/editVehicle/:id', function(req,res) {
        var editVehicle = req.params.id;
        User.findOne({user: req.decoded}, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser) {
                res.json({ success: false, message: 'No user found'});
            } else {
                if ( mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                    Vehicle.findOne({ _id: editVehicle}, function(err,vehicle) {
                        if (err) throw err;
                        if (!vehicle) {
                            res.json({ success: false, message: 'No vehicles found'});
                        } else {
                            res.json({ success: true, vehicle: vehicle});
                        }
                    });
                } else {
                    res.json({ success: false, message: 'Insufficient Permission'});
                }
            }
        });
    })

    vehicleRouter.put('/editVehicle', function(req,res) {
        var editVehicle = req.body._id;
        if (req.body.vehicle_make) var newMake = req.body.vehicle_make;
        if (req.body.vehicle_model) var newModel = req.body.vehicle_model;
        if (req.body.year) var newYear = req.body.year;
        if (req.body.engine_size) var newEngine_size = req.body.engine_size;
        if (req.body.colour) var newColour = req.body.colour;
        if (req.body.MOT_date) var newMOT = req.body.MOT_date;
        if (req.body.tax_date) var newTax = req.body.tax_date;
        if (req.body.service_date) var newService = req.body.service_date;
        User.findOne({ user: req.decoded}, function(err, mainUser) {
            if (err) throw err;
            if (!mainUser) {
                res.json({ success: false, message: 'No user found'});
            } else {
                if (newMake) {
                    if ( mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        Vehicle.findOne({ _id: editVehicle}, function(err, vehicle) {
                            if (err) throw err;
                            if (!vehicle) {
                                res.json({ success: false, message: 'No vehicle found'});
                            } else {
                                vehicle.vehicle_make = newMake;
                                vehicle.save(function(err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        res.json({ success: true, message: "Make has been updated."})
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: "Insufficient Permission"});
                    }
                } 
                if (newModel) {
                    if ( mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        Vehicle.findOne({ _id: editVehicle}, function(err, vehicle) {
                            if (err) throw err;
                            if (!vehicle) {
                                res.json({ success: false, message: 'No vehicle found'});
                            } else {
                                vehicle.vehicle_model = newModel;
                                vehicle.save(function(err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        res.json({ success: true, message: "Model has been updated."})
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: "Insufficient Permission"});
                    }
                } 
                if (newYear) {
                    if ( mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        Vehicle.findOne({ _id: editVehicle}, function(err, vehicle) {
                            if (err) throw err;
                            if (!vehicle) {
                                res.json({ success: false, message: 'No vehicle found'});
                            } else {
                                vehicle.year = newYear;
                                vehicle.save(function(err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        res.json({ success: true, message: "Year has been updated."})
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: "Insufficient Permission"});
                    }
                } 
                if (newEngine_size) {
                    if ( mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        Vehicle.findOne({ _id: editVehicle}, function(err, vehicle) {
                            if (err) throw err;
                            if (!vehicle) {
                                res.json({ success: false, message: 'No vehicle found'});
                            } else {
                                vehicle.engine_size = newEngine_size;
                                vehicle.save(function(err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        res.json({ success: true, message: "Engine Size has been updated."})
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: "Insufficient Permission"});
                    }
                } 
                if (newColour) {
                    if ( mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        Vehicle.findOne({ _id: editVehicle}, function(err, vehicle) {
                            if (err) throw err;
                            if (!vehicle) {
                                res.json({ success: false, message: 'No vehicle found'});
                            } else {
                                vehicle.colour = newColour;
                                vehicle.save(function(err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        res.json({ success: true, message: "Colour has been updated."})
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: "Insufficient Permission"});
                    }
                } 
                if (newMOT) {
                    if ( mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        Vehicle.findOne({ _id: editVehicle}, function(err, vehicle) {
                            if (err) throw err;
                            if (!vehicle) {
                                res.json({ success: false, message: 'No vehicle found'});
                            } else {
                                vehicle.MOT_date = newMOT;
                                vehicle.save(function(err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        res.json({ success: true, message: "MOT has been updated."})
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: "Insufficient Permission"});
                    }
                } 

                if (newTax) {
                    if ( mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        Vehicle.findOne({ _id: editVehicle}, function(err, vehicle) {
                            if (err) throw err;
                            if (!vehicle) {
                                res.json({ success: false, message: 'No vehicle found'});
                            } else {
                                vehicle.tax_date = newTax;
                                vehicle.save(function(err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        res.json({ success: true, message: "Tax has been updated."})
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: "Insufficient Permission"});
                    }
                } 

                if (newService) {
                    if ( mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        Vehicle.findOne({ _id: editVehicle}, function(err, vehicle) {
                            if (err) throw err;
                            if (!vehicle) {
                                res.json({ success: false, message: 'No vehicle found'});
                            } else {
                                vehicle.service_date = newService;
                                vehicle.save(function(err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        res.json({ success: true, message: "Service date has been updated."})
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: "Insufficient Permission"});
                    }
                } 



            }
        })
    });
            
    return vehicleRouter;
}