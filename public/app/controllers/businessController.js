angular.module('businessController', ['businessServices'])

    .controller('businessController', function( $location, $timeout, Business, User, $scope) {
        var app = this;

        
        app.loading = true;
        app.accessDenied = true;
        app.errorMsg = false;
        app.editAccess = false;
        app.deleteAccess = false;




        this.conAdd = function(busData) {
            app.loading = true;
            app.errorMsg = false;
   
            Business.create(app.busData).then(function(data) {
                
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
        function getBusinesses() {
            Business.getBusinesses().then(function(data) {
                
                if (data.data.success) {
                    if (data.data.permission === 'admin' || data.data.permission === 'moderator' || data.data.permission === 'user') {
                        app.companies = data.data.companies;
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
    
    getBusinesses();

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

    app.deleteBusiness = function(_id) {
        Business.deleteBusiness(_id).then(function(data) {
            if (data.data.success) {
                getBusinesses();
            } else {
                app.showMoreError = data.data.message;
            }
        });
    };
    

    

})

.controller('getController', function($scope, $routeParams, Business) {
    var app = this;

        
    app.loading = true;
    app.accessDenied = true;
    app.errorMsg = false;
    app.editAccess = false;
    app.deleteAccess = false;

    Business.getBusinessID($routeParams.id).then(function(data) {
        if (data.data.success) {
            if (data.data.permission === 'admin' || data.data.permission === 'moderator' || data.data.permission === 'user') {
                        $scope.company = data.data.company;
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
        }
    });

})

.controller('editBusController', function($scope, $routeParams, Business) {
    var app = this;
    $scope.business_nameTab = 'active';
    app.phase1 = true;

    Business.getBusiness($routeParams.id).then(function(data) {
        if (data.data.success) {
            console.log(data.data.business.business_name);
            $scope.newName = data.data.business.business_name;
            $scope.newType =data.data.business.business_type;
            $scope.newAddress = data.data.business.business_address;
            $scope.newPostcode = data.data.business.business_postcode;
            $scope.newEmail = data.data.business.business_email;
            $scope.newWebsite = data.data.business.website;
            $scope.newContact = data.data.business.business_contact;
            $scope.newSpecialization = data.data.business.specialization;
            
            
           
        } else { 
            app.errorMsg = data.data.message;
        }
    });
    

    app.business_namePhase = function() {
        $scope.business_nameTab = 'active';
        $scope.business_typeTab = 'default';
        $scope.business_addressTab = 'default';
        $scope.business_postcodeTab = 'default';
        $scope.websiteTab = 'default';
        $scope.business_emailTab = 'default';
        $scope.business_contactTab = 'default';
        $scope.specializationTab = 'default';
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
    app.business_typePhase = function() {
        $scope.business_nameTab = 'default';
        $scope.business_typeTab = 'active';
        $scope.business_addressTab = 'default';
        $scope.business_postcodeTab = 'default';
        $scope.websiteTab = 'default';
        $scope.business_emailTab = 'default';
        $scope.business_contactTab = 'default';
        $scope.specializationTab = 'default';
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
    app.business_addressPhase = function() {
        $scope.business_nameTab = 'default';
        $scope.business_typeTab = 'default';
        $scope.business_addressTab = 'active';
        $scope.business_postcodeTab = 'default';
        $scope.websiteTab = 'default';
        $scope.business_emailTab = 'default';
        $scope.business_contactTab = 'default';
        $scope.specializationTab = 'default';
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
    app.business_postcodePhase = function() {
        $scope.business_nameTab = 'default';
        $scope.business_typeTab = 'default';
        $scope.business_addressTab = 'default';
        $scope.business_postcodeTab = 'active';
        $scope.websiteTab = 'default';
        $scope.business_emailTab = 'default';
        $scope.business_contactTab = 'default';
        $scope.specializationTab = 'default';
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
    app.websitePhase = function() {
        $scope.business_nameTab = 'default';
        $scope.business_typeTab = 'default';
        $scope.business_addressTab = 'default';
        $scope.business_postcodeTab = 'default';
        $scope.websiteTab = 'active';
        $scope.business_emailTab = 'default';
        $scope.business_contactTab = 'default';
        $scope.specializationTab = 'default';
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
    app.business_emailPhase = function() {
        $scope.business_nameTab = 'default';
        $scope.business_typeTab = 'default';
        $scope.business_addressTab = 'default';
        $scope.business_postcodeTab = 'default';
        $scope.websiteTab = 'default';
        $scope.business_emailTab = 'active';
        $scope.business_contactTab = 'default';
        $scope.specializationTab = 'default';
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
    app.business_contactPhase = function() {
        $scope.business_nameTab = 'default';
        $scope.business_typeTab = 'default';
        $scope.business_addressTab = 'default';
        $scope.business_postcodeTab = 'default';
        $scope.websiteTab = 'default';
        $scope.business_emailTab = 'default';
        $scope.business_contactTab = 'active';
        $scope.specializationTab = 'default';
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
    app.specializationPhase = function() {
        $scope.business_nameTab = 'default';
        $scope.business_typeTab = 'default';
        $scope.business_addressTab = 'default';
        $scope.business_postcodeTab = 'default';
        $scope.websiteTab = 'default';
        $scope.business_emailTab = 'default';
        $scope.business_contactTab = 'default';
        $scope.specializationTab = 'active';
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
    app.updateName = function(newName, valid) {
        app.errorMsg = false;
        app.disabled = true;
        var businessObject = {};

        if (valid) {
            businessObject._id = app.currentUser;
            businessObject.name = $scope.newName;
            Business.editBusiness(businessObject).then(function(data) {
                if (data.data.success) {
                    app.successMsg = data.data.message;
                    $timeout(function() {
                        app.nameForm.business_name.$setPristine();
                        app.nameForm.business_name.$setUntouched();
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
    