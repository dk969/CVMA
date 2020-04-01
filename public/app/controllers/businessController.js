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
    });
    