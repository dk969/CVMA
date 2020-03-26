angular.module('mainController', ['authServices'])

.controller('mainController', function(Auth, $timeout, $location) {
   var app = this;

   if (Auth.isLoggedIn()) {
       console.log('Success: User is Logged in.');
       Auth.getUser().then(function(data) {
           console.log(data.data.username);
           app.username = data.data.username;
       })
   } else {
       console.log('Failure: User is NOT logged in');
   }

   this.doLogin = function(loginData) {
        app.loading = true;
        app.errorMsg =false;
        
        Auth.login(app.loginData).then(function(data) {
            
             if (data.data.success) {
                app.loading = false;

                app.successMsg = data.data.message + ' ...Redirecting';
                $timeout(function() {
                    $location.path('/about');

                }, 2000);

             } else {
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
