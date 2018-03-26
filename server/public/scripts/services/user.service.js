myApp.service('UserService', ['$http', '$location', function ($http, $location) {
     ('UserService Loaded');
  var self = this;
  self.userObject = {};
  self.currentNavItem = {
    value: ""
  };

  self.getuser = function () {
       ('UserService -- getuser');
    return $http.get('/api/user').then(function (response) {
      if (response.data.member_id) {
        // user has a curret session on the server
           ('user service: ', response.data);
        self.userObject.member_id = response.data.member_id;
        self.userObject.first_name = response.data.first_name;
        self.userObject.role = response.data.role;
        self.userObject.user_id = response.data.id
        return self.userObject;
      } else {
           ('UserService -- getuser -- failure');
        // user has no session, bounce them back to the landing page
        $location.path("/landing");
      }
    }, function (response) {
         ('UserService -- getuser -- failure: ', response);
      $location.path("/landing");
    });
  }

  self.getRideLeader = function(){
       ('UserService -- getRideLeader');
    return $http.get('/api/user').then(function (response) {
      if (response.data.member_id) {
        // user has a curret session on the server
        self.userObject = response.data;
          if(response.data.role === 2 || response.data.role === 3 ){
            return self.userObject
          }else{
               ('permission failed, not a ride leader or admin');
            $location.path('/home');
          }
      } else {
           ('UserService -- getRideLeader -- failure');
        // user has no session, bounce them back to the landing page
        $location.path("/landing");
      }
    }, function (response) {
         ('UserService -- getRideLeader -- failure: ', response);
      $location.path("/landing");
    });

  }


  self.getRideAdmin = function(){
       ('UserService -- getRideAdmin');
    return $http.get('/api/user').then(function (response) {
      if (response.data.member_id) {
        // user has a curret session on the server
        self.userObject = response.data;
          if(response.data.role === 3){
            return self.userObject
          }else{
               ('permission failed, not a ride Admin');
            $location.path('/home');
          }
      } else {
           ('UserService -- getRideAdmin -- failure');
        // user has no session, bounce them back to the landing page
        $location.path("/landing");
      }
    }, function (response) {
         ('UserService -- getRideAdmin -- failure: ', response);
      $location.path("/landing");
    });

  }

  self.login = function (user) {
    return $http.post('/api/user/login', user).then(
      function (response) {
        if (response.status == 200) {
          self.userObject.member_id = response.data.member_id;
          self.userObject.first_name = response.data.first_name;
          self.userObject.role = response.data.role;
          return response;

        } else {
          self.message = "Incorrect credentials. Please try again.";


        }
      },
      function (response) {
        return response;
        self.message = "Incorrect credentials. Please try again.";
      });
  }


  self.logout = function () {
       ('UserService -- logout');
    return $http.get('/api/user/logout')
      .then(function (response) {
           ('UserService -- logout -- logged out');
        self.userObject = {};
      });
  }


   self.registerUser = function (newUser) {
      if (newUser.member_id === '' || newUser.password === '') {
           ('NEED A PASSWROD');
        // message = "Choose a username and password!";
      } else {
           ('sending to server...', newUser);
        return $http.post('/api/user/register', newUser).then(function (response) {
             ('success', response);
          if (response.status === 500) {
            swal('Error registering user, please try again later.', '', 'error');
          } else {
               ('response.data ', response.data);
            
            return response.data
          }
          // $location.path('/user');
        })
      }
    }


}]);