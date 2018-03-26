myApp.controller('LoginController', ['$http', '$location', 'UserService', 'RideDetailService', '$mdDialog', '$route', function ($http, $location, UserService, RideDetailService, $mdDialog, $route) {
  var self = this;
  self.showNav = UserService.showNav;
  self.user = {
    member_id: '',
    password: ''
  };
  self.message = '';
  self.user = UserService.userObject;

  self.myMileage = RideDetailService.myMileage;

  self.login = function () {
    if (self.user.member_id === '' || self.user.password === '') {
      self.message = "Enter your username and password!";
    } else {
      UserService.login(self.user).then(
        (response) => {
          if (response.status == 401) {
            self.message = "Incorrect Member ID or Password"
          } else if (response.status == 200) {
            UserService.getuser().then((response) => {
              self.user = response;
              $location.path('/home');
            })
            $mdDialog.hide();
          }
        }
      );
    }
  }
  self.logout = function () {
    UserService.logout()
      .then(() => {
        $location.path('/landing')
      });
  }
  self.loginModal = function (ev) {
    $mdDialog.show({
      parent: angular.element(document.body),
      targetEvent: ev,
      templateUrl: '../views/shared/login.html',
      controller: 'LoginController',
      controllerAs: 'vm',
      clickOutsideToClose: true,
    });
  }

  self.cancel = function () {
    $mdDialog.cancel();
  }

  self.close = function (reason) {
    $mdDialog.hide();
  }

  RideDetailService.getMileageForMember();


  self.registerModal = function (ev) {
    $mdDialog.show({
      parent: angular.element(document.body),
      targetEvent: ev,
      templateUrl: '../views/shared/register.html',
      controller: RegisterController,
      controllerAs: 'vm',
      clickOutsideToClose: true,
    });
  }

  function RegisterController($mdDialog, UserService, $sce) {
    const self = this;
    self.message = {
      message: ''
    };
    self.passwordMatch = {
      state: true
    };
    self.newUser = {
      member_id: '',
      password1: '',
      password2: '',
      password: ''
    }
    self.register = function () {
      if (self.newUser.password1 != self.newUser.password2) {
        self.passwordMatch.state = false;
      } else {
        self.newUser.password = self.newUser.password1;
        UserService.registerUser(self.newUser)
          .then((result) => {
            self.message.message = $sce.trustAsHtml(result)
          });
        self.passwordMatch.state = true;
        self.newUser = {
          member_id: '',
          password1: '',
          password2: '',
          password: ''
        }
        $location
      }
    }

    self.cancel = function () {
      $mdDialog.cancel();
    }

    self.close = function () {
      $mdDialog.hide();
    }
  }
}]);