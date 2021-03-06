const webpush = require('web-push');
const express = require('express');
const axios = require('axios');
const router = express.Router();

const publicVapidKey = 'BIX9l24uHRu1thHwYao0RzvFR_d0IxmrwDeTIbzJNg5UAzLJZBxWy_X3B2vOs_wXdWDJAXE5Ilt9UqARAMLZEHs';
const privateVapidKey = 'T_MzsO-ZI3PoVkKBpYwwhgMndagz8yO5fXZkkbkcMYA';

webpush.setVapidDetails('mailto:test@test.com', publicVapidKey, privateVapidKey);

router.post('/subscribe', (req, res) => {
    const subscription = req.body;
    res.status(201).json({});
    const payload = JSON.stringify({ title: 'Push Test'});

    webpush.sendNotification(subscription, payload).catch(err => console.log(err));
})

function decodePolyline(encoded) {
    if (!encoded) {
        return [];
    }
    var poly = [];
    var index = 0, len = encoded.length;
    var lat = 0, lng = 0;

    while (index < len) {
        var b, shift = 0, result = 0;

        do {
            b = encoded.charCodeAt(index++) - 63;
            result = result | ((b & 0x1f) << shift);
            shift += 5;
        } while (b >= 0x20);

        var dlat = (result & 1) != 0 ? ~(result >> 1) : (result >> 1);
        lat += dlat;

        shift = 0;
        result = 0;

        do {
            b = encoded.charCodeAt(index++) - 63;
            result = result | ((b & 0x1f) << shift);
            shift += 5;
        } while (b >= 0x20);

        var dlng = (result & 1) != 0 ? ~(result >> 1) : (result >> 1);
        lng += dlng;

        var p = {
            latitude: lat / 1e5,
            longitude: lng / 1e5,
        };
        poly.push(p);
    }
    return poly;
}

module.exports = router;