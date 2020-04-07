//import gmap from 'google-maps';


angular.module('mapController', [])


    .controller('mapController', function( $location, $timeout, Business, User, $scope) {
        gmap.KEY = 'AIzaSyDaT9dUsoG56-8jxi4HDq_aQqG22GN6CYU';
  
        gmap.LIBRARIES = ["places"];
        gmap.LANGUAGE = 'en';

        window.navigator.geolocation.getCurrentPosition(function(position){
            var lat =  position.coords.latitude;
            var lng = position.coords.longitude;
            gmap.load(function(google) {	  	
             var center =  { lat: lat, lng: lng };
             var options = {
              zoom: 14,
              center:  center   
            }
            var map = new google.maps.Map(document.getElementById('map'), options);
        
            var me = new google.maps.Marker({
              position: center,
              map: map
        
            });
        })
     })
    
      

    })