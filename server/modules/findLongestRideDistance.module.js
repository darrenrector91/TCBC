
//Takes in an array of integers and returns the largest value.
function getLargestDistance(distanceArray){

    let largest = distanceArray[0];
    for( let i = 0; i<distanceArray.length; i++){
        if(largest < distanceArray[i]){
            largest = distanceArray[i];
        }
    }
    return largest;

}




























module.exports = getLargestDistance;

