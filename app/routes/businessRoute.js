var Business = require('../models/business');
var BusinessPost = require('../models/businessPost');
var Subscribe = require('../models/subscribe');
var User = require('../models/user');
var Address = require('../models/address');
var Review = require('../models/review');
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

         //gets current user
    businessRouter.post('/currentUser', function (req, res) {
        res.send(req.decoded);
    });
    
  
    //Post subscribers emails
    businessRouter.post('/subscribe', function(req,res, next) {
        Subscribe.findOneAndUpdate( { },{"$push": { "emails": req.body.email,}}, 
        { "upsert": true, "new": true },function(err, subscribers) {
            if (err) throw err;
            console.log(subscribers);
            if (req.body.email == null || req.body.email == '' ) {
                res.json({ success: false, message: 'Ensure Email is provided'});

                } else {
                    
                        if (err) {
                            res.json({ success: false, message: err});
                        } else {
                            res.json({ success: true, message: 'Subscription Successful'});
                        }
                    };

                })
        
        
    });




   

    //GETS
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

  

    
    //gets subscribers
    businessRouter.get('/subscribe', function(req,res) {
        Subscribe.find({}, function(err, subscribers) {
            if (err) throw err;
            User.findOne({user: req.decoded }, function(err, mainUser) {
                if (err) throw err;
                if (!mainUser) {
                    res.json({ success: false, message: ' No User found'});
                } else {
                    if (mainUser.permission ==='admin' || mainUser.permission === 'moderator' ) {
                        if (!subscribers) {
                            res.json ({ success: false, message: 'Subscribers not found'});
                        } else { 
                            res.json({ success: true, subscribers: subscribers, permission: mainUser.permission });
                        }


                    } else {
                        res.json({ success: false, message: 'Insufficient Permission'});
                    }
                }
            })
        });
    });
    //gets addresses for maps
    businessRouter.get('/address', function(req,res) {
        Address.find({}, function(err, address) {
            if (err) throw err;
            if (!address) {
                res.json ({ success: false, message: 'Addresses not found'});
            } else { 
                res.json({ success: true, address: address});
            }
        });
    });

    //DELETES
   
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
    businessRouter.delete('/businessPost/:_id', function(req, res) {
        var deletedPost = req.params._id;
        User.findOne({ user: req.decoded}, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser) {
                res.json({ success: false, message: 'No user found'});
            } else {
                if (mainUser.permission !== 'admin') {
                    res.json({ success: false, message: 'Insufficant Permission'});
                } else {
                    BusinessPost.findOneAndRemove({ _id: deletedPost }, function(err, business) {
                        if (err) throw err;
                        res.json({success: true, });
                    });
                }
            }
        });
    });
     //Delete Review
  businessRouter.delete('/review/:_id', function(req, res) {
    var deletedReview = req.params._id;
    User.findOne({ user: req.decoded}, function (err, mainUser) {
        if (err) throw err;
        if (!mainUser) {
            res.json({ success: false, message: 'No user found'});
        } else {
            if (mainUser.permission !== 'admin') {
                res.json({ success: false, message: 'Insufficant Permission'});
            } else {
                Review.findOneAndRemove({ _id: deletedReview }, function(err, review) {
                    if (err) throw err;
                    res.json({success: true, });
                });
            }
        }
    });
});
    businessRouter.delete('/subscribe/:_id', function(req, res) {
        var deletedSub = req.params._id;
        User.findOne({ user: req.decoded}, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser) {
                res.json({ success: false, message: 'No user found'});
            } else {
                if (mainUser.permission !== 'admin') {
                    res.json({ success: false, message: 'Insufficant Permission'});
                } else {
                    Subscribe.findOneAndRemove({ _id: deletedSub }, function(err, business) {
                        if (err) throw err;
                        res.json({success: true, });
                    });
                }
            }
        });
    });
    //Edit business via ID
    businessRouter.get('/editBusiness/:id', function(req,res) {
        var editBusiness = req.params.id;
        User.findOne({user: req.decoded}, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser) {
                res.json({ success: false, message: 'No user found'});
            } else {
                if ( mainUser.permission === 'admin' || mainUser.permission === 'moderator' ) {
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
    //EDIT Business
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