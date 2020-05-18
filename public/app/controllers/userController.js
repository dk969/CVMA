angular.module('userController', ['userServices'])

//Registeration controller, ensureing the form is filled out correctly 

.controller('regController', function($http, $location, $timeout, User) {

    var app = this;

    this.regUser = function(regData, valid, confirmed) {
        app.disable = true;
        app.loading = true;
        app.errorMsg =false;
        
        if(valid) {
            User.create(app.regData).then(function(data) {
                if (data.data.success) {
                   app.loading = false;
                   app.successMsg = data.data.message + ' ...Redirecting';
                   $timeout(function() {
                       $location.path('/login');
                   }, 2000);
   
                } else {
                   app.loading = false;
                   app.disable = false;
                   app.errorMsg = data.data.message;
                }
           });
        } else {
            app.disable = false;
            app.loading = false;
            app.errorMsg = "Please ensure the form is filled out correctly";
        }
    };
    //Checks the username by making sure it hasn't already been taken
    this.checkUsername = function(regData) {
        app.checkUsername = true;
        app.usernameMsg = false;
        app.usernameInvalid = false;
        User.checkUsername(app.regData).then(function(data) {
            if (data.data.success) {
                app.checkUsername = false;
                app.usernameInvalid = false;
                app.usernameMsg = data.data.message;
            } else {
                app.checkUsername = false;
                app.usernameInvalid = true;
                app.usernameMsg = data.data.message;
            }
        });
    }
    //Checks the email by making sure it hasn't already been taken
    this.checkEmail = function(regData) {
        app.checkEmail = true;
        app.emailMsg = false;
        app.emailInvalid = false;
        User.checkEmail(app.regData).then(function(data) {
            if (data.data.success) {
                app.checkEmail = false;
                app.emailInvalid = false;
                app.emailMsg = data.data.message;
            } else {
                app.checkEmail = false;
                app.emailInvalid = true;
                app.emailMsg = data.data.message;
            }
        });
    }


})
//Checks the users password when they register or update
.directive('match', function(){
    return {
        restrict: 'A',
        controller:function($scope) {

            $scope.confirmed = false;
            $scope.doConfirm = function(values) {
               values.forEach(function(ele) {

                 if ($scope.confirm == ele) {
                    $scope.confirmed = true;
                 } else {
                    $scope.confirmed = false;
                 }
                   
               });
            }
            
        },
        link: function(scope, element, attrs) {
            attrs.$observe('match', function() {
                scope.matches = JSON.parse(attrs.match);
                scope.doConfirm(scope.matches);
            });
            scope.$watch('confirm', function() {
                scope.matches = JSON.parse(attrs.match);
                scope.doConfirm(scope.matches);
            });
        }
    };
})

// Social media controllers

.controller('facebookController', function($routeParams, Auth, $location, $window) {
    
    var app = this;
    app.errorMsg = false;
    app.expired = false;
    app.disable = true;

    if($window.$location.pathname == '/facebookerror') {
        app.errorMsg = 'Facebook email not found';
    } else if ($window.$location.pathname == '/facebook/inactive/error') {
        app.expired = true;
        app.errorMsg = ' Account has not yet been activated. Please check your emails.'
    } else {
        Auth.facebook($routeParams.token);
        $location.path('/');
    }
})

.controller('googleController', function($routeParams, Auth, $location, $window) {
    
    var app = this;
    app.errorMsg = false;
    app.disable = true;

    if($window.$location.pathname == '#!/googleerror') {
        app.errorMsg = 'Google email not found';
    }else if ($window.$location.pathname == '/google/inactive/error') {
        app.expired = true;
        app.errorMsg = ' Account has not yet been activated. Please check your emails.'
    }else {
        Auth.google($routeParams.token);
        $location.path('/');
    }
})