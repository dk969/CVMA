angular.module('authServices', [])
 //These factories help control the Authenication of the application

.factory('Auth', function($http, AuthToken) {
   var authFactory = {};
        
    //User.create(regData);
    authFactory.login = function(loginData) {
        return $http.post('/api/authenticate', loginData).then(function(data) {
            AuthToken.setToken(data.data.token);
            return data;
        });
    };

    //Auth.isLoggedIn();
    authFactory.isLoggedIn = function() {
        if ( AuthToken.getToken()) {
            return true;
        } else {
            return false;
        }
    };

    //Auth.facebook(token);
    authFactory.facebook = function(token) {
        AuthToken.setToken(token);
    }
    //Auth.getUser();
    authFactory.getUser = function(){
        if (AuthToken.getToken()) {
            return $http.get('/api/currentUser');
        } else {
            $q.reject({ message: 'User has no token'});
        }
    };

    //Auth.logout();
    authFactory.logout = function() {
        AuthToken.setToken();

    };

    return authFactory;
})
//Sets and gets token
.factory('AuthToken', function($window) {
    var authTokenFactory = {};

    //AuthToken.setToken(token);
    authTokenFactory.setToken = function(token) {
        if (token) {
            $window.localStorage.setItem('token', token);
        } else {
            $window.localStorage.removeItem('token', token);
        }
    };

    //AuthToken.getToken();
    authTokenFactory.getToken = function() {
        return $window.localStorage.getItem('token');
    };

    return authTokenFactory; 
})
//Checks the users token
.factory('AuthInterceptors', function(AuthToken) {
    var authInterceptorsFactory = {};

    authInterceptorsFactory.request = function(config) {
        var token = AuthToken.getToken();
        if (token) config.headers['x-access-token'] = token;
        return config;
    };

    return authInterceptorsFactory;

});