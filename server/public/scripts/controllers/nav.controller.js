myApp.controller('NavController', ['UserService', '$mdDialog', '$route', '$mdMenu', function(UserService, $mdDialog, $route, $mdMenu) {
    var self = this;
    self.userService = UserService;
    self.userObject = UserService.userObject;
    self.toggle = true;
    self.openMenu = function($mdMenu, ev) {
      originatorEv = ev;
      $mdMenu.open(ev);
    };
    //Getting the current open page to be displayed as active
    self.activetab = $route.current.$$route.activetab;
    self.currentNavItem = UserService.currentNavItem;
  }]);