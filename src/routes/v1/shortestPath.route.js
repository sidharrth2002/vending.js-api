const express = require('express');
const validate = require('../../middlewares/validate');
const shortestPath = require('../../controllers/shortestPath');

const router = express.Router();

router
.route('/')
.get(async (req, res) => {
    let result = await shortestPath({
        'latitude': 5.4141,
        'longitude': 100.3288   
    });
    res.send(result);
})

module.exports = router;