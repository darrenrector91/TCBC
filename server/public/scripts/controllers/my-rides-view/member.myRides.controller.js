myApp.controller('MemberMyRidesController', ['RideDetailService', '$mdDialog', 'UserService', function(RideDetailService, $mdDialog, UserService) {
    let self = this;

    self.myRidesTable = true;
    self.pastRidesTable = true;

    self.userObject = UserService.userObject;
    
    self.rideDetailReveal = function(ride){
        RideDetailService.initMyRideDetailModal(ride);
    }

    self.rideDetailRevealPast = function(ride){
        ride.past_ride = true;
        RideDetailService.initMyRideDetailModal(ride);
    }
    
    self.allRides = RideDetailService.allRides;
    self.myRides = RideDetailService.myRides;
    self.myPastRides = RideDetailService.myPastRides;

    RideDetailService.getMyPastRideDetails();
    RideDetailService.getMyRideDetails();
    RideDetailService.getRideCategories();
    RideDetailService.getAllRideDetails();

    self.collapseMyRides = function () {
        self.myRidesTable = !self.myRidesTable;
    }
    self.collapsePastRides = function () {
        self.pastRidesTable = !self.pastRidesTable;
    }
  }]);
  

