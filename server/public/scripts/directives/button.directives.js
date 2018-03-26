myApp.directive('detailsBtn', function () {
    return {
      template: '<md-button class="md-raised md-primary" ng-click="vm.rideDetailReveal(ride)">Details</md-button>',
      controller: "HomeController as vm"
    };
  });
