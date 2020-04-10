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
                        $location.path('/vehicle');
                    }, 2000)
                } else {
                    app.loading = false;
                    app.errorMsg = data.data.message;
                }

            });
        };



    function getVehicles() {
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
    }

           
    getVehicles();

    app.showMore = function(number) {
        app.showMoreError = false;

        if (number > 0) {
            app.limit = number;
        } else {
            app.showMoreError = "Please enter a valid number";
        }
    };

    app.showAll = function() {
        app.limit = undefined;
        showMoreError = false;

    };

    app.deleteVehicle = function(_id) {
        Vehicle.deleteVehicle(_id).then(function(data) {
            if (data.data.success) {
                getVehicles();
            } else {
                app.showMoreError = data.data.message;
            }
        });
    };

})

    .controller('editVehController', function($scope, $routeParams, Vehicle, $timeout) {
        var app = this;
        $scope.vehicle_makeTab = 'active';
        app.phase1 = true;

        Vehicle.getVehicle($routeParams.id).then(function(data) {
            if (data.data.success) {
                console.log(data.data.vehicle.vehicle_make);
                $scope.newMake = data.data.vehicle.vehicle_make;
                $scope.newModel = data.data.vehicle.vehicle_model;
                $scope.newYear = data.data.vehicle.year;
                $scope.newEngine_size = data.data.vehicle.engine_size;
                $scope.newColour = data.data.vehicle.colour;
                // $scope.newMOT = data.data.vehicle.MOT_date;
                // $scope.newTax = data.data.vehicle.tax_date;
                // $scope.newService = data.data.vehicle.service_date;
                
                app.currentVehicle = data.data.vehicle._id;
                
               
            } else { 
                app.errorMsg = data.data.message;
            }
        });
        app.vehicle_makePhase = function() {
            $scope.vehicle_makeTab = 'active';
            $scope.vehicle_modelTab = 'default';
            $scope.yearTab = 'default';
            $scope.engine_sizeTab = 'default';
            $scope.colourTab = 'default';
            $scope.MOT_dateTab = 'default';
            $scope.tax_dateTab = 'default';
            $scope.service_dateTab = 'default';
            app.phase1 = true;
            app.phase2 = false;
            app.phase3 = false;
            app.phase4 = false;
            app.phase5 = false;
            app.phase6 = false;
            app.phase7 = false;
            app.phase8 = false;
            app.errorMsg = false;
        };
        app.vehicle_modelPhase = function() {
            $scope.vehicle_makeTab = 'default';
            $scope.vehicle_modelTab = 'active';
            $scope.yearTab = 'default';
            $scope.engine_sizeTab = 'default';
            $scope.colourTab = 'default';
            $scope.MOT_dateTab = 'default';
            $scope.tax_dateTab = 'default';
            $scope.service_dateTab = 'default';
            app.phase1 = false;
            app.phase2 = true;
            app.phase3 = false;
            app.phase4 = false;
            app.phase5 = false;
            app.phase6 = false;
            app.phase7 = false;
            app.phase8 = false;
            app.errorMsg = false;
        };
        app.yearPhase = function() {
            $scope.vehicle_makeTab = 'default';
            $scope.vehicle_modelTab = 'default';
            $scope.yearTab = 'active';
            $scope.engine_sizeTab = 'default';
            $scope.colourTab = 'default';
            $scope.MOT_dateTab = 'default';
            $scope.tax_dateTab = 'default';
            $scope.service_dateTab = 'default';
            app.phase1 = false;
            app.phase2 = false;
            app.phase3 = true;
            app.phase4 = false;
            app.phase5 = false;
            app.phase6 = false;
            app.phase7 = false;
            app.phase8 = false;
            app.errorMsg = false;
        };
        app.engine_sizePhase = function() {
            $scope.vehicle_makeTab = 'default';
            $scope.vehicle_modelTab = 'default';
            $scope.yearTab = 'default';
            $scope.engine_sizeTab = 'active';
            $scope.colourTab = 'default';
            $scope.MOT_dateTab = 'default';
            $scope.tax_dateTab = 'default';
            $scope.service_dateTab = 'default';
            app.phase1 = false;
            app.phase2 = false;
            app.phase3 = false;
            app.phase4 = true;
            app.phase5 = false;
            app.phase6 = false;
            app.phase7 = false;
            app.phase8 = false;
            app.errorMsg = false;
        };
        app.colourPhase = function() {
            $scope.vehicle_makeTab = 'default';
            $scope.vehicle_modelTab = 'default';
            $scope.yearTab = 'default';
            $scope.engine_sizeTab = 'default';
            $scope.colourTab = 'active';
            $scope.MOT_dateTab = 'default';
            $scope.tax_dateTab = 'default';
            $scope.service_dateTab = 'default';
            app.phase1 = false;
            app.phase2 = false;
            app.phase3 = false;
            app.phase4 = false;
            app.phase5 = true;
            app.phase6 = false;
            app.phase7 = false;
            app.phase8 = false;
            app.errorMsg = false;
        };
        app.MOT_datePhase = function() {
            $scope.vehicle_makeTab = 'default';
            $scope.vehicle_modelTab = 'default';
            $scope.yearTab = 'default';
            $scope.engine_sizeTab = 'default';
            $scope.colourTab = 'default';
            $scope.MOT_dateTab = 'active';
            $scope.tax_dateTab = 'default';
            $scope.service_dateTab = 'default';
            app.phase1 = false;
            app.phase2 = false;
            app.phase3 = false;
            app.phase4 = false;
            app.phase5 = false;
            app.phase6 = true;
            app.phase7 = false;
            app.phase8 = false;
            app.errorMsg = false;
        };
        app.tax_datePhase = function() {
            $scope.vehicle_makeTab = 'default';
            $scope.vehicle_modelTab = 'default';
            $scope.yearTab = 'default';
            $scope.engine_sizeTab = 'default';
            $scope.colourTab = 'default';
            $scope.MOT_dateTab = 'default';
            $scope.tax_dateTab = 'active';
            $scope.service_dateTab = 'default';
            app.phase1 = false;
            app.phase2 = false;
            app.phase3 = false;
            app.phase4 = false;
            app.phase5 = false;
            app.phase6 = false;
            app.phase7 = true;
            app.phase8 = false;
            app.errorMsg = false;
        };
        app.service_datePhase = function() {
            $scope.vehicle_makeTab = 'default';
            $scope.vehicle_modelTab = 'default';
            $scope.yearTab = 'default';
            $scope.engine_sizeTab = 'default';
            $scope.colourTab = 'default';
            $scope.MOT_dateTab = 'default';
            $scope.tax_dateTab = 'default';
            $scope.service_dateTab = 'active';
            app.phase1 = false;
            app.phase2 = false;
            app.phase3 = false;
            app.phase4 = false;
            app.phase5 = false;
            app.phase6 = false;
            app.phase7 = false;
            app.phase8 = true;
            app.errorMsg = false;
        };
        app.updateMake = function(newMake, valid) {
            app.errorMsg = false;
            app.disabled = true;
            var vehicleObject = {};
    
            if (valid) {
                vehicleObject._id = app.currentVehicle;
                vehicleObject.vehicle_make = $scope.newMake;
                Vehicle.editedVehicle(vehicleObject).then(function(data) {
                    if (data.data.success) {
                        app.successMsg = data.data.message;
                        $timeout(function() {
                            app.makeForm.vehicle_make.$setPristine();
                            app.makeForm.vehicle_make.$setUntouched();
                            app.successMsg = false;
                            app.disabled = false;
                        }, 2000);
                    } else {
                        app.errorMsg = data.data.message;
                        app.disabled = false;
                    }
                });
    
            }else {
                app.errorMsg = "Please fill out correctly"
                app.disabled = false;
            }
        };
        app.updateModel = function(newModel, valid) {
            app.errorMsg = false;
            app.disabled = true;
            var vehicleObject = {};
    
            if (valid) {
                vehicleObject._id = app.currentVehicle;
                vehicleObject.vehicle_model = $scope.newModel;
                Vehicle.editedVehicle(vehicleObject).then(function(data) {
                    if (data.data.success) {
                        app.successMsg = data.data.message;
                        $timeout(function() {
                            app.modelForm.vehicle_model.$setPristine();
                            app.modelForm.vehicle_model.$setUntouched();
                            app.successMsg = false;
                            app.disabled = false;
                        }, 2000);
                    } else {
                        app.errorMsg = data.data.message;
                        app.disabled = false;
                    }
                });
    
            }else {
                app.errorMsg = "Please fill out correctly"
                app.disabled = false;
            }
        };
        app.updateYear = function(newYear, valid) {
            app.errorMsg = false;
            app.disabled = true;
            var vehicleObject = {};
    
            if (valid) {
                vehicleObject._id = app.currentVehicle;
                vehicleObject.year = $scope.newYear;
                Vehicle.editedVehicle(vehicleObject).then(function(data) {
                    if (data.data.success) {
                        app.successMsg = data.data.message;
                        $timeout(function() {
                            app.yearForm.year.$setPristine();
                            app.yearForm.year.$setUntouched();
                            app.successMsg = false;
                            app.disabled = false;
                        }, 2000);
                    } else {
                        app.errorMsg = data.data.message;
                        app.disabled = false;
                    }
                });
    
            }else {
                app.errorMsg = "Please fill out correctly"
                app.disabled = false;
            }
        };
        app.updateEngineSize = function(newEngine_size, valid) {
            app.errorMsg = false;
            app.disabled = true;
            var vehicleObject = {};
    
            if (valid) {
                vehicleObject._id = app.currentVehicle;
                vehicleObject.engine_size = $scope.newEngine_size;
                Vehicle.editedVehicle(vehicleObject).then(function(data) {
                    if (data.data.success) {
                        app.successMsg = data.data.message;
                        $timeout(function() {
                            app.engineSizeForm.engine_size.$setPristine();
                            app.engineSizeForm.engine_size.$setUntouched();
                            app.successMsg = false;
                            app.disabled = false;
                        }, 2000);
                    } else {
                        app.errorMsg = data.data.message;
                        app.disabled = false;
                    }
                });
    
            }else {
                app.errorMsg = "Please fill out correctly"
                app.disabled = false;
            }
        };
        app.updateColour = function(newColour, valid) {
            app.errorMsg = false;
            app.disabled = true;
            var vehicleObject = {};
    
            if (valid) {
                vehicleObject._id = app.currentVehicle;
                vehicleObject.colour = $scope.newColour;
                Vehicle.editedVehicle(vehicleObject).then(function(data) {
                    if (data.data.success) {
                        app.successMsg = data.data.message;
                        $timeout(function() {
                            app.colourForm.colour.$setPristine();
                            app.colourForm.colour.$setUntouched();
                            app.successMsg = false;
                            app.disabled = false;
                        }, 2000);
                    } else {
                        app.errorMsg = data.data.message;
                        app.disabled = false;
                    }
                });
    
            }else {
                app.errorMsg = "Please fill out correctly"
                app.disabled = false;
            }
        };
        app.updateMot = function(newMOT, valid) {
            app.errorMsg = false;
            app.disabled = true;
            var vehicleObject = {};
    
            if (valid) {
                vehicleObject._id = app.currentVehicle;
                vehicleObject.vehicle_model = $scope.newMOT;
                Vehicle.editedVehicle(vehicleObject).then(function(data) {
                    if (data.data.success) {
                        app.successMsg = data.data.message;
                        $timeout(function() {
                            app.motForm.MOT_date.$setPristine();
                            app.motForm.MOT_date.$setUntouched();
                            app.successMsg = false;
                            app.disabled = false;
                        }, 2000);
                    } else {
                        app.errorMsg = data.data.message;
                        app.disabled = false;
                    }
                });
    
            }else {
                app.errorMsg = "Please fill out correctly"
                app.disabled = false;
            }
        };
        app.updateTax = function(newTax, valid) {
            app.errorMsg = false;
            app.disabled = true;
            var vehicleObject = {};
    
            if (valid) {
                vehicleObject._id = app.currentVehicle;
                vehicleObject.tax_date = $scope.newTax;
                Vehicle.editedVehicle(vehicleObject).then(function(data) {
                    if (data.data.success) {
                        app.successMsg = data.data.message;
                        $timeout(function() {
                            app.taxForm.tax_date.$setPristine();
                            app.taxForm.tax_date.$setUntouched();
                            app.successMsg = false;
                            app.disabled = false;
                        }, 2000);
                    } else {
                        app.errorMsg = data.data.message;
                        app.disabled = false;
                    }
                });
    
            }else {
                app.errorMsg = "Please fill out correctly"
                app.disabled = false;
            }
        };
        app.updateService = function(newService, valid) {
            app.errorMsg = false;
            app.disabled = true;
            var vehicleObject = {};
    
            if (valid) {
                vehicleObject._id = app.currentVehicle;
                vehicleObject.service_date = $scope.newService;
                Vehicle.editedVehicle(vehicleObject).then(function(data) {
                    if (data.data.success) {
                        app.successMsg = data.data.message;
                        $timeout(function() {
                            app.serviceForm.service_date.$setPristine();
                            app.serviceForm.service_date.$setUntouched();
                            app.successMsg = false;
                            app.disabled = false;
                        }, 2000);
                    } else {
                        app.errorMsg = data.data.message;
                        app.disabled = false;
                    }
                });
    
            }else {
                app.errorMsg = "Please fill out correctly"
                app.disabled = false;
            }
        };

    });
    