const express = require('express');
const { auth } = require('../Middleware/auth.middleware');
const axios = require('axios');
const redis = require('redis');
const { preferModel } = require('../Model/prefer.model');
const { historyModel } = require('../Model/history.model');
const { historyMiddleware } = require('../Middleware/history.middleware');
const { validation } = require('../Middleware/validation.middleware');
const { apiLimiter } = require('../Middleware/rateper.middleware');


const weatherRouter = express.Router();



const redisClient = redis.createClient()

redisClient.on('error', (err) => console.log(err.message));
(async () => await redisClient.connect())()
redisClient.on('ready', () => console.log('Redis client connected'));

weatherRouter.use(historyMiddleware)

weatherRouter.get('/weather', auth,  (req, res) => {
    res.send("Welcome to weather app")
})

weatherRouter.get('/weather/:city', auth, validation, async (req, res) => {
    try {
        console.log(req)
        const { city } = req.params
        const data = await redisClient.get(city)
        if (data !== null) {
            return res.send(JSON.parse(data))
        }
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.weather_api_key}`
        const response = await axios.get(url)
        redisClient.setex(city, 1800, JSON.stringify(response.data))
        res.send(response.data)
    } catch (error) {
        res.send(error.message)
    }
})


weatherRouter.post("/weather/prefer", auth, async (req, res) => {
    try {
        const { city } = req.body
       const email = req.user.email
        const prefer = new preferModel({ city, email })
        await prefer.save()
        res.send("City added to prefer list")
    } catch (error) {
        res.send(error.message)
    }
})

module.exports = { weatherRouter }