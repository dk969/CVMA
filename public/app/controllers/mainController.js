

angular.module('mainController', ['authServices', 'userServices'])

.controller('mainController', function(Auth, $timeout, $location, $rootScope, $window, $interval, $route, User, AuthToken) {
   var app = this;
    
    //remove console logs ONCE complete
    
    app.loadme = false;// allowing the html to catch up getting all data needed

    app.checkSession =function() {
        if (Auth.isLoggedIn()) {
            app.checkingSession = true;
            var interval = $interval(function() {
                var token = $window.localStorage.getItem('token');
                if (token == null) {
                    $interval.cancel(interval);
                } else {
                    //converts token to timestamp
                    self.parseJwt = function(token) {
                        var base64Url = token.split('.')[1];
                        var base64 = base64Url.replace('-', '+').replace('_', '/');
                        return JSON.parse($window.atob(base64));
                    }
                    var expireTime = self.parseJwt(token);
                    var timeStamp = Math.floor(Date.now() / 1000);
                    // console.log(expireTime.exp);
                    // console.log(timeStamp);
                    var timeCheck = expireTime.exp - timeStamp;
                    //console.log('timecheck: ' + timeCheck);
                    if (timeCheck <= 25) {
                        // console.log('token has expired');
                        showModal(1);
                        $interval.cancel(interval);
                    } else {
                        // console.log('token not yet expired');
                    }
                }
            }, 2000);
        }
    };

    app.checkSession();

    var showModal = function(option){
        app.choiceMade = false;
        app.modalHeader = undefined;
        app.modalBody = undefined;
        app.hideButton = false;

        
        if (option == 1) {
            app.modalHeader = 'Timeout Warning';
            app.modalBody = 'Your session will expire in 5 minutes. Would you like to renew your session?';
            $("#myModal").modal({ backdrop: "static" });
        } else if (option == 2) {
            app.hideButton = true;
            app.modalHeader = 'Loggin Out!';
            $("#myModal").modal({ backdrop: "static" });
            $timeout(function() {
                Auth.logout();
                $location.path('/logout');
                hideModal();
                $route.reload();
            }, 3000);
        }
        $timeout(function() {
            if (!app.choiceMade) {
                hideModal();
            }
        }, 4000);

     
    };

    app.renewSession = function() {
        app.choiceMade = true;
        User.renewSession(app.username).then(function(data) {
            if (data.data.success) {
                AuthToken.setToken(data.data.token);
                app.checkSession();
            } else {
                app.modalBody = data.data.message;
            }
        });        
        hideModal();
    };

    app.endSession = function() {
        app.choiceMade = true;
        hideModal();
        $timeout(function() {
            showModal(2);
        }, 1000);
    };

    var hideModal = function(){
        $("#myModal").modal('hide');
    };

    $rootScope.$on('$routeChangeStart', function() {
        if (!app.checkSession) app.checkSession();



        if (Auth.isLoggedIn()) {
            console.log('Success: User is Logged in.');
            app.isLoggedIn = true;

            Auth.getUser().then(function(data) { 
                
                
                app.username = data.data.username;
                app.useremail = data.data.email;
                

                User.getPermission().then(function(data){
                    
                    if (data.data.permission === 'admin' || data.data.permission == 'moderator') {
                        app.authorized = true;
                        app.loadme = true;// Shows main HTML now that data has been collected by angularJS
                        if (data.data.permission === 'admin') {
                           app.manage = true
                            app.authorized = true;
                        } 
                    } else {
                        app.loadme = true;
                        
                    }
                });
            });
        } else {
            console.log('Failure: User is NOT logged in');
            app.isLoggedIn = false;
            app.username = '';
            app.loadme = true;
        }
        if ($location.hash() == '_=_')$location.hash(null);
    });

        this.facebook = function() {
            app.disable = true;
            $window.location = $window.location.protocol +'//' +$window.location.host + '/auth/facebook';
        };

        this.google = function() {
            app.disable = true;
            $window.location = $window.location.protocol +'//' +$window.location.host + '/auth/google';
        };
  

   this.doLogin = function(loginData) {
        app.loading = true;
        app.errorMsg =false;
        app.expired = false;
        app.disable = false;
        
        Auth.login(app.loginData).then(function(data) {
            
             if (data.data.success) {
                app.loading = false;
                //redirects to home page and creates success message
                app.successMsg = data.data.message + ' ...Redirecting';
                $timeout(function() {
                    $location.path('/');
                    app.loginData = '';
                    app.successMsg = false;
                    app.disabled = false;
                    app.checkSession();
                }, 2000);

             } else {
                if (data.data.expired) {
                     //creates an error message
                    app.expired = true;
                    app.loading = false;
                    app.errorMsg = data.data.message;
                } else {
                     //creates an error message
                    app.loading = false;
                    app.disable = true;
                    app.errorMsg = data.data.message;
                }
             }
        });
    };
    //Redirects you to business upgrade 
    app.busLogin = function(loginData) {
        app.loading = true;
        app.errorMsg =false;
        app.expired = false;
        app.disable = false;

        
        
        Auth.login(app.loginData).then(function(data) {
            
             if (data.data.success) {
                 
                app.loading = false;
                //redirects to home page and creates success message
                app.successMsg = data.data.message + ' ...Redirecting';
                $timeout(function() {
                    
                    $location.path('/redirect');
                    app.loginData = '';
                    app.successMsg = false;
                    app.disabled = false;
                    app.checkSession();
                }, 2000);

             } else {
                if (data.data.expired) {
                     //creates an error message
                    app.expired = true;
                    app.loading = false;
                    app.errorMsg = data.data.message;
                } else {
                     //creates an error message
                    app.loading = false;
                    app.disable = true;
                    app.errorMsg = data.data.message;
                }
             }
        });
    };
    // need to fix  vid 9/22 around 18 mins
    app.logout = function() {
        showModal(2);

    };
});
