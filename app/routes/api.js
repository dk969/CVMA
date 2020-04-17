var User = require('../models/user');
var Business = require('../models/business');
var BusinessPost = require('../models/businessPost');
var Vehicle = require('../models/vehicle');
var Subscribe = require('../models/subscribe');
var jwt   = require('jsonwebtoken');
var secret = 'cvmaapp';
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

module.exports = function(router) {

    var options = {
    auth: {
        api_user: 'dking215',
        api_key: 'King1995!'
    }
    }

    var client = nodemailer.createTransport(sgTransport(options));

    
    //User registration route
    //http://localhost:4200/api/users
    router.post('/users', function(req,res){
        var user = User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.email    = req.body.email;
        user.name     = req.body.name;
        user.temporarytoken = jwt.sign({ username: user.username, email: user.email}, secret, { expiresIn: '24h' } );
    if(req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' 
    || req.body.name == null || req.body.name == '') {
            res.json({ success: false, message: "Ensure username, Email and Password were provided"});
    } else {
        user.save(function(err){
            if (err) {
                if (err.error != null) {
                    if (err.errors.name) {
                        res.json({ success: false, message: err.errors.name.message }); 
                    } else if (err.errors.email) {
                        res.json({ success: false, message: err.errors.email.message }); 
                    } else if (err.errors.username) {
                        res.json({ success: false, message: err.errors.username.message }); 
                    }  else if (err.errors.password) {
                        res.json({ success: false, message: err.errors.password.message }); 
                    } else {
                        res.json({ success: false, message: err });
                    }
                } else if (err.code == 11000) {
                    if (err.errmsg[61] == "u"){
                        res.json({ success: false, message: "Username or email already exists"});
                    } else if (err.errmsg[61] == "e") {
                        res.json({ success: false, message: "Email already used"});
                    }
                } else {
                    res.json({ success: false, message: err });
                } 

             } else {
                
                var email = {
                    from: 'CVMA Staff, staff@CVMA.com',
                    to: user.email,
                    subject: 'CVMA Activation Link',
                    text: 'Hello' + user.name + ', Thank you for registering for CVMA. Please Click on the link below to complete your registration: <a href="http://localhost:4200/#!/activate/' + user.temporarytoken,
                    html: 'Hello' + user.name + ', <br>Thank you for registering for CVMA. Please Click on the link below to complete your registration: <br><br> <a href="http://localhost:4200/#!/activate/' + user.temporarytoken + '">http://localhost:4200/activate</a>'
                    
                    };
                
                    client.sendMail(email, function(err, info){
                        if (err ){
                        console.log(error);
                        }
                        else {
                        console.log('Message sent: ' + info.response);
                        }
                    });


                res.json({success: true, message: 'Account registered! Please check email for activation link.'});
            }
        });
      }
        
    });

 
    router.post('/checkusername', function(req, res) {
        User.findOne({ username: req.body.username }).select('username').exec(function(err, user) {
            if (err) throw err;

        if (user) {
            res.json({ success: false, message: 'That username already exitsts'});
        } else {
            res.json({ success: true, message: 'Valid Username'});
        }
        });    
    });

    router.post('/checkemail', function(req, res) {
        User.findOne({ email: req.body.email }).select('email').exec(function(err, user) {
            if (err) throw err;

        if (user) {
            res.json({ success: false, message: 'That email already exitsts'});
        } else {
            res.json({ success: true, message: 'Valid email'});
        }
        });    
    });


    //User Login route
    //http://localhost:4200/api/authenticate
    router.post('/authenticate', function(req, res) {
        User.findOne({ username: req.body.username }).select('email username password active').exec(function(err, user) {
            if (err) throw err;

            if (!user) {
                res.json({ success: false, message: 'Could not authenticate user'});
            } else if (user) {
                if (req.body.password) {
                    var validPassword = user.comparePassword(req.body.password);
                } else {
                    res.json({ success: false, message: ' No password Provided'});
                }
                if (!validPassword) {
                    res.json({ success: false, message: ' Could not authenticate password' });
                } else if (!user.active) {
                    res.json({ success: false, message: 'Account has not yet been Activated. Please check your emails.', expired: true })
                } else {
                    var token = jwt.sign({ username: user.username, email: user.email}, secret, { expiresIn: '30m' } );
                    res.json({ success: true, message: 'User authenticated ', token: token }); 
                }
            }
        });
    });

    router.put('/activate/:token', function(req,res) {
        User.findOne({ temporarytoken: req.params.token }, function(err,user) {
            if (err) throw err;
            var token = req.params.token;
            jwt.verify(token, secret, function(err, decoded) {
                if(err) {
                    res.json({ success: false, message: 'Activation link has expired.'});
                } else  if (!user) {
                    res.json({ success: false, message: 'Activation link has expired.'} );
                } else {
                    user.temporarytoken = false;
                    user.active = true;
                    user.save(function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            var email = {
                                from: 'CVMA Staff, staff@CVMA.com',
                                to: user.email,
                                subject: 'CVMA Activation Successful',
                                text: 'Hello ' + user.name + ', Your Activation has been successful',
                                html: 'Hello ' + user.name + ', <br>Your Activation has been successful'
                                
                                };
                            
                                client.sendMail(email, function(err, info){
                                    if (err ){
                                    console.log(err);
                                    }
                                    else {
                                    console.log('Message sent: ' + info.response);
                                    }
                                });
                                 res.json({ success: true, message: 'Activation successful.'});
                        }
                    });

                }
            });
        });
    });

   
    router.post('/resend', function(req, res) {
        User.findOne({ username: req.body.username }).select('username password active').exec(function(err, user) {
            if (err) throw err;

            if (!user) {
                res.json({ success: false, message: 'Could not authenticate user' });
            } else if (user) {
                if (req.body.password) {
                    var validPassword = user.comparePassword(req.body.password);
                } else {
                    res.json({ success: false, message: ' No password Provided'});
                }
                if (!validPassword) {
                    res.json({ success: false, message: ' Could not authenticate password' });
                } else if (user.active){
                    res.json({ success: false, message: 'Account has already been Activated. Please check your emails.' })
                } else {
                    res.json({ success: true, user: user }); 
                }
            }
        });
    });

    router.put('/resend', function(req, res) {
        User.findOne({ username: req.body.username }).select('username name email temporarytoken').exec( function(err,user) {
            if (err) throw err;
            user.temporarytoken = jwt.sign({ username: user.username, email: user.email}, secret, { expiresIn: '24h' } );
            user.save(function(err) {
                if (err) {
                    console.log(err);
                } else {
                    var email = {
                        from: 'CVMA Staff, staff@CVMA.com',
                        to: user.email,
                        subject: 'CVMA Activation Link Request',
                        text: 'Hello ' + user.name + ', You recently requested a new account activation link. Please Click on the link below to complete your registration: <a href="http://localhost:4200/#!/activate/' + user.temporarytoken,
                        html: 'Hello ' + user.name + ', <br><br>You recently requested a new account activation link.  Please Click on the link below to complete your registration: <br><br> <a href="http://localhost:4200/#!/activate/' + user.temporarytoken + '">http://localhost:4200/activate</a>'
                        
                        };
                    
                        client.sendMail(email, function(err, info){
                            if (err ){
                            console.log(error); // if error in sending email
                            }
                            else {
                            console.log('Message sent: ' + info.response);
                            }
                        });
                        res.json({ success: true, message: ' Activation link has been sent to ' + user.email + '!'});

                    }   
            });

        })
    });

    router.get('/resetusername/:email', function(req, res) {
        User.findOne({ email: req.params.email }).select(' email name username').exec(function(err, user) {
            if (err) {
                res.json({ success: false, message: err }); // cannot connect
            } else {
                if (!req.params.email) {
                    res.json({ success: false, message: 'No email was provided'});
                } else {
                    if (!user) {
                        res.json({ success: false, message: 'Email not found' });
                    } else {
                        var email = { 
                            from: 'CVMA Staff, staff@CVMA.com',
                            to: user.email,
                            subject: 'CVMA Username Request',
                            text: 'Hello ' + user.name + ', You recently requested your username.  Please save it in your files :' + user.username,
                            html: 'Hello ' + user.name + ', <br><br>You recently requested your username.  Please save it in your files :' + user.username
                            
                            };
                        
                            client.sendMail(email, function(err, info){
                                if (err )console.log(error); // if error in sending email
                                
                            });
    
                        res.json({ success: true, message: 'Username has been sent to email' });
                    }

                }

               
            }
        });
    });

    router.put('/resetpassword', function(req, res) {
        User.findOne({ username: req.body.username }).select('username email resettoken name active').exec(function(err, user) {
            if (err) throw err;
            if (!user) {
                res.json({ success: false, message: 'Username was not found'});
            } else if (!user.active) {
                res.json({ success: false, message: ' Account has not yet been activated'});
            } else {
                user.resettoken = jwt.sign({ username: user.username, email: user.email}, secret, { expiresIn: '24h' } );
                user.save(function(err) {
                    if (err) {
                        res.json({ success: false, message: err});
                    } else {
                        var email = { 
                            from: 'CVMA Staff, staff@CVMA.com',
                            to: user.email,
                            subject: 'CVMA Password Reset Request',
                            text: 'Hello ' + user.name + ', You recently requested a password reset link. Please click on the link below to reset you password: http://localhost:4200/reset/' + user.resettoken,
                            html: 'Hello ' + user.name + ', <br><br>You recently requested a password reset link. Please click on the link below to reset you password:br><br> <a href="http://localhost:4200/#!/reset/' + user.resettoken + '">http://localhost:4200/reset</a>'
                            
                            };
                        
                            client.sendMail(email, function(err, info){
                                if (err )console.log(error); // if error in sending email
                                
                            });

                        res.json({ success: true, message: 'Please check your email for password reset link'});
                    }
                });
            }
        });

    });

    router.get('/resetpassword/:token', function(req, res) {
        User.findOne({ resettoken: req.params.token }).select().exec(function(err, user) {
            if (err) throw err;

            var token = req.params.token;
             //verify token
             jwt.verify(token, secret, function(err, decoded) {
                if(err) {
                    res.json({ success: false, message: 'Password link has expired'});
                } else {
                    if (!user) {
                        res.json({ success: false, message: 'Password link has expired'})
                    } else {
                        res.json({ success: true, user: user });
                    }
                }
            });
             
        });

    });

    router.put('/savepassword', function(req, res) {
        User.findOne({username: req.body.username }).select('username name password resettoken email').exec(function(err, user) {
            if (err) throw err;
            if (req.body.password == null || req.body.password == '') {
                res.json({ success: false, message: 'Password not provided'});
            } else {
                user.password = req.body.password;
                user.resettoken = false;
                user.save(function(err) {
                    if (err) {
                        res.json({ success: false, message: err});
                    } else {

                        var email = { 
                            from: 'CVMA Staff, staff@CVMA.com',
                            to: user.email,
                            subject: 'CVMA Password Reset',
                            text: 'Hello ' + user.name + ', This email is to notify you that you password for CVMA has now been reset.',
                            html: 'Hello ' + user.name + ', <br><br>This email is to notify you that you password for CVMA has now been reset.'
                            
                            };
                        
                            client.sendMail(email, function(err, info){
                                if (err )console.log(error); // if error in sending email
                                
                            });
                        res.json({ success: true, message: 'Password has been reset.'})
                    }

                });
                
            }
            
            
        });
    });


    //Middleware for routes, checks for token
    router.use(function(req, res, next) {

        var token = req.body.token || req.body.query || req.headers['x-access-token'];

        if (token) {
            //verify token
            jwt.verify(token, secret, function(err, decoded) {
                if(err) {
                    res.json({ success: false, message: 'invalid token'});
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.json({ success: false, message:'token not provided'});
        }
    });
    //gets current user
    router.get('/currentUser', function (req, res) {
        res.send(req.decoded);
        
    });

    router.get('/renewToken/:username', function(req, res) {
        User.findOne({ username: req.params.username }).select().exec(function(err, user) {
            if (err) throw err;
            if(!user) {
                res.json({ success: false, message: 'No user found.'});

            } else {
                var newToken = jwt.sign({ username: user.username, email: user.email}, secret, { expiresIn: '24h' } );
                res.json({ success: true, token: newToken }); 
            }
        });
    });

    router.get('/permission', function(req, res) {
        User.findOne({ username: req.decoded.username}, function(err, user) {
            if (err) throw err;
            if(!user) {
                res.json({ success: false, message: 'No users were found'});
            } else {
                res.json({ success: true, permission: user.permission });
            }
        });
    });

    router.get('/management', function(req,res) {
        User.find({}, function(err, users) {
            if (err) throw err;
            User.findOne({ username: req.decoded.username }, function(err, mainUser) {
                if (err) throw err;
                if (!mainUser) {
                    res.json({ success: false, message: ' No User found'});
                } else {
                    if (mainUser.permission ==='admin' || mainUser.permission === 'moderator') {
                        if (!users) {
                            res.json ({ success: false, message: 'Users not found'});
                        } else { 
                            res.json({ success: true, users: users, permission: mainUser.permission });
                        }


                    } else {
                        res.json({ success: false, message: 'Insufficient Permission'});
                    }
                }
            })
        });
    });


    router.delete('/management/:username', function(req, res) {
        var deletedUser = req.params.username;
        User.findOne({ username: req.decoded.username}, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser) {
                res.json({ success: false, message: 'No user found'});
            } else {
                if (mainUser.permission !== 'admin') {
                    res.json({ success: false, message: 'Insufficant Permission'});
                } else {
                    User.findOneAndRemove({ username: deletedUser }, function(err, user) {
                        if (err) throw err;
                        res.json({success: true, });
                    });
                }
            }
        });
    });
    router.get('/user/:username', function(req,res) {
        var user = req.params.username;
        User.findOne({username: req.decoded.username}, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser) {
                res.json({ success: false, message: 'No user found'});
            } else {
                User.findOne({ username: user}, function(err,user) {
                        if (err) throw err;
                        if (!user) {
                            res.json({ success: false, message: 'No user found'});
                        } else {
                            res.json({ success: true, user: user});
                        }
                    });
                
            }
        });
    });
    router.get('/edit/:id', function(req,res) {
        var editUser = req.params.id;
        User.findOne({username: req.decoded.username}, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser) {
                res.json({ success: false, message: 'No user found'});
            } else {
                if ( mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                    User.findOne({ _id: editUser}, function(err,user) {
                        if (err) throw err;
                        if (!user) {
                            res.json({ success: false, message: 'No user found'});
                        } else {
                            res.json({ success: true, user: user});
                        }
                    });
                } else {
                    res.json({ success: false, message: 'Insufficient Permission'});
                }
            }
        });
    });
    router.put('/edit', function(req,res) {
        var editUser = req.body._id;
        if (req.body.name) var newName = req.body.name;
        if (req.body.username) var newUsername = req.body.username;
        if (req.body.email) var newEmail = req.body.email;
        if (req.body.permission) var newPermission = req.body.permission;
        User.findOne({username: req.decoded.username }, function(err, mainUser) {
            if (err) throw err;
            if(!mainUser) {
                res.json({ success: false, message: " No user found"});
            } else { 
                if (newName) {
                    if ( mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        User.findOne({ _id: editUser}, function(err, user) {
                            if (err) throw err;
                            if (!user) {
                                res.json({ success: false, message: 'No user found'});
                            } else {
                                user.name = newName;
                                user.save(function(err) {
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
                if (newUsername) {
                    if ( mainUser.permission === 'admin' || mainUser.permission === 'moderator') { 
                        User.findOne({ _id: editUser}, function(err, user) {
                            if (err) throw err;
                            if (!user) {
                                res.json({ success: false, message: 'No user found'});
                            } else {
                                user.username = newUsername;
                                user.save(function(err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        res.json({ success: true, message: "Username has been updated."})
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: 'Insufficient Permission'});
                    }
                }
                if (newEmail) {
                    if ( mainUser.permission === 'admin' || mainUser.permission === 'moderator') { 
                        User.findOne({ _id: editUser}, function(err, user) {
                            if (err) throw err;
                            if (!user) {
                                res.json({ success: false, message: 'No user found'});
                            } else {
                                user.email = newEmail;
                                user.save(function(err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        res.json({ success: true, message: "Email  has been updated."})
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: 'Insufficient Permission'});
                    }
                }// only allows you to change the permissions of people who are equal or lower than you
                if (newPermission) {
                    if ( mainUser.permission === 'admin' || mainUser.permission === 'moderator') { 
                        User.findOne({ _id: editUser}, function(err, user) {
                            if (err) throw err;
                            if (!user) {
                                res.json({ success: false, message: 'No user found'});
                            } else {
                                if (newPermission === 'user') {
                                    if (user.permission === 'admin') {
                                        if (mainUser.permission !== ' admin') {
                                            res.json({ success: false, message: 'Insufficient permission, Only admin has authroisation to change permissions'});
                                        } else {
                                            user.permission = newPermission;
                                            user.save(function(err) {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                    res.json({ success: true, message: ' Permission updated'})
                                                }
                                            });
                                        }
                                    } else {
                                        user.permission = newPermission;
                                        user.save(function(err) {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                res.json({ success: true, message: ' Permission updated'})
                                            }
                                        });
                                    }
                                }
                                if (newPermission === 'moderator') {
                                    if (user.permission === ' admin') {
                                        if (mainUser.permission !== 'admin') {
                                            res.json({ success: false, message: 'Insufficient permission, Only admin has authroisation to change permissions'});
                                        } else {
                                            user.permission = newPermission;
                                            user.save(function(err) {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                    res.json({ success: true, message: ' Permission updated'})
                                                }
                                            });

                                        }
                                    } else  {
                                        user.permission = newPermission;
                                        user.save(function(err) {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                res.json({ success: true, message: ' Permission updated'})
                                            }
                                        });
                                    }
                                }
                                if (newPermission === 'admin') {
                                    if (mainUser.permission === 'admin') {
                                        user.permission = newPermission;
                                        user.save(function(err) {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                res.json({ success: true, message: ' Permission updated'})
                                            }
                                        });
                                    } else {
                                        res.json({ success: false, message: 'Insufficient permission, Only admin has authroisation to change permissions'});
                                    }
                                } 
                                     
                                
                            }
                        });
                    } else {
                        res.json({ success: false, message: 'Insufficient Permission'});
                    }
                }
            }
        })
    });
    router.put('/upgrade', function(req,res) {
        var upgradeUser = req.body._id;
        if (req.body.permission) var newPermission = req.body.permission;
        User.findOne({username: req.decoded.username }, function(err, mainUser) {
            if (err) throw err;
            if(!mainUser) {
                res.json({ success: false, message: " No user found"});
            } else { 
                if (newPermission) {
                    
                        User.findOne({ _id: upgradeUser}, function(err, user) {
                            if (err) throw err;
                            if (!user) {
                                res.json({ success: false, message: 'No user found'});
                            } else {
                                if (newPermission === 'moderator') {
                                            user.permission = newPermission;
                                            user.save(function(err) {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                    res.json({ success: true, message: ' Permission updated'})
                                                }
                                            });
                                        } 
                                     
                                
                                    }
                                });
                    
                }
            }
        })
    });

     //Business posted User as Author 
    router.post('/business', function(req,res) {
        var business = Business();
        User.find({ username: req.decoded.username}, function(err, mainUser) {
            console.log(mainUser.username);
            if (err) throw err;
            if(!mainUser) {
                res.json({ success: false, message: " No user found"});
            } else { 
                 User.findOne({ _id: mainUser}, function(err, user) {
                     console.log(user);
                    if (err) throw err;
                    if (!user) {
                        res.json({ success: false, message: 'No user found'});
                    } else {
                        console.log(user._id);
                        business.business_name = req.body.business_name;
                        business.business_type = req.body.business_type;
                        business.business_address = req.body.business_address;
                        business.business_postcode = req.body.business_postcode;
                        business.website = req.body.website;
                        business.business_email = req.body.business_email;
                        business.business_contact = req.body.business_contact;
                        business.specialization = req.body.specialization;
                        business.author = {
                            id: user._id,
                            username: user.username
                        }
                if (req.body.business_name == null || req.body.business_name == '' || req.body.business_type == null || req.body.business_type == '' || req.body.business_address == null || req.body.business_address == '' || req.body.business_postcode == null || req.body.business_postcode == ''
                || req.body.website == null || req.body.website == '' || req.body.business_email == null || req.body.business_email == '' || req.body.business_contact == null || req.body.business_contact == '' || req.body.specialization == null || req.body.specialization == '') {
                    res.json({ success: false, message: 'Ensure Business details are provided'});
                    } else {
                        business.save(function(err) {
                            if (err) {
                                if (err.errors != null) {
                                    if (err.errors.business_name) {
                                        res.json({ success: false, message: err.errors.business_name.message});
                                    } else if (err.errors.business_type) {
                                        res.json({ success: false, message: err.errors.business_type.message});
                                    } else if (err.errors.business_address) {
                                        res.json({ success: false, message: err.errors.business_address.message});
                                    } else if (err.errors.business_postcode) {
                                        res.json({ success: false, message: err.errors.business_postcode.message});
                                    } else if (err.errors.website) {
                                        res.json({ success: false, message: err.errors.website.message});
                                    } else if (err.errors.business_email) {
                                        res.json({ success: false, message: err.errors.business_email.message});
                                    } else if (err.errors.business_contact) {
                                        res.json({ success: false, message: err.errors.business_contact.message});
                                    } else {
                                        res.json({success: false, message: err});
                                    }
                                }else if(err) {
                                    res.json({success:false, message: err});
                                }

                            } else {
                                res.json({ success: true, message: 'Business Posted', id: user._id});
                            }
                         });
                         }   
                  }
                })
             
             }
         });
    

    });
        //BusinessPost posted User as Author 

            router.post('/businessPost', function(req,res) {
                var businessPost = BusinessPost();
                User.find({ username: req.decoded.username}, function(err, mainUser) {
                    console.log(mainUser.username);
                    if (err) throw err;
                    if(!mainUser) {
                        res.json({ success: false, message: " No user found"});
                    } else { 
                        User.findOne({ _id: mainUser}, function(err, user) {
                            console.log(user);
                            if (err) throw err;
                            if (!user) {
                                res.json({ success: false, message: 'No user found'});
                            } else {
                                businessPost.business_title = req.body.business_title;
                                businessPost.business_name = req.body.business_name;
                                businessPost.business_type = req.body.business_type;
                                businessPost.website = req.body.website;
                                businessPost.specialization = req.body.specialization;
                                businessPost.post = req.body.post;
                                businessPost.author = {
                                    id: user._id,
                                    username: user.username
                            }
            
                    if (req.body.business_title == null || req.body.business_title == '' || req.body.business_name == null || req.body.business_name == '' || req.body.business_type == null || req.body.business_type == '' || 
                    req.body.website == null || req.body.website == '' || req.body.specialization == null || req.body.specialization == ''|| req.body.post == null || req.body.post == '' ) {
                        res.json({ success: false, message: 'Ensure the offer details are provided'});
                        
                    } else {
                        businessPost.save(function(err) {           
                                if (err) {
                                    if (err.errors != null) {
                                        if (err.errors.business_title) {
                                            res.json({ success: false, message: err.errors.business_title.message});
                                        } else if (err.errors.business_name) {
                                            res.json({ success: false, message: err.errors.business_name.message});
                                        } else if (err.errors.business_type) {
                                            res.json({ success: false, message: err.errors.business_type.message});
                                        } else if (err.errors.website) {
                                            res.json({ success: false, message: err.errors.website.message});
                                        } else if (err.errors.specialization) {
                                            res.json({ success: false, message: err.errors.specialization.message});
                                        } else if (err.errors.post) {
                                            res.json({ success: false, message: err.errors.post.message});
                                        } else {
                                            res.json({success: false, message: err});
                                        }
                                    }else if(err) {
                                        res.json({success:false, message: err});
                                    }
                                } else {
                                Subscribe.find(req.params, function(err, subscribers) {
                                    console.log(subscribers);
                                    
                                    if (err) throw err;
                                    Subscribe.findOne({ _id: subscribers}, function(err, sub) {
                                        console.log(sub);
                                        if (err) throw err;
                                    var email = {
                                        from: 'CVMA Staff, staff@CVMA.com',
                                        to: sub.email,
                                        subject: 'CVMA New Post Link',
                                        text: 'Hello' +  + ', Please Click on the link below to complete your registration: <a href="http://localhost:4200/#!/activate/' ,
                                        html: 'Hello' +  + ', <br>Thank you for registering for CVMA. Please Click on the link below to complete your registration: <br><br> <a href="http://localhost:4200/#!/activate/' +  '">http://localhost:4200/activate</a>'
                                        
                                        };
                                    
                                        client.sendMail(email, function(err, info){
                                            if (err ){
                                            console.log(err);
                                            }
                                            else {
                                            console.log('Message sent: ' + info.response);
                                            }
                                        });
                                    });
                                    res.json({ success: true, message: 'Post Uploaded'});
                                    })
                                }
                            
                             });
                            
                            }   
                         }
                    })
                }
            });
        });

        router.post('/vehicle', function(req,res) {
            var vehicle = Vehicle();
            User.find({ username: req.decoded.username}, function(err, mainUser) {
                if (err) throw err;
                if(!mainUser) {
                    res.json({ success: false, message: " No user found"});
                } else { 
                     User.findOne({ _id: mainUser}, function(err, user) {
                         console.log(user);
                        if (err) throw err;
                        if (!user) {
                            res.json({ success: false, message: 'No user found'});
                        } else {
                        vehicle.vehicle_make = req.body.vehicle_make;
                        vehicle.vehicle_model = req.body.vehicle_model;
                        vehicle.year = req.body.year;
                        vehicle.engine_size = req.body.engine_size;
                        vehicle.colour = req.body.colour;
                        vehicle.MOT_date = req.body.MOT_date;
                        vehicle.tax_date = req.body.tax_date;
                        vehicle.service_date = req.body.service_date;
                        vehicle.author = {
                            id: user._id,
                            username: user.username
                        }
    
                if (req.body.vehicle_make == null || req.body.vehicle_make == '' || req.body.vehicle_model == null || req.body.vehicle_model == '' || req.body.year == null || req.body.year == '' || req.body.engine_size == null || req.body.engine_size == ''
                || req.body.colour == null || req.body.colour == '' || req.body.MOT_date == null || req.body.MOT_date == '' || req.body.tax_date == null || req.body.tax_date == '' || req.body.service_date == null || req.body.service_date == ''
                ) {
                    res.json({ success: false, message: 'Ensure all vehicle details are provided'});
            
                    } else {
                        vehicle.save(function(err) {
                            if (err) {
                                if (err.errors != null) {
                                    if (err.errors.vehicle_make) {
                                        res.json({ success: false, message: err.errors.vehicle_make.message});
                                    } else if (err.errors.vehicle_model) {
                                        res.json({ success: false, message: err.errors.vehicle_model.message});
                                    } else if (err.errors.year) {
                                        res.json({ success: false, message: err.errors.year.message});
                                    } else if (err.errors.engine_size) {
                                        res.json({ success: false, message: err.errors.engine_size.message});
                                    } else if (err.errors.colour) {
                                        res.json({ success: false, message: err.errors.colour.message});
                                    }  else {
                                        res.json({success: false, message: err});
                                    }
                                }else if(err) {
                                    res.json({success:false, message: err});
                                }
                            } else {
                                res.json({ success: true, message: 'Vehicle Posted'});
                            }
                        });
                       }   
                    }
               })
           }
       });
   });
   router.get('/vehicle', function(req,res) {
    User.find({ username: req.decoded.username}, function(err, mainUser) {
        if (err) throw err;
        if(!mainUser) {
            res.json({ success: false, message: " No user found"});
        } else { 
             User.findOne({ _id: mainUser}, function(err, user) {
                 console.log(user);
                if (err) throw err;
                if (!user) {
                    res.json({ success: false, message: 'No user found'});
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
                })
            }
        });
        }
    })

});
router.get('/business', function(req,res) {
    User.find({ username: req.decoded.username}, function(err, mainUser) {
        if (err) throw err;
        if(!mainUser) {
            res.json({ success: false, message: " No user found"});
        } else { 
             User.findOne({ _id: mainUser}, function(err, user) {
                 console.log(user);
                if (err) throw err;
                if (!user) {
                    res.json({ success: false, message: 'No user found'});
                } else {
                    Business.find({'author.id': user._id}, function(err, companies) {
                        if (err) throw err;
                    if (user.permission ==='admin' || user.permission === 'moderator' || user.permission === 'user') {
                        if (!companies) {
                            res.json ({ success: false, message: 'Vehicles not found'});
                        } else { 
                            res.json({ success: true, companies: companies, permission: user.permission, id: user._id });
                        }


                    } else {
                        res.json({ success: false, message: 'Insufficient Permission'});
                    }
                })
            }
        });
        }
    })

});
// find all businesses
router.get('/businessAll', function(req,res) {
    User.find({ username: req.decoded.username}, function(err, mainUser) {
        if (err) throw err;
        if(!mainUser) {
            res.json({ success: false, message: " No user found"});
        } else { 
             User.findOne({ _id: mainUser}, function(err, user) {
                 console.log(user);
                if (err) throw err;
                if (!user) {
                    res.json({ success: false, message: 'No user found'});
                } else {
                    Business.find({ }, function(err, companies) {
                        if (err) throw err;
                    if (user.permission ==='admin' || user.permission === 'moderator' || user.permission === 'user') {
                        if (!companies) {
                            res.json ({ success: false, message: 'Vehicles not found'});
                        } else { 
                            res.json({ success: true, companies: companies, permission: user.permission, id: user._id });
                        }


                    } else {
                        res.json({ success: false, message: 'Insufficient Permission'});
                    }
                })
            }
        });
        }
    })

});
router.get('/businessPost', function(req,res) {
    User.find({ username: req.decoded.username}, function(err, mainUser) {
        if (err) throw err;
        if(!mainUser) {
            res.json({ success: false, message: " No user found"});
        } else { 
             User.findOne({ _id: mainUser}, function(err, user) {
                 console.log(user);
                if (err) throw err;
                if (!user) {
                    res.json({ success: false, message: 'No user found'});
                } else {
                    BusinessPost.find({'author.id': user._id}, function(err, posts) {
                        if (err) throw err;
                    if (user.permission ==='admin' || user.permission === 'moderator' || user.permission === 'user') {
                        if (!posts) {
                            res.json ({ success: false, message: 'Post not found'});
                        } else { 
                            
                            res.json({ success: true, posts: posts, permission: user.permission, id: user._id });
                        }


                    } else {
                        res.json({ success: false, message: 'Insufficient Permission'});
                    }
                })
            }
        });
        }
    })

});
router.get('/businessPosts', function(req,res) {
    User.find({ username: req.decoded.username}, function(err, mainUser) {
        if (err) throw err;
        if(!mainUser) {
            res.json({ success: false, message: " No user found"});
        } else { 
             User.findOne({ _id: mainUser}, function(err, user) {
                 console.log(user);
                if (err) throw err;
                if (!user) {
                    res.json({ success: false, message: 'No user found'});
                } else {
                    BusinessPost.find({}, function(err, posts) {
                        if (err) throw err;
                    if (user.permission ==='admin' || user.permission === 'moderator' || user.permission === 'user') {
                        if (!posts) {
                            res.json ({ success: false, message: 'Vehicles not found'});
                        } else { 
                            res.json({ success: true, posts: posts, permission: user.permission, id: user._id });
                        }


                    } else {
                        res.json({ success: false, message: 'Insufficient Permission'});
                    }
                })
            }
        });
        }
    })

});

    return router;

}