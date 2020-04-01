angular.module('vehicleController', ['vehicleServices'])

    .controller('vehicleController', function($http, $location, $timeout, Vehicle) {
        var app = this;
        
        app.loading = true;
        app.accessDenied = true;
        app.errorMsg = false;
        app.editAccess = false;
        app.deleteAccess = false;


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



        Vehicle.getVehicles().then(function(data) {
           
            if (data.data.success) {
                if (data.data.permission === 'admin' || data.data.permission === 'moderator' || data.data.permission === 'user') {
                    app.vehicles = data.data.vehicles;
                    app.loading = false;
                    app.accessDenied = false;
                    if (data.data.permission === 'admin') {
                        app.editAccess = true;
                        app.deleteAccess = true;
                    } else if (data.data.permission === 'moderator') {
                        app.editAccess = true;
                    } else if (data.data.permission === 'user') {
                       
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
    });
    