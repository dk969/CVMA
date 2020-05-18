angular.module('businessController', ['businessServices'])

    .controller('businessController', function( $location, $timeout, Business, User, $scope, $routeParams) {
        var app = this;
        app.loading = true;
        app.accessDenied = true;
        app.errorMsg = false;
        app.limit = 50;
        app.searchLimit = 0; 
        app.authorized = false; 
        //collects data from business form and posts it on the database
        app.conAdd = function(busData) {
            app.loading = true;
            app.errorMsg = false;
            Business.create(app.busData).then(function(data) {   
                if (data.data.success) {
                    app.loading = false;
                    app.successMsg = data.data.message + '...Redirecting';//Sends a redirecting message
                    $timeout(function() {
                        $location.path('/businesslist');//redirects to the businesslist html
                    }, 2000)//Waits for 2 seconds
                } else {
                    app.loading = false;
                    app.errorMsg = data.data.message;
                }
            });
        };
        //Get the businesses and sets what permissions have edit and delete access
        function getBusinesses() {
            Business.getBusinesses().then(function(data) {
                app.editAccess = false;
                app.deleteAccess = false;
                if (data.data.success) {
                    if (data.data.permission === 'admin' || data.data.permission === 'moderator'|| data.data.permission === 'user') {
                        app.companies = data.data.companies;
                        app.vehicles = data.data.vehicles;
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
    
    getBusinesses();
         //shows more businesses depending on the number the user inputted
    app.showMore = function(number) {
        app.showMoreError = false;
        if (number > 0) {
            app.limit = number;
        } else {
            app.showMoreError = "Please enter a valid number";
        }
    };
    //shows all of the businesses
    app.showAll = function() {
        app.limit = undefined;
        showMoreError = false;
    };
    
    //removes business by the business id
    app.deleteBusiness = function(_id) {
        Business.deleteBusiness(_id).then(function(data) {
            if (data.data.success) {
                    getBusinesses();
            } else {
                app.showMoreError = data.data.message;
            }
        });
    };
    //Searches through the businesses using the keywork the user inputted
    app.search = function(searchKeyword, number) {

        if (searchKeyword) {
            if (searchKeyword.length > 0) {
                app.limit = 0;
                $scope.searchFilter = searchKeyword;
                app.limit = number;

            } else {
                $scope.searchFilter = undefined;
                app.limit = 0;
            }
        } else {
            $scope.searchFilter = undefined;
            app.limit = 0;
        }

    };
    //clears the search
    app.clear = function() {
        $scope.number = 'Clear';
        app.limit = 50;
        $scope.searchFilter = undefined;
        $scope.searchKeyword = undefined;
        app.showMoreError = false;
    };
    //Advance search, using mutliple inputs to narrow down the businesses
    app.advancedSearch = function(searchByName, searchByType, searchByPostcode, searchBySpecialization ) {
        if (searchByName || searchByType || searchByPostcode || searchBySpecialization) {
            $scope.advancedSearchFilter = {};
            if (searchByName) {
                $scope.advancedSearchFilter.business_name = searchByName;
            }
            if (searchByType) {
                $scope.advancedSearchFilter.business_type = searchByType;
            }
            if (searchByPostcode) {
                $scope.advancedSearchFilter.business_postcode = searchByPostcode;
            }
            if(searchBySpecialization) {
                $scope.advancedSearchFilter.specialization = searchBySpecialization;
            }
            app.searchLimit = undefined;
        }
    };  
    //sorts the businesses 
    app.sortOrder = function(order) {
        app.sort = order;
    };
})

.controller('getController', function($scope, $routeParams, Business, $timeout, $location) {
    var app = this;

        
    app.loading = true;
    app.accessDenied = true;
    app.errorMsg = false;
    app.authorized = false;
    //Gets a business and its reviews by its ID
    function getBus() {
    Business.getBusinessID($routeParams.id).then(function(data) {
        if (data.data.success) {
            app.removeAccess = false;
            if (data.data.permission === 'admin' || data.data.permission === 'moderator'|| data.data.permission === 'user') {
                        $scope.company = data.data.company;
                        $scope.reviews = data.data.review;
                        $scope.user = data.data.user;
                       // Find average of the ratings:
                        var sum = 0;
                        for (var i = 0; i < $scope.reviews.length; i++) {
                            sum += $scope.reviews[i].rating;
                        }
                        var average = sum / $scope.reviews.length;
                        //rounds up to one decimal place
                        var rounded = Math.round(average * 10) / 10
                        $scope.rate = rounded;
                        app.loading = false;
                        app.accessDenied = false;
                        if (data.data.permission === 'admin') {
                            app.removeAccess = true;
                            app.authorized = true;
                        }  else if ($scope.company.author.id === $scope.user._id){
                            app.removeAccess = true;
                            app.authorized = true;
                        }  
                    } else {
                        app.errorMsg = 'Insufficient Permissions';
                        app.loading = false;
                    }

        } else {
            app.errorMsg = data.data.message;
        }
    });
};
    getBus();

    app.revAdd = function(revData) {
        app.loading = true;
        app.errorMsg = false;
        
        
        Business.createReview(app.revData).then(function(data) {
            
            if (data.data.success) {
                app.loading = false;
                app.successMsg = data.data.message + '...Redirecting';
                $timeout(function() {
                    $location.path('/businesslist');
                }, 2000)
            } else {
                app.loading = false;
                app.errorMsg = data.data.message;
            }

        });
    };

    app.deleteReview = function(_id) {
        Business.deleteReview(_id).then(function(data) {
            if (data.data.success) {
                   getBus();    
            } else {
                app.showMoreError = data.data.message;
            }
        });
    };
})
//Update business controller
.controller('editBusController', function($scope, $routeParams, Business, $timeout) {
    var app = this;
    $scope.business_nameTab = 'active';
    app.phase1 = true;
    //Sets the businesses details as new varibles 
    Business.getBusiness($routeParams.id).then(function(data) {
        if (data.data.success) {
            $scope.newName = data.data.business.business_name;
            $scope.newType =data.data.business.business_type;
            $scope.newAddress = data.data.business.business_address;
            $scope.newPostcode = data.data.business.business_postcode;
            $scope.newEmail = data.data.business.business_email;
            $scope.newWebsite = data.data.business.website;
            $scope.newContact = data.data.business.business_contact;
            $scope.newSpecialization = data.data.business.specialization;
            app.currentBusiness = data.data.business._id;
            
           
        } else { 
            app.errorMsg = data.data.message;
        }
    });
    
    //Controls the different tabs depending on what the user selects
    app.business_namePhase = function() {
        $scope.business_nameTab = 'active';//The active table is the one which shows
        $scope.business_typeTab = 'default';
        $scope.business_addressTab = 'default';
        $scope.business_postcodeTab = 'default';
        $scope.websiteTab = 'default';
        $scope.business_emailTab = 'default';
        $scope.business_contactTab = 'default';
        $scope.specializationTab = 'default';
        app.phase1 = true;//This links the html displaying the form when true
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
    //Updates the individual elements 
    app.updateName = function(newName, valid) {
        app.errorMsg = false;
        app.disabled = true;
        var businessObject = {};//creates a blank object
        if (valid) {
            businessObject._id = app.currentBusiness;//sets the object ID to the business ID
            businessObject.business_name = $scope.newName;//sets the object name to the NEW business name
            Business.editedBusiness(businessObject).then(function(data) {
                if (data.data.success) {
                    app.successMsg = data.data.message;
                    $timeout(function() {//Creates a timeout of 2 seconds
                        app.nameForm.business_name.$setPristine();//Resets form
                        app.nameForm.business_name.$setUntouched();//Sets the form to its untouched state
                        app.successMsg = false;
                        app.disabled = false;
                    }, 2000);
                } else {
                    app.errorMsg = data.data.message;
                    app.disabled = false;
                }
            });
        } else {
            app.errorMsg = "Please fill out correctly"
            app.disabled = false;
        }
    };
    //Repeated as above but updated the type instead
    app.updateType = function(newType, valid) {
        app.errorMsg = false;
        app.disabled = true;
        var businessObject = {};
        if (valid) {
            businessObject._id = app.currentBusiness;
            businessObject.business_type = $scope.newType;
            Business.editedBusiness(businessObject).then(function(data) {
                if (data.data.success) {
                    app.successMsg = data.data.message;
                    $timeout(function() {
                        app.typeForm.business_type.$setPristine();
                        app.typeForm.business_type.$setUntouched();
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
    app.updateAddress = function(newAddress, valid) {
        app.errorMsg = false;
        app.disabled = true;
        var businessObject = {};
        if (valid) {
            businessObject._id = app.currentBusiness;
            businessObject.business_address = $scope.newAddress;
            Business.editedBusiness(businessObject).then(function(data) {
                if (data.data.success) {
                    app.successMsg = data.data.message;
                    $timeout(function() {
                        app.addressForm.business_address.$setPristine();
                        app.addressForm.business_address.$setUntouched();
                        app.successMsg = false;
                        app.disabled = false;
                    }, 2000);
                } else {
                    app.errorMsg = data.data.message;
                    app.disabled = false;
                }
            });
        } else {
            app.errorMsg = "Please fill out correctly"
            app.disabled = false;
        }
    };
    app.updatePostcode = function(newPostcode, valid) {
        app.errorMsg = false;
        app.disabled = true;
        var businessObject = {};
        if (valid) {
            businessObject._id = app.currentBusiness;
            businessObject.business_postcode = $scope.newPostcode;
            Business.editedBusiness(businessObject).then(function(data) {
                if (data.data.success) {
                    app.successMsg = data.data.message;
                    $timeout(function() {
                        app.postcodeForm.business_postcode.$setPristine();
                        app.postcodeForm.business_postcode.$setUntouched();
                        app.successMsg = false;
                        app.disabled = false;
                    }, 2000);
                } else {
                    app.errorMsg = data.data.message;
                    app.disabled = false;
                }
            });
        } else {
            app.errorMsg = "Please fill out correctly"
            app.disabled = false;
        }
    };
    app.updateWebsite = function(newWebsite, valid) {
        app.errorMsg = false;
        app.disabled = true;
        var businessObject = {};
        if (valid) {
            businessObject._id = app.currentBusiness;
            businessObject.website = $scope.newWebsite;
            Business.editedBusiness(businessObject).then(function(data) {
                if (data.data.success) {
                    app.successMsg = data.data.message;
                    $timeout(function() {
                        app.websiteForm.website.$setPristine();
                        app.websiteForm.website.$setUntouched();
                        app.successMsg = false;
                        app.disabled = false;
                    }, 2000);
                } else {
                    app.errorMsg = data.data.message;
                    app.disabled = false;
                }
            });
        } else {
            app.errorMsg = "Please fill out correctly"
            app.disabled = false;
        }
    };
    app.updateEmail = function(newEmail, valid) {
        app.errorMsg = false;
        app.disabled = true;
        var businessObject = {};
        if (valid) {
            businessObject._id = app.currentBusiness;
            businessObject.business_email = $scope.newEmail;
            Business.editedBusiness(businessObject).then(function(data) {
                if (data.data.success) {
                    app.successMsg = data.data.message;
                    $timeout(function() {
                        app.emailForm.business_email.$setPristine();
                        app.emailForm.business_email.$setUntouched();
                        app.successMsg = false;
                        app.disabled = false;
                    }, 2000);
                } else {
                    app.errorMsg = data.data.message;
                    app.disabled = false;
                }
            });
        } else {
            app.errorMsg = "Please fill out correctly"
            app.disabled = false;
        }
    };
    app.updateContact = function(newContact, valid) {
        app.errorMsg = false;
        app.disabled = true;
        var businessObject = {};
        if (valid) {
            businessObject._id = app.currentBusiness;
            businessObject.business_contact = $scope.newContact;
            Business.editedBusiness(businessObject).then(function(data) {
                if (data.data.success) {
                    app.successMsg = data.data.message;
                    $timeout(function() {
                        app.contactForm.business_contact.$setPristine();
                        app.contactForm.business_contact.$setUntouched();
                        app.successMsg = false;
                        app.disabled = false;
                    }, 2000);
                } else {
                    app.errorMsg = data.data.message;
                    app.disabled = false;
                }
            });
        } else {
            app.errorMsg = "Please fill out correctly"
            app.disabled = false;
        }
    };
    app.updateSpecialization = function(newSpecialization, valid) {
        app.errorMsg = false;
        app.disabled = true;
        var businessObject = {};
        if (valid) {
            businessObject._id = app.currentBusiness;
            businessObject.specialization = $scope.newSpecialization;
            Business.editedBusiness(businessObject).then(function(data) {
                if (data.data.success) {
                    app.successMsg = data.data.message;
                    $timeout(function() {
                        app.specializationForm.specialization.$setPristine();
                        app.specializationForm.specialization.$setUntouched();
                        app.successMsg = false;
                        app.disabled = false;
                    }, 2000);
                } else {
                    app.errorMsg = data.data.message;
                    app.disabled = false;
                }
            });
        } else {
            app.errorMsg = "Please fill out correctly"
            app.disabled = false;
        }
    };
})
.controller('postController', function( $location, $timeout, BusinessPost,  $scope, ) {
    var app = this;
    app.loading = true;
    app.accessDenied = true;
    app.errorMsg = false;
    app.deleteAccess = false;
    app.limit = 5;
    app.searchLimit = 0; 
    app.authorized = false;
    

    app.postAdd = function(postData) {
        app.loading = true;
        app.errorMsg = false;
        
        //Creates a new post and uploads it to the
        BusinessPost.create(app.postData).then(function(data) {
            if (data.data.success) {
                app.loading = false;
                app.successMsg = data.data.message + '...Redirecting';
                $timeout(function() {
                    $location.path('/dashboard');
                }, 2000)
            } else {
                app.loading = false;
                app.errorMsg = data.data.message;
            }

        });
    };
    function getPosts() {
        BusinessPost.getPosts().then(function(data) {
            if (data.data.success) {
                if (data.data.permission === 'admin' || data.data.permission === 'moderator' || data.data.permission === 'user') {
                    app.posts = data.data.posts;
                    app.loading = false;
                    app.accessDenied = false;
                    if (data.data.permission === 'admin') {
                        app.deleteAccess = true;
                        app.authorized = true;
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

        getPosts();

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
        app.deletePost = function(_id) {
            BusinessPost.deletePost(_id).then(function(data) {
                if (data.data.success) {
                        getPosts();
                } else {
                    app.showMoreError = data.data.message;
                }
            });
        };
        
        app.search = function(searchKeyword, number) {
    
            if (searchKeyword) {
                if (searchKeyword.length > 0) {
                    app.limit = 0;
                    $scope.searchFilter = searchKeyword;
                    app.limit = number;
    
                } else {
                    $scope.searchFilter = undefined;
                    app.limit = 0;
                }
            } else {
                $scope.searchFilter = undefined;
                app.limit = 0;
            }
    
        };
    
        app.clear = function() {
            $scope.number = 'Clear';
            app.limit = 0;
            $scope.searchFilter = undefined;
            $scope.searchKeyword = undefined;
            app.showMoreError = false;
        };
        app.advancedSearch = function( searchByTitle, searchByName, searchByType, searchBySpecialization ) {
            if (searchByTitle || searchByName || searchByType || searchBySpecialization) {
                $scope.advancedSearchFilter = {};
                if (searchByTitle) {
                    $scope.advancedSearchFilter.business_title = searchByTitle;
                }
                if (searchByName) {
                    $scope.advancedSearchFilter.business_name = searchByName;
                }
                if (searchByType) {
                    $scope.advancedSearchFilter.business_type = searchByType;
                }
                if(searchBySpecialization) {
                    $scope.advancedSearchFilter.specialization = searchBySpecialization;
                }
                app.searchLimit = undefined;
            }
        };  
    
        app.sortOrder = function(order) {
            app.sort = order();
        };

})

.controller('subController', function( $location, $timeout, Subscribe, $scope) {
    var app = this;

    app.loading = true;
    app.accessDenied = true;
    app.errorMsg = false;
    app.viewAccess = false;
    app.deleteAccess = false;
    app.limit = 5;
    app.searchLimit = 0; 
    app.authorized = false;


    app.subAdd = function(subData) {
        app.loading = true;
        app.errorMsg = false;

        Subscribe.create(app.subData).then(function(data) {
            
            if (data.data.success) {
                app.loading = false;
                app.successMsg = data.data.message + '...Redirecting';

                $timeout(function() {
                    $location.path('/dashboard');
                }, 2000)
            } else {
                app.loading = false;
                app.errorMsg = data.data.message;
            }

        });
    };
    function getSubscribers() {
        Subscribe.getSubscribers().then(function(data) {
            
            if (data.data.success) {
                if (data.data.permission === 'admin' || data.data.permission === 'moderator' || data.data.permission === 'user') {
                    app.subscribers = data.data.subscribers;
                    app.loading = false;
                    app.accessDenied = false;
                    if (data.data.permission === 'admin') {
                        app.viewAccess = true;
                        app.deleteAccess = true;
                        app.authorized = true;
                    } else if (data.data.permission === 'moderator') {
                        app.viewAccess = true;
                        app.authorized = true;
                    } else if (data.data.permission === 'user') {
                        app.viewAccess = false;
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

     getSubscribers();


     app.deleteSub = function(_id) {
        BusinessPost.deleteSub(_id).then(function(data) {
            if (data.data.success) {
                
                getSubscribers();
                    
                
            } else {
                app.showMoreError = data.data.message;
            }
        });
    };
})
//Controller to get Posts and uploadeds made by that user
.controller('authorController', function($scope, $routeParams, Business, $timeout, BusinessPost,) {
    var app = this;
    $scope.businessTab = 'active';
    app.phase1 = true;

   
    

    app.businessPhase = function() {
        $scope.businessTab = 'active';
        $scope.offerTab = 'default';
        app.phase1 = true;
        app.phase2 = false;
        app.errorMsg = false;
    };
    app.offerPhase = function() {
        $scope.businessTab = 'default';
        $scope.offerTab = 'active';
        app.phase1 = false;
        app.phase2 = true;
        app.errorMsg = false;
    };
        
    app.loading = true;
    app.accessDenied = true;
    app.errorMsg = false;
    app.editAccess = false;
    app.deleteAccess = false;
    app.authorized = false;


        //Author Business control
        function  getAuthBusinesses(){
        Business.getAuthorBus().then(function(data) {
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
                        app.editAccess = true;
                        app.deleteAccess = true;
                        app.authorized = true;
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

        getAuthBusinesses();

        app.deleteBusiness = function(_id) {
            Business.deleteBusiness(_id).then(function(data) {
                if (data.data.success) {
                        getAuthBusinesses();
                } else {
                    app.showMoreError = data.data.message;
                }
            });
        };
        //Author Post control
        function getAuthPosts() {
        BusinessPost.getAuthorPost().then(function(data) {
            if (data.data.success) {
                if (data.data.permission === 'admin' || data.data.permission === 'moderator' || data.data.permission === 'user') {
                    app.posts = data.data.posts;
                    app.loading = false;
                    app.accessDenied = false;
                    if (data.data.permission === 'admin') {
                        app.editAccess = true;
                        app.deleteAccess = true;
                        app.authorized = true;
                    } else if (data.data.permission === 'moderator') {
                        app.editAccess = true;
                        app.deleteAccess = true;
                        app.authorized = true;
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

        getAuthPosts();

        app.deletePost = function(_id) {
            BusinessPost.deletePost(_id).then(function(data) {
                if (data.data.success) {
                        getAuthPosts();
                } else {
                    app.showMoreError = data.data.message;
                }
            });
        };
    
          //Author review control
          function getAuthRev() {
            Business.getAuthorReview().then(function(data) {
                if (data.data.success) {
                    if (data.data.permission === 'admin' || data.data.permission === 'moderator' || data.data.permission === 'user') {
                        app.review = data.data.reviews;
                        app.loading = false;
                        app.accessDenied = false;
                        if (data.data.permission === 'admin') {
                            app.editAccess = true;
                            app.deleteAccess = true;
                            app.authorized = true;
                        } else if (data.data.permission === 'moderator') {
                            app.editAccess = true;
                            app.deleteAccess = true;
                            app.authorized = true;
                        } else if (data.data.permission === 'user') {
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
    
            getAuthRev();
    
            app.deleteReview = function(_id) {
                Business.deleteReview(_id).then(function(data) {
                    if (data.data.success) {
                        
                            getAuthRev();
                            
                        
                    } else {
                        app.showMoreError = data.data.message;
                    }
                });
            };
            app.search = function(searchKeyword, number) {

                if (searchKeyword) {
                    if (searchKeyword.length > 0) {
                        app.limit = 0;
                        $scope.searchFilter = searchKeyword;
                        app.limit = number;
        
                    } else {
                        $scope.searchFilter = undefined;
                        app.limit = 0;
                    }
                } else {
                    $scope.searchFilter = undefined;
                    app.limit = 0;
                }
        
            };
        
            app.clear = function() {
                $scope.number = 'Clear';
                app.limit = 0;
                $scope.searchFilter = undefined;
                $scope.searchKeyword = undefined;
                app.showMoreError = false;
            };
})
