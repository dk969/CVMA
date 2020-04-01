angular.module('businessServices', [])


.factory('Business', function($http) {
    businessFactory = {};


    //Business.create(busData);
    businessFactory.create = function(busData) {
        return $http.post('/businessRoute/business', busData);
    }

    //Business.getPermission();
    businessFactory.getPermission = function() {
        return $http.get('/businessRoute/permission');
    };
    //Business.getBusinesses();
    businessFactory.getBusinesses = function() {
        return $http.get('/businessRoute/business/')
    };
    //User.getUser(id);
    // userFactory.getUser = function(id) {
    //     return $http.get('/api/edit/' + id)
    // };
    // //User.deleteUser();
    // userFactory.deleteUser = function(username) {
    //     return $http.delete('/api/management/' + username);
    // };
    
    // //User.editUser(username);
    // userFactory.editUser = function(id) {
    //     return $http.put('/api/edit', id);
    // };
    return businessFactory;

});