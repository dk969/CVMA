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
    businessFactory.getBusiness = function(id) {
        return $http.get('/businessRoute/business/'+ id)
    };
    //User.getUser(id);
    // userFactory.getUser = function(id) {
    //     return $http.get('/api/edit/' + id)
    // };
    //Business.deleteVehicle();
    businessFactory.deleteBusiness = function(id) {
        return $http.delete('/businessRoute/business/' + id);
    };
    
    // //User.editUser(username);
    // userFactory.editUser = function(id) {
    //     return $http.put('/api/edit', id);
    // };
    return businessFactory;

});