angular.module('cvmaApp',['cvmaRoutes', 'userController', 'userServices', 'ngAnimate', 'mainController', 'authServices', 'emailController' ])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});
