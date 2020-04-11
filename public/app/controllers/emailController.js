angular.module('emailController', ['userServices'])

    .controller('emailController', function($routeParams, User, $timeout, $location) {

        var app = this;

        User.activateAccount($routeParams.token).then(function(data) {
            app.successMsg = false;
            app.errorMsg = false;
           
            if (data.data.success) {
                app.successMsg = data.data.message + '.... Redirecting';
                $timeout(function() {
                    $location.path('/login');
                }, 10000);
            } else {
                app.errorMsg = data.data.message + '.... Redirecting';
                $timeout(function() {
                    $location.path('/login');
                }, 10000);
            }
        }); 

    
        



    })

    .controller('resendController', function(User) {

        app = this;

        app.checkCredentials = function(loginData) {
            app.disabled = true;
            app.errorMsg = false;
            app.successMsg = false; 

            User.checkCredentials(app.loginData).then(function(data) {
                console.log(data);
                if(data.data.success) {
                    User.resendLink(app.loginData).then(function(data) {
                        if (data.data.success) {
                            app.successMsg = data.data.message;
                        }
                    });
                   // console.log(data);
                } else {
                    app.disabled = false;
                    app.errorMsg = data.data.message;
                }
                
            })

        };
        

    })

    .controller('usernameController', function(User) {
        app = this;
        
        app.sendUsername = function(userData, valid) {
            app.errorMsg = false;
            app.loading = true;
            app.disabled = true;

            if (valid) {
                User.sendUsername(app.userData.email).then(function(data) {
                    app.loading = false;
                    
                    if (data.data.success) {
                        app.successMsg = data.data.message;
                    } else {
                        app.disabled = false;
                        app.errorMsg = data.data.message;
                    }
                });
            } else {
                app.disabled = false;
                app.loading = false;
                app.errorMsg = "Please enter valid email!";
            }
            

        };
    })

    .controller('passwordController', function(User) {
        app = this;
        
        app.sendPassword = function(resetData, valid) {
            app.errorMsg = false;
            app.loading = true;
            app.disabled = true;

            if (valid) {

                User.sendPassword(app.resetData).then(function(data) {
                    app.loading = false;
                    
                    if (data.data.success) {
                        app.successMsg = data.data.message;
                    } else {
                        app.disabled = false;
                        app.errorMsg = data.data.message;
                    }
                });
            } else {
                app.disabled = false;
                app.loading = false;
                app.errorMsg = "Please enter valid Username!";
            }
            

        };
    })

    .controller('resetController', function(User, $routeParams, $scope, $timeout, $location) {

        app = this;
        app.hide = true;
        User.resetUser($routeParams.token).then(function(data) {
            if (data.data.success) {
                app.hide = false;
                app.successMsg = 'Please enter a new password';
                $scope.username = data.data.user.username;

            } else {
                app.errorMsg = data.data.message;
            }
        });

        app.savePassword = function(regData, valid, confirmed) {
            app.errorMsg = false;
            app.disabled = true;
            app.loading = false;
            

            if (valid && confirmed) {
                app.regData.username = $scope.username;
                User.savePassword(app.regData).then(function(data) {
                    app.loading = false;
                    if (data.data.success) {
                        app.successMsg = data.data.message + ' ..Redirecting';
                        $timeout(function() {
                            $location.path('#!/login');
                        }, 2000)
                    } else {
                        app.loading = false;
                        app.disabled = false;
                        app.errorMsg = data.data.message;
                    }
                });
            } else {
                app.loading = false;
                app.disabled = false;
                app.errorMsg ='Please ensure form is filled out properly';
            }
        }   

    });
    

