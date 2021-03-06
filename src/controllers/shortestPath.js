const userService = require('../services/user.service');
// const appointment
const axios = require('axios');
const { appointmentService } = require('../services');

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

const rad2degr = (rad) => { 
    return rad * 180 / Math.PI; 
}

const degr2rad = (degr) => { 
    return degr * Math.PI / 180; 
}

const getCenter = (latLngInDegr) => {
    console.log(latLngInDegr);
    var LATIDX = 0;
    var LNGIDX = 1;
    var sumX = 0;
    var sumY = 0;
    var sumZ = 0;

    for (var i=0; i<latLngInDegr.length; i++) {
        var lat = degr2rad(latLngInDegr[i].latitude);
        var lng = degr2rad(latLngInDegr[i].longitude);
        sumX += Math.cos(lat) * Math.cos(lng);
        sumY += Math.cos(lat) * Math.sin(lng);
        sumZ += Math.sin(lat);
    }
    var avgX = sumX / latLngInDegr.length;
    var avgY = sumY / latLngInDegr.length;
    var avgZ = sumZ / latLngInDegr.length;

    var lng = Math.atan2(avgY, avgX);
    var hyp = Math.sqrt(avgX * avgX + avgY * avgY);
    var lat = Math.atan2(avgZ, hyp);
    return ([rad2degr(lat), rad2degr(lng)]);
}

//custom algorithm to determine the best technician to attend to a service
//use centroid calculation
//and distance matrix
const bestPossibleTechnician = async (vendingMachineCoordinates) => {
    let users = await userService.getTechnicians();
    
    //get realtime/fake current coords
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

    //now determine the locations of all the other pending appointments and calculate the center
    for(let user of users) {
        let pending = await appointmentService.getAppointmentByUserId(user._id);
        // console.log(pending);
        user.pendingApp = pending;
        let apppointLocations = [];
        for(let appointment of pending) {
            let latlong = {
                'latitude': appointment.vendingMachine.location.latitude,
                'longitude': appointment.vendingMachine.location.longitude
            };
            apppointLocations.push(latlong);
        }
        let center = getCenter(apppointLocations);
        if(center[0] && center[1]) {
            let querystring = MAPS_URL;
            querystring += 'origins=';
            querystring = querystring + center[0] + ',' + center[1];
            querystring += '&destinations=';
            querystring = querystring + vendingMachineCoordinates['latitude'] + ',' + vendingMachineCoordinates['longitude'];
            querystring += '&key=' + process.env.MAP_KEY;
            let doc = await axios.get(querystring, {method: 'GET', mode: 'no-cors'});
            console.log(doc.data.rows[0].elements[0].distance);
            let relativeDist = doc.data.rows[0].elements[0].distance.value;
            user.relativeDist = relativeDist;
        } else {
            //no data, so assume nowhere near
            user.relativeDist = 10000000;
        }
    }
    users.sort((a, b) => (a.relativeDist > b.relativeDist ? 1 : -1));
    let toptechnicians = users.slice(0, 4);
    toptechnicians.sort((a, b) => (a.pendingApp.length > b.pendingApp.length ? 1 : -1));
    console.log(toptechnicians);
    return toptechnicians[0]._id;
}

module.exports = bestPossibleTechnician