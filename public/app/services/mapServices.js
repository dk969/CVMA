angular.module('mapServices', [])


.factory('maps', function($rootScope, $http) {
   
// Initialize Variables-------------------------------------------------
        /* googleMapService is an object and it will hold the refresh function
        that we will use to build/rebuild our map */
        var googleMapService = {};
        /* Array of locations obtained for API call. Below is a function to
        convert our collected lat/lng data to the Google format - which will be
        stored in this array */
        var locations = [];

        /* Selected Location (initialize to Toronto), this will hold the
        specific location we are looking at during any given point. */
        var selectedLat = 43.6532;
        var selectedLong = -79.3832;

        // This will handle clicks and location selection
        googleMapService.clickLat = 0;
        googleMapService.clickLong = 0;

        var lastMarker;
        var currentSelectedMarker;



           // FUNCTIONS============================================================

        /* Refresh the Map with new data. This function will take new latitude and
        longitude coordinates and will refresh the map with this info. Note: this
        function will be running as soon as the window loads*/
        googleMapService.refresh = function(latitude, longitude, filteredResults) {
            // Clears the holding array of locations
            locations = [];
  
            // Set the selected lat and long equal to the ones provided on the refresh() call
            selectedLat = parseFloat(latitude);
            selectedLong = parseFloat(longitude);
              // if filtered results are provided in the refresh call
              if(filteredResults) {
                // convert the filtered results into map points
                locations = convertToMapPoints(filteredResults);
                // then, initialize the map -- noting that a filter was used
                initialize(latitude, longitude, true);
                // if no filter is provided in the refrsh call
              } else {
                //Perform an AJAZ call to get all the records in the db
                $http.get('/users').success(function(response){
                  // then convert the results into map points
                  locations = convertToMapPoints(response);
                  //then initialize the map -- noting that no filter was uesed.
                  initialize(latitude, longitude, false);
                }).error(function(){});
  
              }
          };

});