myApp.service('MyProfileService', ['$http', '$location', function ($http, $location) {
       ('MyProfileService Loaded');
    let self = this;
    // self.viewProfile = {};

    // getting user profile for my profile view from member_info table in database
    self.viewProfile = function() {
        return $http.get('/member/viewProfile')
            .then(function (response) {
                //    ("back from dB",response);
                return response.data;
            })
            .catch(function (response) {
                //    ('error on get request');
            });
    } //end getting table data
}]);