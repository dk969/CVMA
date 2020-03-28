var app = angular.module('cvmaRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

    $routeProvider

    .when('/', {
        templateUrl: 'app/views/pages/home.html'
    })

    .when('/about', {
        templateUrl: 'app/views/pages/about.html'
    })

    .when('/register', {
        templateUrl: 'app/views/pages/users/register.html',
        controller: 'regController',
        controllerAs: 'register',
        authenticated: false
    })

    .when('/login', {
        templateUrl: 'app/views/pages/users/login.html',
        authenticated: false
    })
    .when('/logout', {
        templateUrl: 'app/views/pages/users/logout.html',
        authenticated: true 
    })

    .when('/profile', {
        templateUrl: 'app/views/pages/users/profile.html',
        authenticated: true
    })

    .when('/facebook/:token', {
        templateUrl: 'app/views/pages/users/social/social.html',
        controller: 'facebookController',
        controllerAs: 'facebook',
        authenticated: false
    })

    .when('/facebookerror', {
        templateUrl: 'app/views/pages/users/login.html',
        controller: 'facebookController',
        controllerAs: 'facebook',
        authenticated: false
    })
    .when('/facebook/inactive/error', {
        templateUrl: 'app/views/pages/users/login.html',
        controller: 'facebookController',
        controllerAs: 'facebook',
        authenticated: false
    })

    .when('/google/:token', {
        templateUrl: 'app/views/pages/users/social/social.html',
        controller: 'googleController',
        controllerAs: 'google',
        authenticated: false
    })

    .when('/googleerror', {
        templateUrl: 'app/views/pages/users/login.html',
        controller: 'googleController',
        controllerAs: 'google',
        authenticated: false
    })
    .when('/google/inactive/error', {
        templateUrl: 'app/views/pages/users/login.html',
        controller: 'googleController',
        controllerAs: 'google',
        authenticated: false
    })

    .when('/activate/:token', {
        templateUrl: 'app/views/pages/users/activation/activate.html',
        controller: 'emailController',
        controllerAs: 'email',
        authenticated: false
      
    })
    .when('/resend', {
        templateUrl: 'app/views/pages/users/activation/resend.html',
        controller: 'resendController',
        controllerAs: 'resend',
        authenticated: false
    })
    .when('/resetusername', {
        templateUrl: 'app/views/pages/users/reset/username.html',
        controller: 'usernameController',
        controllerAs: 'username',
        authenticated: false
    })
    .when('/resetpassword', {
        templateUrl: 'app/views/pages/users/reset/password.html',
        controller: 'passwordController',
        controllerAs: 'password',
        authenticated: false
    })
    .when('/reset/:token', {
        templateUrl: 'app/views/pages/users/reset/newpassword.html',
        controller: 'resetController',
        controllerAs: 'reset',
        authenticated: false
    })
    
    
    
    .otherwise({ redirectTo: '/'} );

    
    $locationProvider.html5Mode({
        enable: true,
        requireBase: false
    });
    //fix routes

});

app.run(['$rootScope', 'Auth', '$location', function($rootScope, Auth, $location){

    $rootScope.$on('$routeChangeStart', function(event, next, current){

        if (next.$$route.authenticated == true) {
           if (!Auth.isLoggedIn()) { 
               event.preventDefault();
               $location.path('/');
           }

        } else if (next.$$route.authenticated == false){
            if (Auth.isLoggedIn()) { 
                event.preventDefault();
                $location.path('/profile');
            }
        
        }
    });
}]);

