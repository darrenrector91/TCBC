myApp.controller('UserController', ['UserService', function(UserService) {
     ('UserController created');
  var self = this;
  self.userService = UserService;
  self.userObject = UserService.userObject;
  self.myDate = new Date();
}]);
