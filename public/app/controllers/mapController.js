


angular.module('mapController', [])


    .controller('mapController', function( $scope) {
     
        $scope.initialize = function() {
            $scope.mapOptions = {
                zoom: 8,
                center: new google.maps.LatLng(52.6369,1.1398)
            };
            $scope.map = new google.maps.Map(document.getElementById('googleMap'), $scope.mapOptions);
            $scope.directionsService = new google.maps.DirectionsService();
            $scope.directionsRenderer = new google.maps.DirectionsRenderer();
            directionsRenderer.setMap(map);
            infoWindow = new google.maps.InfoWindow;
               
               if (navigator.geolocation) {
                   navigator.geolocation.getCurrentPosition(function (position) {
                       var pos = {
                           lat: position.coords.latitude,
                           lng: position.coords.longitude
                       };
                       
                       infoWindow.setPosition(pos);
                       infoWindow.setContent('Your current location.');
                       infoWindow.open(map);
                       map.setCenter(pos);
                   }, function () {
                       handleLocationError(true, infoWindow, map.getCenter());
                   });
               } else {
                   // Browser doesn't support Geolocation
                   handleLocationError(false, infoWindow, map.getCenter());
               }
           var onChangeHandler = function() {
             calculateAndDisplayRoute(directionsService, directionsRenderer);
           };
           document.getElementById('start').addEventListener('change', onChangeHandler);
           document.getElementById('end').addEventListener('change', onChangeHandler);
         }
         function calculateAndDisplayRoute(directionsService, directionsRenderer) {
           directionsService.route(
               {
                 origin: {query: document.getElementById('start').value},
                 destination: {query: document.getElementById('end').value},
                 travelMode: 'DRIVING'
               },
               function(response, status) {
                 if (status === 'OK') {
                   directionsRenderer.setDirections(response);
                 } else {
                   window.alert('Directions request failed due to ' + status);
                 }
               });
           
   

        }
    
        $scope.loadScript = function() {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://maps.google.com/maps/api/js?sensor=false';
            script.src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAee9B7WpqGWmSQD6QT6WexgM8Iv0Vd2ls&callback=initialize";
            script.defer = true;
            script.async = true;

         
            document.body.appendChild(script);
            setTimeout(function() {
                $scope.initialize();
            }, 500);
            
                
          
        }
    });