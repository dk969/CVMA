angular.module('emailController', ['userServices'])

    .controller('emailController', function($routeParams, User, $timeout, $location) {

        app = this;

        User.activateAccount($routeParams.token).then(function(data) {
            app.successMsg = false;
            app.errorMsg = false;
           
            if (data.data.success) {
                app.successMsg = data.data.message + '.... Redirecting';
                $timeout(function() {
                    $location.path('#!/login');
                }, 2000);
            } else {
                app.errorMsg = data.data.message + '.... Redirecting';
                $timeout(function() {
                    $location.path('#!/login');
                }, 2000);
            }
        }); 
    })

    .controller('resendController', function(User) {

        app = this;

        app.checkCredentials = function(loginData) {
            app.disabled = true;
            app.errorMsg = false;
            app.successMsg = false; 

            User.checkCredentials(loginData).then(function(data) {
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

    .controller('usernameController', function() {

    });