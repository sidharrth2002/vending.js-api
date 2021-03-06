const express = require('express');
const axios = require('axios');
const { appointmentService } = require('../../services');
const router = express.Router();

router.post('/getroute/:id', async(req, res) => {
    let startingLat = req.body.latitude;
    let startingLong = req.body.longitude;

    let technician = req.params.id;
    let appointments = await appointmentService.getAppointmentByUserId(technician);

    if(appointments.length > 0) {
        let querystring = 'https://maps.googleapis.com/maps/api/directions/json?';
        querystring += 'origin=';
        querystring = querystring + startingLat + ',' + startingLong;
        querystring += '&waypoints=';

        for(let i = 0; i < appointments.length; i++) {
            let appointment = appointments[i];
            if(i != appointments.length - 1) {
                querystring = querystring + appointment.vendingMachine.location.latitude + ',' + appointment.vendingMachine.location.longitude;
            }
            if(i != appointments.length - 2) {
                querystring += '|';
            }        
        }
        querystring += '&destination=';
        console.log(appointments);
        querystring += appointments[appointments.length - 1].vendingMachine.location.latitude;
        querystring += ','
        querystring += appointments[appointments.length - 1].vendingMachine.location.longitude;
        querystring += '&key=AIzaSyBN5MoqYOqVjmxji7ZcV6aJhiTzcYfgpR0';
        console.log(querystring);
        axios.get('https://maps.googleapis.com/maps/api/directions/json?destination=5.3332,100.3066&origin=5.3384,100.4306&waypoints=5.3433057049009545,100.43362052585397&key=AIzaSyBN5MoqYOqVjmxji7ZcV6aJhiTzcYfgpR0')
        .then(response => {
            console.log(response.data.routes[0].overview_polyline.points);
            console.log(`https://maps.googleapis.com/maps/api/staticmap?size=600x400&zoom=12&path=enc:${response.data.routes[0].overview_polyline.points}&key=AIzaSyBN5MoqYOqVjmxji7ZcV6aJhiTzcYfgpR0`);
            res.send(`https://maps.googleapis.com/maps/api/staticmap?size=600x400&zoom=12&path=enc:${response.data.routes[0].overview_polyline.points}&key=AIzaSyBN5MoqYOqVjmxji7ZcV6aJhiTzcYfgpR0`)
        })
    } else {
        console.log('dfhsdj');

        res.send('Nothing to show');
    }
})

module.exports = router;