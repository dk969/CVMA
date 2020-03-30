angular.module('cvmaApp',['cvmaRoutes', 'userController', 'userServices', 'ngAnimate', 'mainController', 'authServices', 'emailController' ,
'managementController', 'businessController', 'businessServices',])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});
