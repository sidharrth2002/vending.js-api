const userService = require('../services/user.service');
const axios = require('axios');
const { random } = require('faker');

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

const getShortestPath = async (vendingMachineCoordinates) => {
    let users = await userService.getTechnicians();
    const latlong = []
    for(let user of users) {
        latlong.push({
            'latitude': user.address.latitude,
            'longitude': user.address.longitude
        });
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

    return users[0];
}

module.exports = getShortestPath