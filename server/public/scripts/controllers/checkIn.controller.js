myApp.controller('CheckInController', ['RideDetailService', 'UserService', 'CheckInService', '$mdDialog', '$location', '$routeParams', function (RideDetailService, UserService, CheckInService, $mdDialog, $location, $routeParams) {
    let self = this;
    let rideId = $routeParams.rideId;

    self.onMobile = true;

    self.ride = CheckInService.ride;

    self.riders = CheckInService.riders;

    self.markRideComplete = function () {
        CheckInService.markRideComplete(rideId)
            .then(() => {
                return $location.path('/ride-leader/my-rides');
            })
            .catch((err) => {
                swal('Error marking ride complete! ', '', 'error');
            })
            .finally(() => {
                swal('Ride Complete! All riders will receive their mileage automatically.', '', 'success')
            });
    }

    CheckInService.getRidersForCurrentRide(rideId);

    self.currentRide = function (rideId) {
        CheckInService.currentRide(rideId);
    };
    self.currentRide(rideId);

    self.addRider = function () {
        swal("Would you like to add a guest or a member?", {
                className: "add-rider-modal",
                buttons: {
                    guest: {
                        text: "Guest",
                        value: "guest"
                    },
                    member: {
                        text: "Member",
                        value: "member",
                    },
                }
            })
            .then((value) => {
                switch (value) {
                    case "guest":
                        CheckInService.addGuestToRide();
                        break;
                    case "member":
                        CheckInService.addMemberToRide();
                        break;
                    default:
                        swal("Cancelled adding new rider.");
                }
            });
    }

    self.toggleCheckedIn = function (rider) {
        CheckInService.toggleCheckedIn(rider);
    }

    self.closeCheckIn = function () {
        CheckInService.closeCheckIn();
    }

}]);