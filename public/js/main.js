//name of module and array of dependent modules
var app =angular
    .module('intranet', ['ngRoute'])
    .config(function($routeProvider, $locationProvider, $httpProvider) {

      var checkLoggedin = function($q, $timeout, $http, $location, $rootScope,$window){
        // Initialize a new promise
        console.log('in checklogged in function');
        var deferred = $q.defer();

        // Make an AJAX call to check if the user is logged in
        $http.get('/loggedin').success(function(user){
          // Authenticated
          console.log(user);
          if (user !== '0'){
            /*$timeout(deferred.resolve, 0);*/
            console.log("LOGGED IN SHOULD FORWARD NOW")
            deferred.resolve();
          }


          // Not Authenticated
          else {
          console.log('not logged in please do so');
            //$timeout(function(){deferred.reject();}, 0);
            deferred.reject();
          $window.location.href = '/login';
          }
        });

        return deferred.promise;
      };
      //================================================

      //================================================
      // Add an interceptor for AJAX errors
      // //================================================
      // $httpProvider.interceptors.push(function($q, $location) {
      //   return {
      //     response: function(response) {
      //       // do something on success
      //       console.log('success');
      //       return response;
      //     },
      //     responseError: function(response) {
      //       console.log('respone error interceptor');
      //       if (response.status === 401)
      //         $location.url('/login');
      //       return $q.reject(response);
      //     }
      //   };
      // });


        $routeProvider
            .when('/',{
                templateUrl: '/templates/index.html',
                resolve: {
                 // loggedin: checkLoggedin
                }
            })
            .when('/search/:query',{
                templateUrl: '/templates/search.html',
                controller: 'SearchController',
                controllerAs: 'vm',
                resolve: {
                    search_query: function ($route, $location){
                        var query = $route.current.params.query;
                        return query;
                    }
                }
            })
            .when('/forms', {
                templateUrl: '/templates/forms.html',
            })
            .when('/contact', {
                templateUrl: '/templates/contact.html',
            })
            .when('/mserv', {
                templateUrl: '/templates/management_services.html',
            })
            .when('/page-edit/:page_id', {
                templateUrl:'/templates/page-editor.html',
                controller: 'PageEditor',
                controllerAs: 'vm',
                resolve: {
                    resolve_pageid: function($route,$location){
                        var page_id = $route.current.params.page_id;
                        return page_id;
                    }
                }
            })
            .when('/announcement-edit/:division_id', {
                templateUrl:'/templates/announcement-editor.html',
                controller: 'AnnouncementEditor',
                controllerAs: 'vm',
                resolve: {
                    resolve_division_id: function($route){
                        var division_id = $route.current.params.division_id;
                        return division_id;
                    }
                }
            })
            .when('/profile',{
              templateUrl:'/templates/user_profile.html',
              controller:'profileCtrl',
              controllerAs:'vm'
            })
            .when('/hr', {
                templateUrl: '/templates/hr/hr-main.html',
                controller: 'PageController',
                controllerAs: 'vm',
            })
            .when('/alerts', {
                templateUrl: '/templates/alerts.html',
                controller: 'alertCtrl',
                controllerAs: 'vm'
            })
            .when('/:name', {
                templateUrl: '/templates/hr/hr-main.html',
                controller: 'PageControllerName',
                controllerAs: 'vm',
                resolve: {
                    resolve_page_name: function($route, $http,$location, $q){
                        console.log($route.current.params.name);
                        //return $route.current.params.name;
                        //Fetching the particular page. and send the page_id as payload data to
                        //the endpoint which in turn fetches from the DB with the page ID.
                        // var initInjector = angular.injector(['ng']);
                        // var $http = initInjector.get('$http');
                        var post_data = JSON.stringify(
                            {
                                'page_name' : $route.current.params.name
                            }
                        );
                        return $http.post('/get_page_from_name', post_data).then(function(response){
                            console.log('response:'+response);
                            return response.data;

                        });


                        // var division_id = $route.current.params.division_id;
                    }
                }
            });
            // use the HTML5 History API
            $locationProvider.html5Mode(true);
    })
.controller('HomeController', function($location, $http) {
    var vm = this;
    console.log("CHEWEY WE'RE HOME");

    vm.sideBar = [];
    vm.sidebarHR = [
        {
            linkTitle: "Admin Memos",
            linkUrl: ""
        },
        {
            linkTitle: "Career",
            linkUrl: ""
        },
        {
            linkTitle: "FAQ",
            linkUrl: ""
        },
        {
            linkTitle: "News",
            linkUrl: ""
        },
        {
            linkTitle: "Forms",
            linkUrl: ""
        },
        {
            linkTitle: "Employees",
            linkUrl: ""
        },
        {
            linkTitle: "Management Services",
            linkUrl: ""
        }
    ];


    vm.page_data;
    //Fetching the particular page. and send the page_id as payload data to
    //the endpoint which in turn fetches from the DB with the page ID.
    $http.post('/get_apps')
    .success(function(data){
        //console.log(Object.values(data));
        vm.page_data = data;
    });


    //console.log("here");
    vm.searchBox = function(eventCode){
        if(eventCode == 13){
            $location.path('/search/'+vm.searchQuery);
        }
    };

    vm.populateSidebar = function(pageCode){
        switch(pageCode){
            case 1:
                break;
            case 2:
                break;
            case 4:
                console.log("hr bar links");
                sideBar=vm.sidebarHR.slice();
                sideBar.reverse();
                break;
        }
    }
});

app.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);

// Additional JS for the Meu
$(".link-element a").mouseover(function() {
    //$(".link-element").css("border","none");
    $(this).css( "border", "1px solid white" );
});

$(".link-element").mouseleave(function() {
    $(".link-element a").css("border","none");
});
