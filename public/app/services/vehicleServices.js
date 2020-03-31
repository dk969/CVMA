angular.module('vehicleServices', [])


.factory('Vehicle', function($http) {
    vehicleFactory = {};


    //Business.create(busData);
    vehicleFactory.create = function(vehData) {
        return $http.post('/vehicleRoute/vehicle', vehData);
    }
    return vehicleFactory;

});