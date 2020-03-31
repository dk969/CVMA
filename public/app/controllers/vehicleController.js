angular.module('vehicleController', ['vehicleServices'])

    .controller('vehicleController', function($http, $location, $timeout, Vehicle) {
        var app = this;
        this.vehAdd = function(vehData) {
            app.loading = true;
            app.errorMsg = false;
   
            Vehicle.create(app.vehData).then(function(data) {
                
                if (data.data.success) {
                    app.loading = false;
                    app.successMsg = data.data.message + '...Redirecting';

                    $timeout(function() {
                        $location.path('/');
                    }, 2000)
                } else {
                    app.loading = false;
                    app.errorMsg = data.data.message;
                }

            });
        };
    });
    