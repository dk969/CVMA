var app = angular.module('cvmaRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

    $routeProvider

    .when('/', {
        templateUrl: 'app/views/pages/home.html'
    })

    .when('/about', {
        templateUrl: 'app/views/pages/about.html'
    })
    .when('/map', {
        templateUrl: 'app/views/pages/map.html',
        controller: 'mapController',
        controllerAs: 'map',
        authenticated: true
    })

    .when('/register', {
        templateUrl: 'app/views/pages/users/register.html',
        controller: 'regController',
        controllerAs: 'register',
        authenticated: false
    })
   
    .when('/vehicle', {
        templateUrl: 'app/views/pages/vehicle/vehicle.html',
        controller: 'vehicleController',
        controllerAs: 'vehicle',
        authenticated: true
    })
    .when('/add_vehicle', {
        templateUrl: 'app/views/pages/vehicle/add_vehicle.html',
        controller: 'vehicleController',
        controllerAs: 'vehicle',
        authenticated: true
    })
    .when('/edit_vehicle/:id', {
        templateUrl: 'app/views/pages/vehicle/edit_vehicle.html',
        controller: 'editVehController',
        controllerAs: 'editVehicle',
        authenticated: true
    })
   
   //User Authenication
    .when('/login', {
        templateUrl: 'app/views/pages/users/login.html',
        authenticated: false
    })
    .when('/buslogin', {
        templateUrl: 'app/views/pages/users/business_login.html',
        authenticated: false
    })
    .when('/logout', {
        templateUrl: 'app/views/pages/users/logout.html',
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
    })
    //Management routes
    .when('/management', {
        templateUrl: 'app/views/pages/management/management.html',
        controller: 'managementController',
        controllerAs: 'management',
        authenticated: true,
        permission: ['admin', 'moderator']
    })
    .when('/edit/:id', {
        templateUrl: 'app/views/pages/management/edit.html',
        controller: 'editController',
        controllerAs: 'edit',
        authenticated: true,
        permission: ['admin', 'moderator']
    })
    .when('/userprofile/:username', {
        templateUrl: 'app/views/pages/users/userprofile.html',
        controller: 'editCurrentController',
        controllerAs: 'edit',
        authenticated: true,
      
    })
    .when('/search', {
        templateUrl: 'app/views/pages/management/search.html',
        controller: 'managementController',
        controllerAs: 'management',
        authenticated: true,
        permission: ['admin']
    })
    //Business routes
    .when('/searchBusiness', {
        templateUrl: 'app/views/pages/business/searchBusiness.html',
        controller: 'businessController',
        controllerAs: 'business',
        authenticated: true,
        
    })
    .when('/business', {
        templateUrl: 'app/views/pages/business/business.html',
        controller: 'businessController',
        controllerAs: 'business',
        authenticated: true,
        permission: ['admin', 'moderator']
    })
    .when('/view_business/:id', {
        templateUrl: 'app/views/pages/business/view_business.html',
        controller: 'getController',
        controllerAs: 'get',
        authenticated: true,
        
    })
    .when('/edit_business/:id', {
        templateUrl: 'app/views/pages/business/edit_business.html',
        controller: 'editBusController',
        controllerAs: 'editBusiness',
        authenticated: true,
        permission: ['admin', 'moderator']
    })
    .when('/post/:id', {
        templateUrl: 'app/views/pages/business/post.html',
        controller: 'postController',
        controllerAs: 'businessPost',
        authenticated: true,
        permission: ['admin', 'moderator']
        
    })
    .when('/businesslist', {
        templateUrl: 'app/views/pages/listBusiness.html',
        controller: 'businessController',
        controllerAs: 'business',
        authenticated: true,
        
    })
    .when('/dashboard', {
        templateUrl: 'app/views/pages/dashboard.html',
        controller: 'postController',
        controllerAs: 'businessPost',
        authenticated: true,
        
    })
    .when('/review/:id', {
        templateUrl: 'app/views/pages/business/review.html',
        controller: 'getController',
        controllerAs: 'review',
        authenticated: true,
        
    })
    .when('/subscribe', {
        templateUrl: 'app/views/pages/notifcations/subscribe.html',
        controller: 'subController',
        controllerAs: 'subscribe',
        authenticated: true,
        
    })
    .when('/upgrade/:username', {
        templateUrl: 'app/views/pages/users/upgrade.html',
        controller: 'upgradeController',
        controllerAs: 'upgrade',
        authenticated: true,
        
    })
    .when('/redirect', {
        templateUrl: 'app/views/pages/users/redirect.html',
        authenticated: true,
    })
    .when('/profile_details', {
        templateUrl: 'app/views/pages/users/business_profile.html',
        controller: 'authorController',
        controllerAs: 'author',
        authenticated: true,
        
    })
    .when('/reviews', {
        templateUrl: 'app/views/pages/users/review.html',
        controller: 'authorController',
        controllerAs: 'author',
        authenticated: true,
        
    })
    //Chat Rooms
    .when('/join', {
        templateUrl: 'app/views/pages/chat/join.html',
        controller: 'vehicleController',
        controllerAs: 'vehicle',
        authenticated: true,
        
    })
    .when('/chat', {
        templateUrl: 'app/views/pages/chat/chat.html',
        controller: 'chatController',
        controllerAs: 'chat',
        authenticated: true,
        
    })
    
    
    
    .otherwise({ redirectTo: '/'} );

    
    $locationProvider.html5Mode({
        enable: true,
        requireBase: false
    });
    

});

app.run(['$rootScope', 'Auth', '$location', 'User', function($rootScope, Auth, $location, User){

    $rootScope.$on('$routeChangeStart', function(event, next, current){
        //checks if valid route
        if (next.$$route !== undefined) {
            //checkds if user authenticated
            if (next.$$route.authenticated == true) {
                if (!Auth.isLoggedIn()) { 
                    event.preventDefault();
                    $location.path('/');
                } else if (next.$$route.permission) {
                    //user prevented and redirected to home
                    User.getPermission().then(function(data) {
                        if (next.$$route.permission[0] !== data.data.permission) {
                            if (next.$$route.permission[1] !== data.data.permission) {
                        //         console.log(data);
                                event.preventDefault();// If not logged in, prevent accessing route
                                $location.path('/');//Redirect to home
                            }
                        }
                    });  
                }
     
             } else if (next.$$route.authenticated == false){
                 if (Auth.isLoggedIn()) { 
                     event.preventDefault();
                     $location.path('/profile');
                 }
             
             }
        }
        
    });
}]);

