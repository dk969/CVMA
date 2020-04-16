angular.module('vehicleServices', [])


.factory('Vehicle', function($http) {
    vehicleFactory = {};


    //Vehicle.create(vehData);
    vehicleFactory.create = function(vehData) {
        return $http.post('/api/vehicle', vehData);
    }
     //Vehicle.getPermission();
     vehicleFactory.getPermission = function() {
        return $http.get('/businessRoute/permission');
    };
    //Vehicle.getVehicles();
    vehicleFactory.getVehicles = function(id) {
        return $http.get('/api/vehicle/', id)
    };
     //User.getVehicel(id);
     vehicleFactory.getVehicle = function(id) {
        return $http.get('/vehicleRoute/editVehicle/' + id)
    };
     //Vehicle.deleteVehicle();
     vehicleFactory.deleteVehicle = function(id) {
        return $http.delete('/vehicleRoute/vehicle/' + id);
    };
    //Vehicle.editVehicle(id);
    vehicleFactory.editedVehicle = function(id) {
        return $http.put('/vehicleRoute/editVehicle', id);
    };
    
    return vehicleFactory;

});