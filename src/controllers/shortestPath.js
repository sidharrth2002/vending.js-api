const userService = require('../services/user.service');
const axios = require('axios');

const MAPS_URL = 'https://api.distancematrix.ai/maps/api/distancematrix/json?';

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