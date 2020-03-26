angular.module('cvmaApp',['cvmaRoutes', 'userController', 'userServices', 'ngAnimate', 'mainController', 'authServices'])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});
