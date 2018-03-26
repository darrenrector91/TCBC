
class RideDistances {
    constructor(id,ride_distance){
        this.rides_distances_id = id;
        this.ride_distance = ride_distance;
    }
}

function storeRideDistancesAsProperty(rides){
    for(let i=0; i<rides.length;i++){
        rides[i].distanceSelection = combineRideAndId(rides[i].ride_distance_id,rides[i].ride_distance);
    }
    return rides;  
}

function combineRideAndId(idArray,distanceArray){
    let distancesArray =[];
    for(let i =0; i<idArray.length; i++){
        distancesArray.push(new RideDistances(idArray[i],distanceArray[i]));
    }
    return distancesArray;
}


module.exports = storeRideDistancesAsProperty;