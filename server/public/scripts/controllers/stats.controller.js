myApp.controller('MyStatsController', ['MyProfileService', '$location','$http','RideDetailService','MyProfileService','$mdDialog', function (MyProfileService, $location, $http, RideDetailService, MyProfileService, $mdDialog) {
    let self = this;
    self.viewProfile = {};
    self.goal = {};
    self.totalMiles = {};
    self.viewProfile = {};
    self.viewProfile.expanded = false;

    self.viewProfile = function(){
      MyProfileService.viewProfile().then((res)=>{
        self.viewProfile = res[0];
      })
    }
    self.viewProfile();
    
    self.viewProfile = function () {
        MyProfileService.viewProfile().then((res) => {
            self.viewProfile = res[0];
        })
    }
    self.viewProfile();
    self.toggleView = function(){
          !view.expanded  
        
      }
    self.openMemberInfo = function(ev){
        $mdDialog.show({
            controller: 'MyProfileController',
            controllerAs: 'vm',
            templateUrl: '../views/profile/templates/member-info-modal.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
        })
    }

    self.getGoalData = function(){
        $http.get('/member/stats/goal')
            .then((response)=>{
                
                self.goal.currentGoal = response.data[0].goal;
                RideDetailService.getMileageForMember()
                    .then((res)=>{
                        self.totalMiles = res.sum;
                    goalProgress.refresh(self.totalMiles,response.data[0].goal);
                        
                    })  
            })
            .catch((err)=>{
            })

    }
    self.getGoalData();

    self.setGoal = function(newGoal){
        $http.put('/member/stats/goal', newGoal)
            .then((response)=>{
                self.getGoalData();
                swal('Goal Updated!','', 'success')
                self.goal.setGoal = '';
            })
            .catch((err)=>{
                
            })
    }

    /* Goal Trakcer Dial */
    var goalProgress = new JustGage({
        id: "bigfella",
        value: 0,
        min: 0,
        max: 100,
        label: "Miles Towards Goal",
        titlePosition: 'below',
        pointer: true,
        gaugeWidthScale: .2,
        relativeGaugeSize: true,
        levelColors: [
            "#ff0000",
            "#ffff66",
            "#ccff99",
            "#33cc33"
        ] 
      });
      trackDateArrayLength = [];
      trackDateArrayLength = trackDateArrayLength.length;
    
    /* Line Graph */
    var ctx = document.getElementById('lineChart').getContext('2d');
    var chart = new Chart(ctx, {
    // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: [],
            datasets: [{
                label: "Miles Biked",
                backgroundColor: 'rgb(255,0,0)',
                borderColor: 'rgb(255, 0, 0)',
                data: [],
                fill: false
            }]
        },

        // Configuration options go here
        options: {
            title: {
                display: true,
                text: 'My Rides',
                position: 'top',
                fontSize: 24,
                fontColor: '#000000'
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Miles Biked',
                        fontSize: 18
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Ride Date',
                        fontSize: 18
                    }
                }]
            },
            legend:{
                display: false,
                position: 'bottom'
            }
        }
    });

    
    self.getLineChartData = function(){
        $http.get('/rides/stats')
            .then((response)=>{
                
                chart.chart.config.data.labels = response.data.datesArray;
                chart.chart.config.data.datasets[0].data = response.data.mileageArray;
                
                chart.update();
                
            })
            .catch((err)=>{
                
            })
    }
    self.getLineChartData();
    
    function formatDates(array){
        let formattedArray = [];
        for(let i=0;i<array.length;i++){
            let date = moment('MMMM Do YYYY').format(array[i])
            formattedArray.push(date);
        }
        return formattedArray;
    }

}]);