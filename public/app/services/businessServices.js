angular.module('businessServices', [])


.factory('Business', function($http) {
    businessFactory = {};


    //Business.create(busData);
    businessFactory.create = function(busData) {
        return $http.post('/businessRoute/business/', busData );
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

})
.factory('BusinessPost', function($http){
    postingFactory = {}

    //BusinessPost.create(postData);
    postingFactory.create = function(postData) {
        return $http.post('/businessRoute/businessPost', postData);
    };
     //BusinessPost.getPosts();
    postingFactory.getPosts = function() {
        return $http.get('/businessRoute/businessPost/')
    };
    //Business.deleteVehicle();
    postingFactory.deletePost = function(id) {
        return $http.delete('/businessRoute/businessPost/' + id);
    };
  
    

     
    return postingFactory;
})
.factory('Subscribe', function($http) {
    subFactory = {}

    //Subscribe.create(subData);
    subFactory.create = function(subData) {
        return $http.post('/businessRoute/subscribe', subData);
    };
     //Subscribe.getSubscribers();
     subFactory.getSubscribers = function() {
        return $http.get('/businessRoute/subscribe/')
    };
    //Business.deleteVehicle();
    subFactory.deleteSub = function(id) {
        return $http.delete('/businessRoute/subscribe/' + id);
    };
    // subFactory.sendEmail = function(subscribers) {
    //     return $http.put('/businessRoute/businessPost/', subscribers);
    // };
    return subFactory;
})