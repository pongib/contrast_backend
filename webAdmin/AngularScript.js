var adminApp = angular.module('adminApp', ['ngRoute', 'test.service']);
      var testResult = "";
      adminApp.config(function($locationProvider, $routeProvider){
        $routeProvider.
          when('/', {
              template: '<h1>808 Not found</h1><p>OK jub jub!</p>',
              access: { requiredLogin: false }
          }).
          when('/suggest', {
            templateUrl: 'suggest.html',
            controller: 'Suggest',
            access: { requiredLogin: true}
          }).
          when('/report', {
            templateUrl: 'report.html',
            controller: 'Report',
            access: {requiredLogin: true}
          }).
          when('/admin/login', {
              templateUrl: 'login.html',
              controller: 'AdminUserCtrl',
              access: { requiredLogin: false }
          }).
          when('/admin/logout', {
              templateUrl: 'login.html',
              controller: 'AdminUserCtrl',
              access: { requiredLogin: true }
          }).
          otherwise({
              redirectTo: '/admin/login'
          });
      });
      
      adminApp.run(function($rootScope, $location, AuthenticationService, $window, servicePrint) {
        servicePrint.print();

        $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
        	console.log("nextRoute.access.requiredLogin = "+nextRoute.access.requiredLogin);
        	console.log("AuthenticationService.isLogged = "+AuthenticationService.isLogged);
        	console.log("$window.sessionStorage.auth = "+$window.sessionStorage.auth);
        	console.log("$window.sessionStorage.token = "+$window.sessionStorage.token);

            if (nextRoute.access.requiredLogin && !AuthenticationService.isLogged) {
                $location.path("/admin/login");
            }
        });
      });

      adminApp.factory('AuthenticationService', function($window){
        return  {
          isLogged: $window.sessionStorage.auth
        }
         // $window.sessionStorage.auth;
      });

      adminApp.factory('UserService', function($http, $window , $location, AuthenticationService){
        return {
            login: function(username, password){
              return $http({
                method: 'POST',
                url: 'http://127.0.0.1:9000/admin/login',
                data: {'username': username, 'password': password}
              });            
            },
            logout: function(){
              if(AuthenticationService.isLogged){
                AuthenticationService.isLogged = false;
                delete $window.sessionStorage.auth;
                delete $window.sessionStorage.token;
                $location.path("/admin/login");
              }
            }
        }
      });

      adminApp.factory('TokenInterceptor', function($q, $window){
        return {
          request: function(config){
            config.headers = config.headers || {};
            if($window.sessionStorage.token){
              config.headers.Authorization = 'Bearer '+ $window.sessionStorage.token;
              console.log("Last "+config.headers.Authorization);
            }
            return config;
          },

          response: function(response){
            return response || $q.when(response);
          }

        };
      });

      adminApp.config(function($httpProvider){
        $httpProvider.interceptors.push('TokenInterceptor');
      });

      // adminApp.factory('authInterceptor', function ($rootScope, $q, $window) {
      //   return {
      //     request: function (config) {
      //       config.headers = config.headers || {};
      //       if ($window.sessionStorage.token) {
      //         config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
      //       }
      //       return config;
      //     },
      //     responseError: function (rejection) {
      //       if (rejection.status === 401) {
      //         // handle the case where the user is not authenticated
      //       }
      //       return $q.reject(rejection);
      //     }
      //   };
      // });

      // adminApp.config(function ($httpProvider) {
      //   $httpProvider.interceptors.push('authInterceptor');
      // });

      adminApp.controller('AdminUserCtrl', function($scope, $location, $window, UserService, AuthenticationService, geoLocation){
      
        //Admin User Controller (login, logout)
        $scope.login = function(username, password){
          if(username !== undefined && password !== undefined){
            UserService.login(username, password).success(function(data){
              AuthenticationService.isLogged = true;
              $window.sessionStorage.auth = true;
              $window.sessionStorage.token = data.token;
              console.log("First "+ $window.sessionStorage.token);            
              testResult = data.token;
              $location.path('/suggest');
            }).error(function(status, data){
                console.log(status);
                console.log(data);
                $scope.wrong = status; 
                alert(status);
            });
          }
        }

        $scope.logout = function(){
          if(AuthenticationService.isLogged){
            AuthenticationService.isLogged = false;
            delete $window.sessionStorage.token;
            $location.path("/");
          }
        }


        $scope.clear = function(){
          $scope.geo = "";
        };

        $scope.setGeo = function(geo){
          geoLocation.setGeolocation(geo.lat, geo.lng);
        };

        $scope.getGeo = function(){
          $scope.showGeo = geoLocation.getGeolocation();
        }

        $scope.delGeo = function(){
          geoLocation.delGeolocation();
        }

        $scope.range = 20;
      });

      // adminApp.factory('countries', function($http){
      //   var cacheData;
      //   function getData(callback){
      //     if(cacheData){
      //       return callback(cacheData);
      //     }else {
      //       $http.get('countries.json').success(function(data){
      //         cacheData = data;
      //         callback(cacheData);
      //       });
      //     }
      //   }
      //   return {
      //     list: getData,
      //     find: function(name, callback){
      //       getData(function(data){
      //         var country = data.filter(function(entry){
      //           return entry.name === name;
      //         })[0];
      //         callback(country);
      //       });
      //     }
      //   };
      // });

      adminApp.controller('Suggest', function($scope, $http, $window, UserService){
        $http({
          method: 'GET',
          url: 'http://127.0.0.1:9000/admin/suggest',
          cache: false
        }).success(function(data){
          $scope.suggest = data;
        });

        $scope.removeSuggest = function(id){
          var i = $scope.suggest.indexOf(id);
          $scope.index = i;
          $scope.prop = id;
          $scope.suggest.splice(i, 1);
          $scope.removeStatus = "OK";
        };

        $scope.accept = function(id, name, category, index){
          console.log("id "+id+" name: "+name+" category: "+category);
          $http({
            method: 'POST',
            url: 'http://127.0.0.1:9000/admin/create/person',
            data: {'id': id, 'name': name , 'category': category}
          }).success(function(data){
            $scope.status = data;          
          });
          $scope.name = name;
          $scope.category = category;
          $scope.removeSuggest(index);  
        };
        $scope.result = testResult;

        $scope.logout = function(){
          UserService.logout();
        };
      

      });

      adminApp.controller('Report', function($scope, $http, UserService){
         $http({
          method: 'GET',
          url: 'http://127.0.0.1:9000/admin/report',
          cache: false
        }).success(function(data){
          $scope.report = data;
        });
        
        $scope.delete = function(personid, index){
          $http({
            method: 'POST',
            url: 'http://127.0.0.1:9000/admin/delete/person',
            data: {'personid': personid}
          }).success(function(data){
            $scope.status = data;          
          });
          $scope.personid = personid;
          $scope.removeReport(index);

        };

        $scope.removeReport = function(id){
          var i = $scope.report.indexOf(id);
          $scope.index = i;
          $scope.prop = id;
          $scope.report.splice(i, 1);
          $scope.removeStatus = "OK";
        };

        $scope.logout = function(){
          UserService.logout();
        };

      });

     //  adminApp.controller('Login', function($http){
	    // $scope.login = function(username, password){
	    //   	$http({
	    //   		method: 'POST',
	    //   		url: 'http://25.26.223.160:9000/admin/login'
	    //   		data: {'username': username, 'password': password}
	    //   	}).success(function(data){
	    //   		$scope.status = data;
	    //   	});
	    // }
     //  });

     
      // adminApp.controller('CountryDetailCtrl', function($scope, $routeParams, $http, countries){
      //   countries.find($routeParams.countryName, function(data){
      //     $scope.country = data;
      //   });
      //   $scope.name = $routeParams.countryName;
      //   $http.get('countries.json').success(function(data){
      //     var x = 0;
      //     $scope.country = data.filter(function(entry, index){
      //       return entry.name === $scope.name;
      //     })[0];
      //     console.log($scope.country); 
      //   });
      // });

  