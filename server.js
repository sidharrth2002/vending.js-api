const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors());

app.get('/', (req, res) => {
    res.send('Home of the Atlas API');
})