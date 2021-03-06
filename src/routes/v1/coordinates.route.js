const { getRandomCoordinates } = require('../../controllers/shortestPath');
const express = require('express');
const { route } = require('./shortestPath.route');
const router = express.Router();

router.get('/', (req, res) => {
    let randomCoords = getRandomCoordinates();
    res.status(200).send(randomCoords);
})

module.exports = router;