myApp.controller('AdminController', ['$timeout', 'Upload', '$http', '$mdDialog', 'AdminService', 'RideDetailService', function ($timeout, Upload, $http, $mdDialog, AdminService, RideDetailService) {
    let self = this;
    self.pendingApprovals = AdminService.pendingApprovedRides;
    self.rider = AdminService.rider;
    self.member = AdminService.member;

    self.memberToChangePassword = {};
    self.loadRidesForApproval = function () {
        AdminService.getPendingApprovedRides().then((response) => {
            self.pendingApprovals.list = [];
            self.pendingApprovals.list = response;
        })
    }
    self.loadRidesForApproval();

    self.rideDetailReveal = function (ride) {
        RideDetailService.adminEditRideDetailModal(ride);
    }
    self.approveRide = function (rideId) {
        AdminService.approveRide(rideId).then((response) => {
                swal("Ride has been Approved", '', "success");
                self.loadRidesForApproval();
            })
            .catch((err) => {
                swal('Error approving ride. Please try again later', '', 'error');
            })
    }

    self.getRoles = function () {
        AdminService.getRoles().then((response) => {
                self.getUserRoles = AdminService.getUserRoles;

            })
            .catch((err) => {
                swal('Error getting roles from server. Please try again later.', '', 'error');
            })
    }
    self.getRoles();

    self.findRider = function (rider) {
        AdminService.findRider(rider).then((response) => {
                self.riderInfo = AdminService.riderInfo;
                self.rider = {
                    first_name: '',
                    last_name: '',
                    member_id: ''
                }
            })
            .catch((err) => {
                swal('Error getting rider information. Please try again later.', '', 'error');
            })
    }

    self.changeRole = function (member) {
        AdminService.changeRole(member)
            .then((response) => {
                self.roleChange = AdminService.roleChange;
                AdminService.findRider(member);
                self.userRole = '';
            })
            .catch((err) => {
                swal('Error changing member role. Please try again later.', '', 'error');
            })
    }

    self.submit = function (file) {
        Upload.upload({
                url: '/upload',
                data: {
                    file: file
                }
            }).then(function (response) {
                swal("Member records updated", '', "success");
                   ('Success ' + response.config.data.file.name + 'uploaded. Response: ' + response.data);
            })
            .catch((err) => {
                swal('Error updating member records. Please try again later.', '', 'error');
            });
    };


    self.adminViewMemberPastRides = function (member, ev) {
        AdminService.adminViewMemberPastRides(member)
            .then((response) => {
                   (self.pastMemberRides);
            })
            .catch((err) => {
                swal('Error getting rider past rides. Please try again later.', '', 'error');
            })
    }

    self.openChangePasswordModal = function (ev, member) {
        $mdDialog.show({
            controller: ChangePasswordController,
            controllerAs: 'vm',
            templateUrl: '../views/admin/templates/changePassword-modal.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            resolve: {
                user: function () {
                    return member;
                }
            }
        })
    }

    function ChangePasswordController($mdDialog, user, AdminService) {
        const self = this;
        self.editUser = user;
        self.passwordFail = false;
        self.submitForm = function (password) {
            if (password.newPassword !== password.confirm) {
                self.passwordFail = true;
            } else {
                user.newPassword = password.newPassword;
                AdminService.changePassword(user)
                    .then((result) => {
                        swal(`Successfully changed password for ${user.first_name}`, '', 'success');
                        $mdDialog.hide();
                    })
                    .catch((err)=>{
                        swal('Error changing member information. Please try again later.', '', 'error');
                    });
            }
        }
        
        self.closeModal = function () {
            $mdDialog.hide();
        }

    }

    self.upload = function () {
    angular.element(document.querySelector('#fileInput')).click();
  };


}]);