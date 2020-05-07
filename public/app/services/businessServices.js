angular.module('businessServices', [])


.factory('Business', function($http) {
    businessFactory = {};


    //Business.create(busData);
    businessFactory.create = function(busData) {
        return $http.post('/api/business', busData );
    }
    //Business.getPermission();
    businessFactory.getPermission = function() {
        return $http.get('/businessRoute/permission');
    };
    //Business.getBusinesses();
    businessFactory.getBusinesses = function() {
        return $http.get('/api/businessAll')
    };
    //Business.getAuthorBus();
    businessFactory.getAuthorBus = function() {
        return $http.get('/api/business/')
    };
    businessFactory.getBusinessID = function(id) {
        return $http.get('/api/get/'+ id)
    };
    businessFactory.getBusiness = function(id) {
        return $http.get('/businessRoute/editBusiness/'+ id)
    };
  
    //Business.deleteVehicle();
    businessFactory.deleteBusiness = function(id) {
        return $http.delete('/businessRoute/business/' + id);
    };
    
    // //Business.editUser(username);
    businessFactory.editedBusiness = function(id) {
        return $http.put('/businessRoute/editBusiness', id);
    };
    
    //Business.createReview();
    businessFactory.createReview =function(revData) {
        return $http.post('/api/review', revData);
    };
       //BusinessPost.getPosts();
    businessFactory.getAuthorReview = function() {
        return $http.get('/api/review/')
    };
     //Business.deleteReview();
     businessFactory.deleteReview = function(id) {
        return $http.delete('/businessRoute/review/' + id);
    };
    return businessFactory;

})
.factory('BusinessPost', function($http){
    postingFactory = {}

    //BusinessPost.create(postData);
    postingFactory.create = function(postData) {
        return $http.post('/api/businessPost', postData);
    };
     //BusinessPost.getPosts();
    postingFactory.getPosts = function() {
        return $http.get('/api/businessPosts/')
    };
      //BusinessPost.getPosts();
      postingFactory.getAuthorPost = function() {
        return $http.get('/api/businessPost/')
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
    //Subscribe.create(subData);
    subFactory.update = function(subData) {
        return $http.put('/businessRoute/newSub', subData);
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