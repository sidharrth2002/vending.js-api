const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

require('dotenv').config()

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors());

app.get('/', (req, res) => {
    res.send('Home of the Atlas API');
})

app.listen(process.env.PORT || 3001, () => {
    console.log("Running on Port " + process.env.PORT)
})