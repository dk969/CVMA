var User = require('../models/user');
var Business = require('../models/business');
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
        res.send(req.decoded.name);
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
    router.get('/user/:id', function(req,res) {
        var user = req.params.id;
        User.findOne({username: req.decoded.username}, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser) {
                res.json({ success: false, message: 'No user found'});
            } else {
                if ( mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                    User.findOne({ _id: user}, function(err,user) {
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
        var editUser = req.body._id;
        if (req.body.permission) var newPermission = req.body.permission;
        User.findOne({username: req.decoded.username }, function(err, mainUser) {
            if (err) throw err;
            if(!mainUser) {
                res.json({ success: false, message: " No user found"});
            } else { 
                if (newPermission) {
                    
                        User.findOne({ _id: editUser}, function(err, user) {
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

    
    return router;

}