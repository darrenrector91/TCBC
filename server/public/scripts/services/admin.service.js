myApp.service('AdminService', ['$http', '$location', '$mdDialog', function ($http, $location, $mdDialog) {
       ('AdminService Loaded');
    let self = this;
    self.pendingApprovedRides = {
        list: []
    };
    self.getUserRoles = {
        list: []
    };
    self.riderInfo = {
        list: []
    };

    self.rider = {
        first_name: '',
        last_name: '',
        member_id: ''
    };

    self.roleChange = {
        list: {}
    };

    self.pastMemberRides = {
        list: []
    };

    self.getPendingApprovedRides = function () {
        return $http.get('/rides/admin/pendingApprovedRides')
            .then((response) => {
                self.pendingApprovedRides.list = [];
                   ('Service, rides pending approval came back: ', response.data);
                response.data.forEach(ride => {
                    let momentDate = moment(ride.rides_date);
                    ride.date = momentDate.format('MM/DD/YYYY');
                    ride.time = momentDate.format('hh:mm A');
                    self.pendingApprovedRides.list.push(ride);
                });
                return response.data;
            })
            .catch((err) => {
                   ('Error getting rides pending approval: ', err);
            })
    }

    self.getRoles = function () {
        return $http.get('/member/userRole')
            .then((response) => {
                   ('got user roles:', response.data);
                let dropGuestRole = response.data;
                //this fix to remove guest won't scale. just a quick fix.
                dropGuestRole.pop();
                self.getUserRoles.list = dropGuestRole;
                return response.data;
            })
            .catch((err) => {
                   ('getting user roles failed:', err);
            })
    }

    self.findRider = function (rider) {
        if (rider.member_id == '') {
            rider.member_id = 0
        }
        if (rider.first_name == '') {
            rider.first_name = 'QWERTYPHONE';
        }
        if (rider.last_name == '') {
            rider.last_name = 'BANANAJAMMA';
        }
        return $http.get(`/member/findRider/riderInfo/${rider.first_name}/${rider.last_name}/${rider.member_id}`)
            .then((response) => {
                   ('search member response ', response);
                self.riderInfo.list = response.data;
                self.rider = {
                    first_name: '',
                    last_name: '',
                    member_id: ''
                }
            })
            .catch((err) => {
                   ('getting role failed:', err);
            })
    }

    self.changeRole = function (member) {
           ('role member change', member);
        return $http.put(`/member/changeRole`, member)
            .then((response) => {
                if (response) {
                    swal(`User role was successfully updated!`, {
                        icon: "success",
                    });
                    self.roleChange.list = response;
                    return response;
                }
            })
            .catch((err) => {
                swal('Error updating user role.', '', 'error');
            });
    }

    self.adminViewMemberPastRides = function (member, ev) {
           ('user id ', member.user_id);
        return $http.get(`/member/adminViewMemberPastRides/${member.user_id}`)
            .then((response) => {
                $mdDialog.show({
                    controller: MyPastRidesController,
                    controllerAs: 'vm',
                    templateUrl: '../views/admin/partials/modal-template.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    resolve: {
                        item: function () {
                            return member;
                        }
                    }
                })
                self.pastMemberRides.list = response.data;
                   (response.data);
                // return response
            })
            .catch((err) => {
                   ('past ride data GET failed ', err);
            })
    }

    function MyPastRidesController($mdDialog, item, AdminService) {
        const self = this;
        self.mode = {
            show: true,
            edit: false
        }
        self.closeModal = function () {
            $mdDialog.hide();
        }
        self.pastMemberRides = AdminService.pastMemberRides;
        self.member = item;
        self.backModal = function () {
            self.mode.edit = false;
            self.mode.show = true;
        }
           ('modal item ', item);

        self.editSinglePastRide = function (ride) {
            self.pastRideInfo = {
                member: self.member,
                ride: ride
            }
            self.mode = {
                show: false,
                edit: true
            }
            // $mdDialog.show({
            //     controller: SinglePastRideEditController,
            //     controllerAs: 'vm',
            //     templateUrl: '../views/admin/partials/edit-ride-mileage.html',
            //     parent: angular.element(document.body),
            //     targetEvent: ev,
            //     clickOutsideToClose: true,
            //     resolve: {
            //         item: function () {
            //             return pastRideInfo;
            //         }
            //     }
            // })
            // self.pastRideInfo = item;
            self.member = self.pastRideInfo.member;
            self.ride = self.pastRideInfo.ride;
          
               ('modal modal item ', self.pastRideInfo);

            self.editRideActualMileage = function (mileage) {
                let mileUpdate = {
                    ride_id: self.ride.ride_id,
                    user_id: self.member.user_id,
                    mileage: mileage
                }
                AdminService.editRideActualMileage(mileUpdate)
                    .then(() => {
                        self.closeModal()
                    });
            }
        }
    }

    function SinglePastRideEditController($mdDialog, item, AdminService) {
        const self = this;

    }

    self.changePassword = function (user) {
        return $http.post('/api/user/admin/changePassword', user)
            .then((result) => {
                return result;
            })
            .catch((err) => {
                   ('error with password change API call ', err);
            })
    }

    self.editRideActualMileage = function (mileUpdate) {
        return $http.put('/rides/admin/editRide/actualMileage', mileUpdate)
            .then((response) => {
                   ('response from update actual mileage', response);
                swal(`Successfully updated user mileage!`, '', 'success');
            })
            .catch((err) => {
                   ('error updating actual mileage ', err);
                swal(`Could not update user mileage, please try again later.`, '', 'error');
            })
    }

}]);


// ride = {
//     actual_distance: 16,
//     approved: true,
//     cancelled: false,
//     checked_in: false,
//     completed: true,
//     date: "12/12/1931",
//     description: "234",
//     id: 32,
//     ride_id: 28,
//     ride_leader: 2,
//     ride_location: "231",
//     rides_category: 1,
//     rides_date: "1931-12-12T06:00:00.000Z",
//     rides_name: "qwe",
//     selected_distance: 16,
//     time: "12:00 AM",
//     url: "234",
//     user_id: 2,
//     waiver_signed: null
// }