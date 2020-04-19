var Business = require('../models/business');
var BusinessPost = require('../models/businessPost');
var Subscribe = require('../models/subscribe');
var User = require('../models/user');
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
    
    // businessRouter.get('/user/:username', function(req, res) {
    //     User.find( {username: req.decoded.username }, function(err, mainUser) {
    //         console.log(mainUser);
    //         if (err) throw err;
    //         if(!mainUser) {
    //             res.json({ success: false, message: " No user found"});
    //         } else { 
    //              User.findOne({ _id: req.body._id}, function(err, user) {
    //                  console.log(user);
    //                 if (err) throw err;
    //                 if (!user) {
    //                     res.json({ success: false, message: 'No user found'});
    //                 } else {

    //                 }
    //             })
    //         }
    //     });
    // });


    //POSTS
    // businessRouter.post('/business', function(req,res) {

    //     var business = Business();
        
    //     User.find(req.params, function(err, mainUser) {
    //         console.log(mainUser.username);
    //         if (err) throw err;
    //         if(!mainUser) {
    //             res.json({ success: false, message: " No user found"});
    //         } else { 
    //              User.findOne({ _id: mainUser}, function(err, user) {
    //                  console.log(user);
    //                 if (err) throw err;
    //                 if (!user) {
    //                     res.json({ success: false, message: 'No user found'});
    //                 } else {
    //                     console.log(user._id);
    //                     business.business_name = req.body.business_name;
    //                     business.business_type = req.body.business_type;
    //                     business.business_address = req.body.business_address;
    //                     business.business_postcode = req.body.business_postcode;
    //                     business.website = req.body.website;
    //                     business.business_email = req.body.business_email;
    //                     business.business_contact = req.body.business_contact;
    //                     business.specialization = req.body.specialization;
    //                     business.author = {
    //                         id: user._id,
    //                         username: user.username
    //                     }
    //             if (req.body.business_name == null || req.body.business_name == '' || req.body.business_type == null || req.body.business_type == '' || req.body.business_address == null || req.body.business_address == '' || req.body.business_postcode == null || req.body.business_postcode == ''
    //             || req.body.website == null || req.body.website == '' || req.body.business_email == null || req.body.business_email == '' || req.body.business_contact == null || req.body.business_contact == '' || req.body.specialization == null || req.body.specialization == '') {
    //                 res.json({ success: false, message: 'Ensure Business details are provided'});
    //                 } else {
    //                     business.save(function(err) {
    //                         if (err) {
    //                             if (err.errors != null) {
    //                                 if (err.errors.business_name) {
    //                                     res.json({ success: false, message: err.errors.business_name.message});
    //                                 } else if (err.errors.business_type) {
    //                                     res.json({ success: false, message: err.errors.business_type.message});
    //                                 } else if (err.errors.business_address) {
    //                                     res.json({ success: false, message: err.errors.business_address.message});
    //                                 } else if (err.errors.business_postcode) {
    //                                     res.json({ success: false, message: err.errors.business_postcode.message});
    //                                 } else if (err.errors.website) {
    //                                     res.json({ success: false, message: err.errors.website.message});
    //                                 } else if (err.errors.business_email) {
    //                                     res.json({ success: false, message: err.errors.business_email.message});
    //                                 } else if (err.errors.business_contact) {
    //                                     res.json({ success: false, message: err.errors.business_contact.message});
    //                                 } else {
    //                                     res.json({success: false, message: err});
    //                                 }
    //                             }else if(err) {
    //                                 res.json({success:false, message: err});
    //                             }

    //                         } else {
    //                             res.json({ success: true, message: 'Business Posted', id: user._id});
    //                         }
    //         });
    //             }   
    //         }
    //     })
        
    //     }
    // })
    

    // });
    

    // businessRouter.post('/businessPost', function(req,res) {
    //     var businessPost = BusinessPost();
    //     User.findOne({user: req.decoded}, function(err, user) {
    //         if (err) throw err;
    //         if (!user) {
    //             res.json({ success: false, message: ' No User found'});
    //         } else {
    //     businessPost.business_title = req.body.business_title;
    //     businessPost.business_name = req.body.business_name;
    //     businessPost.business_type = req.body.business_type;
    //     businessPost.website = req.body.website;
    //     businessPost.specialization = req.body.specialization;
    //     businessPost.post = req.body.post;
    //     businessPost.author = {
    //         id: user._id,
    //         username: user.username
    //      }
       
    //         if (req.body.business_title == null || req.body.business_title == '' || req.body.business_name == null || req.body.business_name == '' || req.body.business_type == null || req.body.business_type == '' || 
    //         req.body.website == null || req.body.website == '' || req.body.specialization == null || req.body.specialization == ''|| req.body.post == null || req.body.post == '' ) {
    //             res.json({ success: false, message: 'Ensure the offer details are provided'});
                
    //         } else {
    //             businessPost.save(function(err) {
              
    //                     if (err) {
    //                         if (err.errors != null) {
    //                             if (err.errors.business_title) {
    //                                 res.json({ success: false, message: err.errors.business_title.message});
    //                             } else if (err.errors.business_name) {
    //                                 res.json({ success: false, message: err.errors.business_name.message});
    //                             } else if (err.errors.business_type) {
    //                                 res.json({ success: false, message: err.errors.business_type.message});
    //                             } else if (err.errors.website) {
    //                                 res.json({ success: false, message: err.errors.website.message});
    //                             } else if (err.errors.specialization) {
    //                                 res.json({ success: false, message: err.errors.specialization.message});
    //                             } else if (err.errors.post) {
    //                                 res.json({ success: false, message: err.errors.post.message});
    //                             } else {
    //                                 res.json({success: false, message: err});
    //                             }
    //                         }else if(err) {
    //                             res.json({success:false, message: err});
    //                         }
    //                     } else {
    //                     Subscribe.find(req.params.email, function(err, subscribers) {
    //                         console.log(subscribers);
                            
    //                         if (err) throw err;
    //                         var email = {
    //                             from: 'CVMA Staff, staff@CVMA.com',
    //                             to: subscribers,
    //                             subject: 'CVMA New Post Link',
    //                             text: 'Hello' +  + ', Please Click on the link below to complete your registration: <a href="http://localhost:4200/#!/activate/' ,
    //                             html: 'Hello' +  + ', <br>Thank you for registering for CVMA. Please Click on the link below to complete your registration: <br><br> <a href="http://localhost:4200/#!/activate/' +  '">http://localhost:4200/activate</a>'
                                
    //                             };
                            
    //                             client.sendMail(email, function(err, info){
    //                                 if (err ){
    //                                 console.log(err);
    //                                 }
    //                                 else {
    //                                 console.log('Message sent: ' + info.response);
    //                                 }
    //                             });
    //                         });
    //                      res.json({ success: true, message: 'Post Uploaded'});
    //                 }
                
    //         })
        
    //     }   
    //  }
    // })
        
    // });
    //sends email after getting subscribers
    // businessRouter.put('/businessPost', function(req,res) {
    //     Subscribe.find({ }, function(err, subscribers) {
    //         if (err) throw err;
            
    //             if (err) {
    //                 console.log(err);
    //                 if (!subscribers) {
    //                     res.json ({ success: false, message: 'Emails not found'});
    //                 } else { 
    //                     res.json({ success: true, subscribers: subscribers, permission: mainUser.permission });
    //                 }
    //             } else {
    //                 var email = {
    //                     from: 'CVMA Staff, staff@CVMA.com',
    //                     to: subscribers.email,
    //                     subject: 'CVMA New Post Link',
    //                     text: 'Hello' +  + ', Please Click on the link below to complete your registration: <a href="http://localhost:4200/#!/activate/' ,
    //                     html: 'Hello' +  + ', <br>Thank you for registering for CVMA. Please Click on the link below to complete your registration: <br><br> <a href="http://localhost:4200/#!/activate/' +  '">http://localhost:4200/activate</a>'
                        
    //                     };
                    
    //                     client.sendMail(email, function(err, info){
    //                         if (err ){
    //                         console.log(err);
    //                         }
    //                         else {
    //                         console.log('Message sent: ' + info.response);
    //                         }
    //                     });


    //             }
            
    //     })
    // });
    
    // businessRouter.put('/newSub', function(req, res) {
    //     Subscribe.findOne({_id: req.params._id,}).exec(function(err, subscribe) {
    //         subscribe.email = req.body.email;
    //         console.log(subscribe)
    //         subscribe.email.push( arr[0]);
    //         if (req.body.email == null || req.body.email == '' ) {
    //             res.json({ success: false, message: 'Ensure Email is provided'});
        
    //             } else {
    //         //subscribe.save(function(err) {
    //             if (err) {
    //                 res.json({ success: false, message: err});
    //             } else {
    //                 res.json({ success: true, message: 'Subscription Successful'});
    //             }
    //        // })
    //         }
    //     })

        
    // })
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
        //.catch(next);
        // Subscribe.find({ },function(err, subscribe) {
        //     console.log(subscribe);
        // //     console.log(newSub);
        //     if (err) throw err;
            
      
        //     if (req.body.email == null || req.body.email == '' ) {
        //         res.json({ success: false, message: 'Ensure Email is provided'});

        //         } else {
                    
        //                 if (err) {
        //                     res.json({ success: false, message: err});
        //                 } else {
        //                     res.json({ success: true, message: 'Subscription Successful'});
        //                 }
        //             };
                
        //     // })  
        
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
    //EDIT
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