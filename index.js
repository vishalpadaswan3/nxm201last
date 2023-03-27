const express = require('express');
const { connection } = require('./config/db');
const { router } = require('./routes/user.routes');
const { weatherRouter } = require('./routes/weather.routes');
const cors = require('cors');
const winston = require('winston');
const expressWinston = require('express-winston');
require('winston-mongodb');
require('dotenv').config()


const app = express();
app.use(express.json());
app.use(cors())


app.use(expressWinston.logger({
    transports: [
        new winston.transports.File({
            level: "info",
            json: true,
            filename: "logs.json"
        }),
        new winston.transports.MongoDB({
            level: "info",
            db : process.env.mongo_url,
        })
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    ),
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: false,
    ignoreRoute: function (req, res) { return false; }
}));


app.get('/', (req, res) => {
    res.send("Hello Homepage")
});

app.use(router)
app.use(weatherRouter)

app.listen(process.env.mongo_port, async () => {

    try {
        await connection
        console.log("Database is connected")
    } catch (error) {
        console.log(error.message)
    }
    console.log(`Server is running on port ${process.env.mongo_port}`)
});