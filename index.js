require('dotenv').config();
const express = require('express');
const cors = require('cors');
const PORT = 2500
const mainRouter = require('./routes/mainRouter')

const db = require('./DL/db')

const app = express();
db.connect();

app.use(cors());
app.use(express.json());
app.use(express.static('public'))

app.use('/', mainRouter)
const { maxCamp } = require('./middlewares/plans');

// ### swagger ###
// require('./swagger')(app)

app.listen(PORT, () => console.log(`****server is listening on ${PORT}****`))