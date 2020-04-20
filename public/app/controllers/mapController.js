


angular.module('mapController', ['businessServices'])
    

    .controller('mapController', function( $scope, Business) {
        var app = this;
        function getAddress() {
        Business.getAddress().then(function(data) {
            if (data.data.success) {
                app.address = data.data.address;
                app.loading = false;
                console.log(app.address);
                    
            } else {
                app.errorMsg = data.data.message;
                app.loading = false;
            
        }
    })
}
    getAddress()


        
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
                  center: {lat: 52.6369, lng: 1.1398}
                });
                directionsRenderer.setMap(map);
                 var infoWindow = new google.maps.InfoWindow;
                    
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
               
                document.getElementById('end').addEventListener('change', onChangeHandler);
                
               
                
                
            
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
    
        
        
    // function initialize() {
    //     geocoder = new google.maps.Geocoder();
    //     var latlng = new google.maps.LatLng(52.6369, 1.1398);
    //     navigator.geolocation.getCurrentPosition((position) => {
    //     this.latitude = position.coords.latitude;
    //     this.longitude = position.coords.longitude;
    //     this.zoom = 15;
    //      });
    //      var address = document.getElementById('address').value;
    //     geocoder.geocode( { 'address': address}, function(results, status) {
    //     if (status == 'OK') {
    //         map.setCenter(results[0].geometry.location);
    //         var marker = new google.maps.Marker({
    //             map: map,
    //             position: results[0].geometry.location
                
    //         });
    //     } else {
    //         alert('Geocode was not successful for the following reason: ' + status);
    //     }
    //     });
    //     var mapOptions = {
    //     zoom: 15,
    //     center: latlng
    //     }
    //     map = new google.maps.Map(document.getElementById('map'), mapOptions);
    // }
        
    
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
              
           
              $scope.search = function() {
                geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng(52.6369, 1.1398);
                navigator.geolocation.getCurrentPosition((position) => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                this.zoom = 15;
                 });
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
                var mapOptions = {
                zoom: 15,
                center: latlng
                }
                map = new google.maps.Map(document.getElementById('map'), mapOptions);
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