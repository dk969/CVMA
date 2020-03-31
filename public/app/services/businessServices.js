angular.module('businessServices', [])


.factory('Business', function($http) {
    businessFactory = {};


    //Business.create(busData);
    businessFactory.create = function(busData) {
        return $http.post('/businessRoute/business', busData);
    }
    return businessFactory;

});