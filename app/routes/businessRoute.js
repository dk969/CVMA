var Business = require('../models/business');
var User = require('../models/user');

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
    //gets current user
    businessRouter.post('/currentUser', function (req, res) {
        res.send(req.decoded);
    });
    businessRouter.get('/permission', function(req, res) {
        User.findOne({ username: req.decoded.username}, function(err, user) {
            if (err) throw err;
            if(!user) {
                res.json({ success: false, message: 'No users were found'});
            } else {
                res.json({ success: true, permission: user.permission });
            }
        });
    });

    businessRouter.get('/business', function(req,res) {
        Business.find({}, function(err, companies) {
            if (err) throw err;
            User.findOne({user: req.decoded }, function(err, mainUser) {
                if (err) throw err;
                if (!mainUser) {
                    res.json({ success: false, message: ' No User found'});
                } else {
                    if (mainUser.permission ==='admin' || mainUser.permission === 'moderator' || mainUser.permission === 'user') {
                        if (!companies) {
                            res.json ({ success: false, message: 'Businesses not found'});
                        } else { 
                            res.json({ success: true, companies: companies, permission: mainUser.permission });
                        }


                    } else {
                        res.json({ success: false, message: 'Insufficient Permission'});
                    }
                }
            })
        });
    });

    businessRouter.get('/get/:id', function(req,res) {
        var businessId = req.params.id;
        
        Business.findOne({ _id: businessId}, function(err, company) {
            if (err) throw err;
            User.findOne({user: req.decoded }, function(err, mainUser) {
                if (err) throw err;
                if (!mainUser) {
                    res.json({ success: false, message: ' No User found'});
                } else {
                    if (mainUser.permission ==='admin' || mainUser.permission === 'moderator' || mainUser.permission === 'user') {
                        if (!company) {
                            res.json ({ success: false, message: 'Businesses not found'});
                        } else { 
                            res.json({ success: true, company: company, permission: mainUser.permission });
                           
                        }


                    } else {
                        res.json({ success: false, message: 'Insufficient Permission'});
                    }
                }
            })
        });
    });
   
    businessRouter.delete('/business/:_id', function(req, res) {
        var deletedBusiness = req.params._id;
        User.findOne({ user: req.decoded}, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser) {
                res.json({ success: false, message: 'No user found'});
            } else {
                if (mainUser.permission !== 'admin') {
                    res.json({ success: false, message: 'Insufficant Permission'});
                } else {
                    Business.findOneAndRemove({ _id: deletedBusiness }, function(err, business) {
                        if (err) throw err;
                        res.json({success: true, });
                    });
                }
            }
        });
    });

    businessRouter.get('/editBusiness/:id', function(req,res) {
        var editBusiness = req.params.id;
        User.findOne({user: req.decoded}, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser) {
                res.json({ success: false, message: 'No user found'});
            } else {
                if ( mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                    Business.findOne({ _id: editBusiness}, function(err,business) {
                        if (err) throw err;
                        if (!business) {
                            res.json({ success: false, message: 'No businesses found'});
                        } else {
                            res.json({ success: true, business: business});
                        }
                    });
                } else {
                    res.json({ success: false, message: 'Insufficient Permission'});
                }
            }
        });
    })
    
    businessRouter.put('/editBusiness', function(req,res) {
        var editBusiness = req.body._id;
        if (req.body.business_name) var newName = req.body.business_name;
        if (req.body.business_type) var newType = req.body.business_type;
        if (req.body.business_address) var newAddress = req.body.business_address;
        if (req.body.business_postcode) var newPostcode = req.body.business_postcode;
        if (req.body.website) var newWebsite = req.body.website;
        if (req.body.business_email) var newEmail = req.body.business_email;
        if (req.body.business_contact) var newContact = req.body.business_contact;
        if (req.body.specialization) var newSpecialization = req.body.specialization;
        User.findOne({ user: req.decoded}, function(err, mainUser) {
            if (err) throw err;
            if (!mainUser) {
                res.json({ success: false, message: 'No user found'});
            } else {
                if (newName) {
                    if ( mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        Business.findOne({ _id: editBusiness}, function(err, business) {
                            if (err) throw err;
                            if (!business) {
                                res.json({ success: false, message: 'No business found'});
                            } else {
                                business.business_name = newName;
                                business.save(function(err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        res.json({ success: true, message: "Name has been updated."})
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: "Insufficient Permission"});
                    }
                } 
                if (newType) {
                    if ( mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        Business.findOne({ _id: editBusiness}, function(err, business) {
                            if (err) throw err;
                            if (!business) {
                                res.json({ success: false, message: 'No business found'});
                            } else {
                                business.business_type = newType;
                                business.save(function(err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        res.json({ success: true, message: "Type has been updated."})
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: "Insufficient Permission"});
                    }
                } 
                if (newAddress) {
                    if ( mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        Business.findOne({ _id: editBusiness}, function(err, business) {
                            if (err) throw err;
                            if (!business) {
                                res.json({ success: false, message: 'No business found'});
                            } else {
                                business.business_address = newAddress;
                                business.save(function(err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        res.json({ success: true, message: "Address has been updated."})
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: "Insufficient Permission"});
                    }
                } 
                if (newPostcode) {
                    if ( mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        Business.findOne({ _id: editBusiness}, function(err, business) {
                            if (err) throw err;
                            if (!business) {
                                res.json({ success: false, message: 'No business found'});
                            } else {
                                business.business_postcode = newPostcode;
                                business.save(function(err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        res.json({ success: true, message: "Postcode has been updated."})
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: "Insufficient Permission"});
                    }
                } 
                if (newWebsite) {
                    if ( mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        Business.findOne({ _id: editBusiness}, function(err, business) {
                            if (err) throw err;
                            if (!business) {
                                res.json({ success: false, message: 'No business found'});
                            } else {
                                business.website = newWebsite;
                                business.save(function(err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        res.json({ success: true, message: "Website has been updated."})
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: "Insufficient Permission"});
                    }
                } 
                if (newEmail) {
                    if ( mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        Business.findOne({ _id: editBusiness}, function(err, business) {
                            if (err) throw err;
                            if (!business) {
                                res.json({ success: false, message: 'No business found'});
                            } else {
                                business.business_email = newEmail;
                                business.save(function(err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        res.json({ success: true, message: "Email has been updated."})
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: "Insufficient Permission"});
                    }
                } 
                if (newContact) {
                    if ( mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        Business.findOne({ _id: editBusiness}, function(err, business) {
                            if (err) throw err;
                            if (!business) {
                                res.json({ success: false, message: 'No business found'});
                            } else {
                                business.business_contact = newContact;
                                business.save(function(err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        res.json({ success: true, message: "Contact number has been updated."})
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: "Insufficient Permission"});
                    }
                } 
                if (newSpecialization) {
                    if ( mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        Business.findOne({ _id: editBusiness}, function(err, business) {
                            if (err) throw err;
                            if (!business) {
                                res.json({ success: false, message: 'No business found'});
                            } else {
                                business.specialization = newSpecialization;
                                business.save(function(err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        res.json({ success: true, message: "Specialization has been updated."})
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


    return businessRouter;
}