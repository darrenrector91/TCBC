var myApp = angular.module('myApp', ['ngRoute', 'ngMaterial', 'ngAnimate', 'ngMessages', 'ngFileUpload', 'dataGrid', 'pagination', 'wt.responsive']);

/// Routes ///
myApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
     ('myApp -- config')
  $routeProvider
    .when('/', {
      redirectTo: '/landing'
    })
    .when('/landing', {
      templateUrl: '/views/landing/landing.html',
      controller: 'HomeController as vm',
      activetab: 'landing',

    })
    .when('/home', {
      templateUrl: '/views/shared/home.html',
      controller: 'HomeController as vm',
      activetab: 'home',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        }
      }
    })
    .when('/login', {
      templateUrl: '/views/shared/login.html',
      controller: 'LoginController as vm',
    })
    .when('/my-rides', {
      templateUrl: '/views/user/templates/member.myRides.html',
      controller: 'MemberMyRidesController as vm',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        }
      }
    })
    .when('/check-in/:rideId', {
      templateUrl: '/views/ride-leader/templates/check-in-view.html',
      controller: 'CheckInController as vm',
      resolve: {
        getuser: function (UserService) {
          return UserService.getRideLeader();
        }
      }
    })
    .when('/ride-leader/my-rides', {
      templateUrl: '/views/ride-leader/templates/rideLeader.myRides.html',
      controller: 'RideLeaderController as vm',
      resolve: {
        getuser: function (UserService) {
          return UserService.getRideLeader();
        }
      }
    })
    .when('/my-profile', {
      templateUrl: '/views/shared/my-stats.html',
      controller: 'MyStatsController as vm',
      activetab: 'my-profile',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        }
      }
    })
    .when('/stats', {
      templateUrl: '/views/shared/my-stats.html',
      controller: 'MyStatsController as vm',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        }
      }
    })
    .when('/manage-members', {
      templateUrl: '/views/admin/templates/manage-members.html',
      controller: 'AdminController as vm',
      resolve: {
        getuser: function (UserService) {
          return UserService.getRideAdmin();
        }
      }
    })
    .when('/manage-rides', {
      templateUrl: '/views/admin/templates/manage-rides.html',
      controller: 'AdminController as vm',
      resolve: {
        getuser: function (UserService) {
          return UserService.getRideAdmin();
        }
      }
    })
    .when('/register', {
      templateUrl: '/views/shared/register.html',
      controller: 'LoginController as vm'
    })
    .when('/user', {
      templateUrl: '/views/user/templates/user.html',
      controller: 'UserController as vm',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        }
      }
    })
    .when('/info', {
      templateUrl: '/views/user/templates/info.html',
      controller: 'InfoController as vm',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        }
      }
    })
    .otherwise({
      template: '<h1>404</h1>'
    })

}]);