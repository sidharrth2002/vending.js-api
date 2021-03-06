const userService = require('../services/user.service');
// const appointment
const axios = require('axios');

const MAPS_URL = 'https://api.distancematrix.ai/maps/api/distancematrix/json?';

const getRandomCoordinates = () => {
    let latitude = (3.0738 * Math.PI / 180);
    let longitude = (101.5183 * Math.PI / 180);
    let max_distance = 300;
    let min_distance = 100;
    let earthRadius = 6371000;
    let distance = Math.sqrt(Math.random() * (Math.pow(max_distance, 2) - Math.pow(min_distance, 2)) + Math.pow(min_distance, 2));
    let delta_lat = Math.cos(Math.random() * Math.PI) * distance / earthRadius;
    let sign = Math.random() * 2 - 1;
    
    delta_lon = sign * Math.acos(
        ((Math.cos(distance/earthRadius) - Math.cos(delta_lat)) /
        (Math.cos(latitude) * Math.cos(delta_lat + latitude))) + 1);

    let randomLat = (latitude + delta_lat) * 180 / Math.PI;
    let randomLon = (longitude + delta_lon) * 180 / Math.PI;
    return [randomLat, randomLon];
}

console.log(getRandomCoordinates());

//custom algorithm to determine the best technician to attend to a service
const bestPossibleTechnician = async (vendingMachineCoordinates) => {
    let users = await userService.getTechnicians();
    console.log('The users are');
    console.log(users);
    const latlong = []
    for(let user of users) {
        let randomCoords = getRandomCoordinates();
        latlong.push({
            'latitude': randomCoords[0],
            'longitude': randomCoords[1]
        });
        user.address = {};
        user.address.latitude = randomCoords[0];
        user.address.longitude = randomCoords[1];
    }
    let querystring = MAPS_URL;
    querystring += 'origins=';
    for(let data of latlong) {
        querystring = querystring + data['latitude'] + ',' + data['longitude'];
        if(latlong.indexOf(data) != latlong.length - 1) {
            querystring += '|';
        }
    }
    querystring += '&destinations=';
    querystring = querystring + vendingMachineCoordinates['latitude'] + ',' + vendingMachineCoordinates['longitude'];
    querystring += '&key=' + process.env.MAP_KEY;
    let doc = await axios.get(querystring, {method: 'GET', mode: 'no-cors'});
    let data = doc.data.rows;
    for(let i=0; i<users.length; i++) {
        let distanceData = data[i];
        users[i].distanceMatrix = distanceData;
    }
    users.sort((a, b) => (a.distanceMatrix.elements[0].distance.value > b.distanceMatrix.elements[0].distance.value ? 1 : -1))
    console.log(users);

    //now determine how pending orders the technician has
    // let appointments = 


    return users[0];
}

module.exports = bestPossibleTechnician