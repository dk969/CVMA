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
    businessFactory.getBusinessID = function(id) {
        return $http.get('/businessRoute/get/'+ id)
    };
    businessFactory.getBusiness = function(id) {
        return $http.get('/businessRoute/editBusiness/'+ id)
    };
  
    //Business.deleteVehicle();
    businessFactory.deleteBusiness = function(id) {
        return $http.delete('/businessRoute/business/' + id);
    };
    
    // //User.editUser(username);
    businessFactory.editedBusiness = function(id) {
        return $http.put('/businessRoute/editBusiness', id);
    };
    return businessFactory;

});