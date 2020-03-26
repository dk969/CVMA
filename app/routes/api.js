var User = require('../models/user');
var jwt   = require('jsonwebtoken');
var secret = 'cvmaapp';

module.exports = function(router) {
    //User registration route
    //http://localhost:4200/api/users
    router.post('/users', function(req,res){
        var user = User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.email    = req.body.email;
        user.name     = req.body.name;
    if(req.body.username == null || req.body.username == ''||req.body.password == null || req.body.password == '' 
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
                res.json({success: true, message: 'user created'});
            }
        });
      }
        
    });
    //User Login route
    //http://localhost:4200/api/authenticate
    router.post('/authenticate', function(req, res) {
        User.findOne({ username: req.body.username }).select('email username password').exec(function(err, user) {
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
                } else {
                    var token = jwt.sign({ username: user.username, email: user.email}, secret, { expiresIn: '24h' } );
                    res.json({ success: true, message: 'User authenticated ', token: token }); 
                }
            }
        });
    });
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

    router.post('/currentUser', function (req, res) {
        res.send(req.decoded);
    });

    return router;

}