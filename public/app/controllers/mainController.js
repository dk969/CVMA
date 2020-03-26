angular.module('mainController', ['authServices'])

.controller('mainController', function(Auth, $timeout, $location, $rootScope, $window) {
   var app = this;
    
    //remove console logs ONCE complete
    
    app.loadme = false;// allowing the html to catch up getting all data needed

    $rootScope.$on('$routeChangeStart', function() {
        if (Auth.isLoggedIn()) {
            console.log('Success: User is Logged in.');
            app.isLoggedIn = true;
            Auth.getUser().then(function(data) {
                
                app.username = data.data.username;
                app.useremail = data.data.email;
                app.loadme = true;

            })
        } else {
            console.log('Failure: User is NOT logged in');
            app.isLoggedIn = false;
            app.username = '';
            app.loadme = true;
        }
        if ($location.hash() == '_=_')$location.hash(null);
    });

        this.facebook = function() {
            $window.location = $window.location.protocol +'//' +$window.location.host + '/auth/facebook';
        };

        this.google = function() {
            $window.location = $window.location.protocol +'//' +$window.location.host + '/auth/google';
        };
  

   this.doLogin = function(loginData) {
        app.loading = true;
        app.errorMsg =false;
        
        Auth.login(app.loginData).then(function(data) {
            
             if (data.data.success) {
                app.loading = false;
                //redirects to home page and creates success message
                app.successMsg = data.data.message + ' ...Redirecting';
                $timeout(function() {
                    $location.path('/about');
                    app.loginData = '';
                    app.successMsg = false;
                }, 2000);

             } else {
                 //creates an error message
                app.loading = false;
                app.errorMsg = data.data.message;
             }
        });
    };
    // need to fix  vid 9/22 around 18 mins
    this.logout = function() {
        Auth.logout();
        $location.path('/logout');
        $timeout(function() {
            $location.path('/');
        },2000);

    };
});
