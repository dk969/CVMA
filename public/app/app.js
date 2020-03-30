angular.module('cvmaApp',['cvmaRoutes', 'userController', 'userServices', 'ngAnimate', 'mainController', 'authServices', 'emailController' ,
'managementController', 'businessController',])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});
