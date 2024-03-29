


angular.module('mapController', ['businessServices'])
    

    .controller('mapController', function( $scope, Business) {
        var app = this;   
        function getBusinesses() {
            Business.getBusinesses().then(function(data) {
                app.editAccess = false;
                app.deleteAccess = false;
                if (data.data.success) {
                   
                    if (data.data.permission === 'admin' || data.data.permission === 'moderator'|| data.data.permission === 'user') {
                        app.companies = data.data.companies;
                        app.loading = false;
                        app.accessDenied = false;
                        if (data.data.permission === 'admin') {
                            app.editAccess = true;
                            app.deleteAccess = true;
                            app.authorized = true;
                        } else if (data.data.permission === 'moderator' ) {
                            app.editAccess = false;
                            app.deleteAccess = false;
                            app.authorized = false;
                        } else if (data.data.permission === 'user') {
                            app.editAccess = false;
                            app.deleteAccess = false;
                            app.authorized = false;
                        } 
                    } else {
                        app.errorMsg = 'Insufficient Permissions';
                        app.loading = false;
                    }
                } else {
                    app.errorMsg = data.data.message;
                    app.loading = false;
                }
            });
         }
         getBusinesses()
        $scope.initialize = function() {
          
            var delay = 100;
            var geocoder = new google.maps.Geocoder();
            var directionsService = new google.maps.DirectionsService();
                var directionsRenderer = new google.maps.DirectionsRenderer();
                var map = new google.maps.Map(document.getElementById('map'), {
                  zoom: 7,
                  center: {lat: 52.6369, lng: 1.1398},
                  disableDefaultUI: true,
                  zoomControl: true,
                  scaleControl: true,
                  styles: [
                    //CSS for the maps
                    {elementType: 'geometry', stylers: [{color: '#ebe3cd'}]},
                    {elementType: 'labels.text.fill', stylers: [{color: '#523735'}]},
                    {elementType: 'labels.text.stroke', stylers: [{color: '#f5f1e6'}]},
                    {
                      featureType: 'administrative',
                      elementType: 'geometry.stroke',
                      stylers: [{color: '#c9b2a6'}]
                    },
                    {
                      featureType: 'administrative.land_parcel',
                      elementType: 'geometry.stroke',
                      stylers: [{color: '#dcd2be'}]
                    },
                    {
                      featureType: 'administrative.land_parcel',
                      elementType: 'labels.text.fill',
                      stylers: [{color: '#ae9e90'}]
                    },
                    {
                      featureType: 'landscape.natural',
                      elementType: 'geometry',
                      stylers: [{color: '#dfd2ae'}]
                    },
                    {
                      featureType: 'poi',
                      elementType: 'geometry',
                      stylers: [{color: '#dfd2ae'}]
                    },
                    {
                      featureType: 'poi',
                      elementType: 'labels.text.fill',
                      stylers: [{color: '#93817c'}]
                    },
                    {
                      featureType: 'poi.park',
                      elementType: 'geometry.fill',
                      stylers: [{color: '#a5b076'}]
                    },
                    {
                      featureType: 'poi.park',
                      elementType: 'labels.text.fill',
                      stylers: [{color: '#447530'}]
                    },
                    {
                      featureType: 'road',
                      elementType: 'geometry',
                      stylers: [{color: '#f5f1e6'}]
                    },
                    {
                      featureType: 'road.arterial',
                      elementType: 'geometry',
                      stylers: [{color: '#fdfcf8'}]
                    },
                    {
                      featureType: 'road.highway',
                      elementType: 'geometry',
                      stylers: [{color: '#f8c967'}]
                    },
                    {
                      featureType: 'road.highway',
                      elementType: 'geometry.stroke',
                      stylers: [{color: '#e9bc62'}]
                    },
                    {
                      featureType: 'road.highway.controlled_access',
                      elementType: 'geometry',
                      stylers: [{color: '#e98d58'}]
                    },
                    {
                      featureType: 'road.highway.controlled_access',
                      elementType: 'geometry.stroke',
                      stylers: [{color: '#db8555'}]
                    },
                    {
                      featureType: 'road.local',
                      elementType: 'labels.text.fill',
                      stylers: [{color: '#806b63'}]
                    },
                    {
                      featureType: 'transit.line',
                      elementType: 'geometry',
                      stylers: [{color: '#dfd2ae'}]
                    },
                    {
                      featureType: 'transit.line',
                      elementType: 'labels.text.fill',
                      stylers: [{color: '#8f7d77'}]
                    },
                    {
                      featureType: 'transit.line',
                      elementType: 'labels.text.stroke',
                      stylers: [{color: '#ebe3cd'}]
                    },
                    {
                      featureType: 'transit.station',
                      elementType: 'geometry',
                      stylers: [{color: '#dfd2ae'}]
                    },
                    {
                      featureType: 'water',
                      elementType: 'geometry.fill',
                      stylers: [{color: '#b9d3c2'}]
                    },
                    {
                      featureType: 'water',
                      elementType: 'labels.text.fill',
                      stylers: [{color: '#92998d'}]
                    }
                  ]
                });
                directionsRenderer.setMap(map);
                 var infoWindow = new google.maps.InfoWindow;
                    //Gets users position using geolocation
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
                        handleLocationError(false, infoWindow, map.getCenter());
                    }
                var onChangeHandler = function() {
                  calculateAndDisplayRoute(directionsService, directionsRenderer);
                };
               //Gets Endpoint 
                document.getElementById('end').addEventListener('change', onChangeHandler);
                var geocoder = new google.maps.Geocoder();

                document.getElementById('submit').addEventListener('click', function() {
                  geocodeAddress(geocoder, map);
                });
              }
        
              function geocodeAddress(geocoder, resultsMap) {
                var address = document.getElementById('address').value;
                geocoder.geocode({'address': address}, function(results, status) {
                  if (status === 'OK') {
                    resultsMap.setCenter(results[0].geometry.location);
                    var marker = new google.maps.Marker({
                      map: resultsMap,
                      position: results[0].geometry.location
                    });
                  } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                  }
                });
              }
              function calculateAndDisplayRoute(directionsService, directionsRenderer) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                  
                directionsService.route(
                    {
                      origin: {lat: position.coords.latitude,
                        lng: position.coords.longitude},
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
                })

                
        }
    
        
        
    
        
    
        $scope.loadScript = function() {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://maps.google.com/maps/api/js?sensor=false&callback=initialize';
            script.src="https://maps.googleapis.com/maps/api/js?key=API KEY";
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
                  zoom: 9,
                  center: {lat: 52.6369, lng: 1.1398},
                  disableDefaultUI: true,
                  zoomControl: true,
                  styles: [
                    {elementType: 'geometry', stylers: [{color: '#ebe3cd'}]},
                    {elementType: 'labels.text.fill', stylers: [{color: '#523735'}]},
                    {elementType: 'labels.text.stroke', stylers: [{color: '#f5f1e6'}]},
                    {
                      featureType: 'administrative',
                      elementType: 'geometry.stroke',
                      stylers: [{color: '#c9b2a6'}]
                    },
                    {
                      featureType: 'administrative.land_parcel',
                      elementType: 'geometry.stroke',
                      stylers: [{color: '#dcd2be'}]
                    },
                    {
                      featureType: 'administrative.land_parcel',
                      elementType: 'labels.text.fill',
                      stylers: [{color: '#ae9e90'}]
                    },
                    {
                      featureType: 'landscape.natural',
                      elementType: 'geometry',
                      stylers: [{color: '#dfd2ae'}]
                    },
                    {
                      featureType: 'poi',
                      elementType: 'geometry',
                      stylers: [{color: '#dfd2ae'}]
                    },
                    {
                      featureType: 'poi',
                      elementType: 'labels.text.fill',
                      stylers: [{color: '#93817c'}]
                    },
                    {
                      featureType: 'poi.park',
                      elementType: 'geometry.fill',
                      stylers: [{color: '#a5b076'}]
                    },
                    {
                      featureType: 'poi.park',
                      elementType: 'labels.text.fill',
                      stylers: [{color: '#447530'}]
                    },
                    {
                      featureType: 'road',
                      elementType: 'geometry',
                      stylers: [{color: '#f5f1e6'}]
                    },
                    {
                      featureType: 'road.arterial',
                      elementType: 'geometry',
                      stylers: [{color: '#fdfcf8'}]
                    },
                    {
                      featureType: 'road.highway',
                      elementType: 'geometry',
                      stylers: [{color: '#f8c967'}]
                    },
                    {
                      featureType: 'road.highway',
                      elementType: 'geometry.stroke',
                      stylers: [{color: '#e9bc62'}]
                    },
                    {
                      featureType: 'road.highway.controlled_access',
                      elementType: 'geometry',
                      stylers: [{color: '#e98d58'}]
                    },
                    {
                      featureType: 'road.highway.controlled_access',
                      elementType: 'geometry.stroke',
                      stylers: [{color: '#db8555'}]
                    },
                    {
                      featureType: 'road.local',
                      elementType: 'labels.text.fill',
                      stylers: [{color: '#806b63'}]
                    },
                    {
                      featureType: 'transit.line',
                      elementType: 'geometry',
                      stylers: [{color: '#dfd2ae'}]
                    },
                    {
                      featureType: 'transit.line',
                      elementType: 'labels.text.fill',
                      stylers: [{color: '#8f7d77'}]
                    },
                    {
                      featureType: 'transit.line',
                      elementType: 'labels.text.stroke',
                      stylers: [{color: '#ebe3cd'}]
                    },
                    {
                      featureType: 'transit.station',
                      elementType: 'geometry',
                      stylers: [{color: '#dfd2ae'}]
                    },
                    {
                      featureType: 'water',
                      elementType: 'geometry.fill',
                      stylers: [{color: '#b9d3c2'}]
                    },
                    {
                      featureType: 'water',
                      elementType: 'labels.text.fill',
                      stylers: [{color: '#92998d'}]
                    }
                  ],
                });
                
                 infoWindow = new google.maps.InfoWindow;
                    
                   
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
           script.src="https://maps.googleapis.com/maps/api/js?key=API KEY";
            script.defer = true;
            script.async = true;

         
            document.body.appendChild(script);
            setTimeout(function() {
                $scope.initialize();
            }, 500);
            
                
        }

    });
