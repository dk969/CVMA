angular.module('vehicleServices', [])


.factory('Vehicle', function($http) {
    vehicleFactory = {};


    //Vehicle.create(busData);
    vehicleFactory.create = function(vehData) {
        return $http.post('/vehicleRoute/vehicle', vehData);
    }
     //Business.getPermission();
     vehicleFactory.getPermission = function() {
        return $http.get('/businessRoute/permission');
    };
    //Business.getBusinesses();
    vehicleFactory.getVehicles = function() {
        return $http.get('/vehicleRoute/vehicle/')
    };
     //Business.deleteVehicle();
     vehicleFactory.deleteVehicle = function(id) {
        return $http.delete('/vehicleRoute/vehicle/' + id);
    };
    
    return vehicleFactory;

});