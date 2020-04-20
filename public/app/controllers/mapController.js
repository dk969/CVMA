


angular.module('mapController', [])


    .controller('mapController', function( $scope) {
     
        $scope.initialize = function() {
            
            
            var directionsService = new google.maps.DirectionsService();
                var directionsRenderer = new google.maps.DirectionsRenderer();
                var map = new google.maps.Map(document.getElementById('map'), {
                  zoom: 7,
                  center: {lat: 52.6369, lng: 1.1398}
                });
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
            script.src = 'https://maps.google.com/maps/api/js?sensor=false&callback=initialize';
            script.src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAee9B7WpqGWmSQD6QT6WexgM8Iv0Vd2ls";
            script.defer = true;
            script.async = true;

         
            document.body.appendChild(script);
            setTimeout(function() {
                $scope.initialize();
            }, 500);
            
                
        }

    })
    .controller('busMapController', function( $scope) {
     
        $scope.initialize = function() {
            
                
                var geocoder = new google.maps.Geocoder();
                var map = new google.maps.Map(document.getElementById('map'), {
                  zoom: 7,
                  center: {lat: 52.6369, lng: 1.1398}
                });
                
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
                    var address = document.getElementById('address').value;
                    geocoder.geocode( { 'address': address}, function(results, status) {
                    if (status == 'OK') {
                        map.setCenter(results[0].geometry.location);
                        var marker = new google.maps.Marker({
                            map: map,
                            position: results[0].geometry.location
                        
                        });
                    } else {
                        alert('Geocode was not successful for the following reason: ' + status);
                    }
                    });
                
               
              }
           
                
        
        
    
        $scope.loadScript = function() {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://maps.google.com/maps/api/js?sensor=false&callback=initialize';
            script.src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAee9B7WpqGWmSQD6QT6WexgM8Iv0Vd2ls";
            script.defer = true;
            script.async = true;

         
            document.body.appendChild(script);
            setTimeout(function() {
                $scope.initialize();
            }, 500);
            
                
        }

    });