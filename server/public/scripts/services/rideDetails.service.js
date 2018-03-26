myApp.service('RideDetailService', ['$http', '$location', '$mdDialog','AdminService', function ($http, $location, $mdDialog, AdminService) {
       ('RideDetailService Loaded');
    let self = this;
    self.allRides = {
        list: []
    }
    self.categories = {
        list: []
    }

    self.myRides = {
        list: []
    }

    self.myPastRides = {
        list: []
    }

    self.myLeadRides = {
        list: []
    }

    self.myMileage = {
        total: {}
    }

    let timeStamp = Date.now();
    // timeStamp = timeStamp.toUTCString();

    self.todaysDate = {
        date: null
    }

    self.todaysDate.getDate = function () {
        this.date = moment(timeStamp).format('MM/DD/YYYY');

    }
    


    self.getMileageForMember = function () {
        return $http.get('/rides/member/mileage')
            .then((response) => {
                self.myMileage.total = response.data;
                return response.data;
            })
            .catch((err) => {
                //    ('get mileage err ', err);
                swal('Error getting mileage for member', '', 'error');
            })
    }


    // Let's run our comparison logic off of the User ID instead of a names string.  Two identical users could cause a bug with this.
    //for sure jsut used that for testing, thanks for making a note so we dont forget
    // self.checkRidesForLeader = function (rides) {
    //        ('lead rides check ', rides);
    //     //    ('lead user', user);
    //     self.myLeadRides.list = [];
    //     rides.forEach((ride) => {
    //         if (ride.ride_leader == ride.user_id) {
    //             //    ('ride', ride);
    //             if (!ride.cancelled && ride.approved) {
    //                 self.myLeadRides.list.push(ride);
    //             } else {
    //                 //    ('this ride is cancelled', ride);
    //             }
    //         }
    //     })
    //        ('lead rides ', self.myLeadRides);

    // }

    self.cancelThisRide = function (ride) {
           ('ride to cancel ', ride);
        swal({
                title: `Do you want to cancel ${ride.rides_name}?`,
                text: `If you cancel ${ride.rides_name}, you cannot undo this action.`,
                icon: "warning",
                buttons: ["Nevermind", "Yes, cancel ride"],
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    return $http.put(`/rides/rideLeader/cancelRide/${ride.ride_id}`)
                        .then((response) => {
                            self.getMyRideDetails()
                            self.getMyLeadRideDetails();
                            swal(`${ride.rides_name} was cancelled! You must submit a new ride for approval to create this ride again.`, {
                                icon: "success",
                            });
                        })
                        .catch((err) => {
                            swal('Error cancelling ride, please try again later.', '', 'error');
                            //    ('cancel ride put err ', err);
                        });
                } else {
                    swal(`${ride.rides_name} was not cancelled!`);
                }
            });

    }



    // date.toUTCString();
    // function checkRideDate(rideDate, ride) {
    //     if (rideDate > timeStamp) {
    //            ('date new');
    //         self.myRides.list.push(ride)
    //         // self.ride.past_ride = false;
    //     } else {
    //            ('date old');
    //         // self.ride.past_ride = true;
    //         self.myPastRides.list.push(ride);
    //     }
    // }
    self.getMyLeadRideDetails = function () {
        return $http.get('/rides/rideLeader/leadRideDetails')
            .then((response) => {
                self.myLeadRides.list = [];
                   ('my lead ride results ', response.data);
                response.data.forEach(ride => {
                    ride.leadingRide = true;
                    let momentDate = moment(ride.rides_date);
                    ride.date = momentDate.format('MM/DD/YYYY');
                    ride.time = momentDate.format('hh:mm A');
                    self.myLeadRides.list.push(ride);
                })
                return response.data;
            })
            .catch((err) => {
                swal('Error getting member ride details, please try again later.', '', 'error');
                //    (err);
            })
    }

    self.getMyPastRideDetails = function () {
        return $http.get('/rides/member/pastRideDetails')
            .then((response) => {
                self.myPastRides.list = [];
                   ('my past ride results ', response.data);
                response.data.forEach(ride => {
                    let momentDate = moment(ride.rides_date);
                    ride.date = momentDate.format('MM/DD/YYYY');
                    ride.time = momentDate.format('hh:mm A');
                    self.myPastRides.list.push(ride);
                })
                return response.data;
            })
            .catch((err) => {
                swal('Error getting member ride details, please try again later.', '', 'error');
                //    (err);
            })
    }
    self.getMyRideDetails = function () {
        return $http.get('/rides/member/rideDetails')
            .then((response) => {
                self.myRides.list = [];
                   ('my ride results ', response.data);
                response.data.forEach(ride => {
                    let momentDate = moment(ride.rides_date);
                    ride.date = momentDate.format('MM/DD/YYYY');
                    ride.time = momentDate.format('hh:mm A');
                    self.myRides.list.push(ride)
                })
                return response.data;
            })
            .catch((err) => {
                swal('Error getting member ride details, please try again later.', '', 'error');
                //    (err);
            })
    }

    self.getAllRideDetails = function () {
        return $http.get('/rides/public/details')
            .then((response) => {
                   ('all rides ', response.data);
                for (let i = 0; i < response.data.length; i++) {
                    let dateOfRide = new Date(response.data[i].rides_date)
                    if (dateOfRide > timeStamp) {
                        let momentDate = moment(response.data[i].rides_date);
                        response.data[i].date = momentDate.format('MM/DD/YYYY');
                        response.data[i].time = momentDate.format('hh:mm A');
                    } else {
                        response.data[i].date = 'Past Ride';
                    }
                }
                self.allRides.list = response.data;
                return response;
            })
            .catch((err) => {
                swal('Error getting all ride details, please try again later.', '', 'error');
            })
    }

    self.getRideCategories = function () {
        return $http.get('/rides/public/categories')
            .then((response) => {
                for(let i = 0; i < response.data.length; i ++){
                    response.data[i].selected = true;
                }
                self.categories.list = response.data;
                   ('adding selected property', self.categories.list)
                return response.data;
            })
            .catch((err) => {
                swal('Error getting ride categories, please try again later.', '', 'error');
                //    ('error getting categories: ', err);
            })
    }

    self.rideDetailModal = function (ride, ev) {
           ('ride here ', ride);
        
        $mdDialog.show({
            controller: RideDetailController,
            controllerAs: 'vm',
            templateUrl: '../views/shared/ride-detail-modal.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            resolve: {
                item: function () {
                    return ride;
                }
            }
        })
    }

    function RideDetailController($mdDialog, item, RideDetailService, UserService) {
        const self = this;
        self.allRides = RideDetailService.allRides;
        self.ride = item;
        self.user = UserService.userObject;
        

        self.closeModal = function () {
            self.hide();
        }
        //if not signed in alert to sign in or register, else sign up for ride
        self.rideSignUp = function (ride) {
            if (self.user.member_id) {
                if (self.selectedDistance) {
                       ('SIGN ME UP FOR ', ride.rides_name);
                    self.selectedDistance;
                       ('distance ', self.selectedDistance);
                    ride.selected_distance = self.selectedDistance;
                    RideDetailService.signUpPost(ride)
                        .then(() => {
                            self.hide();
                            swal(`You signed up for ${ride.rides_name}`, '', 'success');
                        });;
                } else {
                    swal('Please select a mileage for this ride before signing up.', '', 'warning');
                }
            } else {
                swal('Please log in or become a member to sign up for this ride.', '', 'warning');
                // alert('Please log in or become a member to sign up for this ride.')
            }
        }

        self.hide = function () {
            $mdDialog.hide();
        };

        self.cancel = function () {
            $mdDialog.cancel();
        };

        self.success = function (answer) {
            //    ('answer', answer);
            swal(answer, '', {
                className: "success-alert",
            });
            // $mdDialog.hide(answer);
        };
        self.error = function (answer) {
            //    ('answer', answer);
            swal(answer, '', 'error', {
                className: "error-alert",
            });
            // $mdDialog.hide(answer);
        };
    }

    self.signUpPost = function (ride) {
           ('Signing up for ride ', ride);
        return $http.post('/rides/signUp', ride)
            .then((response) => {
                if (response.data == "Must be logged in to add items!") {
                       (response);
                    swal('Please log in to sign up for rides.', '', 'warning');
                } else {
                       ('post ride signup ', response);
                    return response;
                }
            })
            .catch((err) => {
                swal('You have already signed up for this ride. Please check your rides page', '', 'error');
                //    ('err on post ride sign up ', err);
            })
    }


    // self.currentRide = function (rides) {
    //     rides.forEach(ride => {
    //         if (ride.rides_date > '2018-03-03T06:00:00.000Z') {
    //             //will check against todays date with real data
    //             // ride.past_ride = false;
    //         } else {
    //             self.myPastRides.list.push(ride);
    //             // ride.past_ride = true;
    //         }
    //     })
    // }

    self.initMyRideDetailModal = function (ride) {
           ('ride ', ride);
        if (ride.past_ride) {
            return $http.get(`/rides/member/rideDetails/complete/${ride.ride_id}`)
                .then((response) => {
                       ('response modal with past', response.data[0]);
                    let newRide = response.data[0];
                    newRide.past_ride = true;
                    self.myRideDetailModal(newRide)
                    return response.data;
                })
                .catch((err) => {
                    swal('Error loading ride details, please try again later.', '', 'error');
                    //    (err);
                })
        } else if(ride.leadingRide){
            return $http.get(`/rides/member/rideDetails/complete/${ride.ride_id}`)
                .then((response) => {
                       ('response modal with lead', response);
                    let newRide = response.data[0];
                    newRide.leadingRide = true;
                    self.myRideDetailModal(newRide)
                    return response.data;
                })
                .catch((err) => {
                    swal('Error loading ride details, please try again later.', '', 'error');
                    //    (err);
                })
        } else{
            return $http.get(`/rides/member/rideDetails/complete/${ride.ride_id}`)
                .then((response) => {
                       ('response modal', response);
                    let newRide = response.data[0];
                    self.myRideDetailModal(newRide)
                    return response.data;
                })
                .catch((err) => {
                    swal('Error loading ride details, please try again later.', '', 'error');
                    //    (err);
                })
        }
    }

    self.myRideDetailModal = function (ride, ev) {
        $mdDialog.show({
            controller: MyRideDetailsController,
            controllerAs: 'vm',
            templateUrl: '../views/shared/ride-detail-modal-signed-up.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            resolve: {
                item: function () {
                    return ride;
                }
            }
        })
    }


    self.adminEditRideDetailModal = function (ride, ev) {
        $mdDialog.show({
            controller: EditRideDetailsController,
            controllerAs: 'vm',
            templateUrl: '../views/admin/templates/editRide-modal.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            resolve: {
                item: function () {
                    return ride;
                }
            }
        })
    }

    function MyRideDetailsController($mdDialog, item, RideDetailService) {
        const self = this;
        self.ride = item;
        self.user = {
            loggedIn: true
        };

        self.closeModal = function () {
            self.hide();
        }

        self.rideUnregister = function (item) {
            RideDetailService.rideUnregister(item)
                .then(() => {
                    self.hide();
                });
        };

        self.hide = function () {
            $mdDialog.hide();
        };

        self.cancel = function () {
            $mdDialog.cancel();
        };

        self.success = function (answer) {
            //    ('answer', answer);
            swal(answer, '', {
                className: "success-alert",
            });
            // $mdDialog.hide(answer);
        };
        self.error = function (answer) {
            //    ('answer', answer);
            swal(answer, '', 'error', {
                className: "error-alert",
            });
            // $mdDialog.hide(answer);
        };
    }
    self.rideUnregister = function (ride) {
        //    ('unregister for ride ', ride);
        return $http.delete(`/rides/unregister/${ride.ride_id}`)
            .then((response) => {
                self.getMyRideDetails();
                   ('unregister ', response);
                swal(`You were removed from the ride: ${ride.rides_name}`, '', 'success');
            })
            .catch((err) => {
                swal('Error removing member from ride sign up, please try again later.', '', 'error');
                //    ('err on post ride sign up ', err);

            })
    }

    self.createNewRide = function (ev) {
        $mdDialog.show({
            controller: CreateNewRideController,
            controllerAs: 'vm',
            templateUrl: '../views/ride-leader/partials/create-ride-modal.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
        })
    }

    function CreateNewRideController($mdDialog, RideDetailService) {
        const self = this;
        self.categories = RideDetailService.categories;
        self.newRide = {};
        self.newRide.distances = [];

        self.closeModal = function () {
            self.hide();
        }

        self.myRides = RideDetailService.myRides;
        self.submitRide = function (ride) {
               ('');
            
            if(!ride.rides_name || !ride.distances || !ride.description || !ride.ride_location || !ride.rides_category || !ride.rides_date){
                   ('ride failed to submit: ', ride);
                
                swal("All fields, except GPS Link, are required.", '', "warning");
            }else{
               ('new ride', ride);
            self.hide();

            $http.post('/rides/rideLeader/submitRide', ride)
                .then((response) => {
                    swal("Ride has been Submitted for Approval", '', "success");
                    RideDetailService.getMyRideDetails();
                    RideDetailService.getMyLeadRideDetails();

                       ('response post ride ', response);
                })
                .catch((err) => {
                    swal('Error submitting new ride, please try again later.', '', 'error');
                    //    ('err post ride ', err);
                });
            }
        }

        self.hide = function () {
            $mdDialog.hide();
        };

        self.cancel = function () {
            $mdDialog.cancel();
        };

        self.success = function (answer) {
            //    ('answer', answer);
            swal(answer, '', {
                className: "success-alert",
            });
            // $mdDialog.hide(answer);
        };
        self.error = function (answer) {
            //    ('answer', answer);
            swal(answer, '', 'error', {
                className: "error-alert",
            });
            // $mdDialog.hide(answer);
        };
    }
    // self.getMyRideDetails()
    //     .then((data) => {            
    //         self.checkRidesForLeader(self.myRides.list);
    //     });





            /**  Admin Edit Ride and Approval Modal Controller*/


    function EditRideDetailsController($mdDialog, item, RideDetailService, AdminService) {
        const self = this;
        self.categories = RideDetailService.categories;
        self.rideToEdit = item;
        self.rideToEdit.rides_date = new Date(item.rides_date);
           ('rideToEdit: ', self.rideToEdit);
        
        self.approveAndSave = function (ride) {
            //    ('new ride', ride);
            self.hide();
               ('ride to be submitted: ', ride);
            
            $http.put('/rides/admin/approveAndSave', ride)
                .then((response) => {
                    swal('Successfully Approved', '','success');
                       ('response post ride ', response);
                    AdminService.getPendingApprovedRides();
                })
                .catch((err) => {
                       ('err post ride ', err);
                });
        }

        self.hide = function () {
            $mdDialog.hide();
        };

        self.cancel = function () {
            $mdDialog.cancel();
        };

        self.success = function (answer) {
            //    ('answer', answer);
            swal(answer, '', {
                className: "success-alert",
            });
            // $mdDialog.hide(answer);
        };
        self.error = function (answer) {
            //    ('answer', answer);
            swal(answer, '', 'error', {
                className: "error-alert",
            });
            // $mdDialog.hide(answer);
        };
    }


}]);