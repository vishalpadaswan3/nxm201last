const express = require('express');
const { userModel } = require("../Model/user.model")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redis = require('redis');
const router = express.Router();


const redisClient = redis.createClient()

redisClient.on('error', (err) => console.log(err.message));
(async ()=> await redisClient.connect())()
redisClient.on('ready', () => console.log('Redis client connected'));

router.post('/register', async (req, res) => {

    try {
        let { email, password } = req.body;
        const s = await userModel.find({ email })
        if (s.length > 0) {
            return res.send("User already exists")
        }

        password = await bcrypt.hash(password, 10)
        const user = new userModel({ email, password })
        await user.save()
        res.send("User registered successfully")

    } catch (error) {
        res.send(error.message)
    }

})

router.post('/login', async (req, res) => {

    try {
        let { email, password } = req.body;
        const s = await userModel.find({ email })
        if (s.length === 0) {
            return res.send("User does not exists")
        }

        const isMatch = await bcrypt.compare(password, s[0].password)
        if (!isMatch) {
            return res.send("Password is incorrect")
        }

        const token = jwt.sign({email }, process.env.secretKey, { expiresIn: "1h" })
        res.send({ msg: "Login successfully", token })
    } catch (error) {
        res.send(error.message)
    }
})


router.get('/logout', async (req, res) => {

    try {
        const token = req.headers.authorization
        redisClient.set(`token`,`${token}`)
        res.send("Logout successfully")
    } catch (error) {
        res.send(error.message)
    }
})



module.exports = { router }