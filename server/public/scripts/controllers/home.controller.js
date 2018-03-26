myApp.controller('HomeController', ['RideDetailService','$scope', '$filter', function (RideDetailService, $scope, $filter) {
  let self = this;
  self.rides = {};
  self.test = RideDetailService.rides;
  self.categories = {};
  self.isDisabled = false;
  self.minDate = new Date();
  self.selection = [];


  self.toggleView = function(ary, data, index){
    for(var i=0; i<ary.length; i++){
      if(i!=index) { ary[i].expanded=false; }
      else { data.expanded=!data.expanded; }
    }
  }

$scope.gridOptions = {
    data: [],
    sort: {
      predicate: 'date',
      direction: 'asc'
    },
    customFilters: {
      date: function (items, value, predicate) {
          return items.filter(function (item) {
              return value && item[predicate] ? !item[predicate].indexOf(moment(value).format('MM/DD/YYYY')) : true;
          });
      },
    }
  };

$scope.gridActions = {

}
  // GET categories on page load
  self.loadCategories = function(){
    RideDetailService.getRideCategories()
      .then((response)=>{
        self.categories.list = response;
      })
      .catch((err)=>{
        swal('Error loading category information. Please try again later.', '', 'error');
      })
  }
  self.loadCategories();
  
  //GET all rides for display
  self.getAllRides = function(){
    RideDetailService.getAllRideDetails()
      .then((response)=>{
        $scope.gridOptions.data = response.data;
      })
      .catch((err)=>{
        swal('Error getting all rides information. Please try again later.', '', 'error');
      })
  }
  // self.getAllRides();
  
// Ride Details
self.rideDetailReveal = function (id) {
  RideDetailService.rideDetailModal(id);
}

// Clear Filters
self.clearFilters = function () {
  $scope.date = '';
  $scope.type = '';
  $scope.rides_name ='';
  $scope.gridActions.refresh();
}


let init = function () {
  self.getAllRides();

};
init();

}])