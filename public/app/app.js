angular.module('cvmaApp',['cvmaRoutes', 'userController', 'userServices', 'ngAnimate', 'mainController', 'authServices', 'emailController' ,
'managementController', 'businessController', 'businessServices', 'vehicleController', 'vehicleServices'])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});
