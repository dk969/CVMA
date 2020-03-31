angular.module('businessController', ['businessServices'])

    .controller('businessController', function($http, $location, $timeout, Business) {
        var app = this;
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
    });
    