const webpush = require('web-push');
const express = require('express');

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

module.exports = router;