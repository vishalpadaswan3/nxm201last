const jwt = require('jsonwebtoken');
const redis = require('redis');

const redisClient = redis.createClient()

redisClient.on('error', (err) => console.log(err.message));
(async ()=> await redisClient.connect())()
redisClient.on('ready', () => console.log('Redis client connected'));

const auth = async (req, res, next) => {

    try {
        const token = req.headers.authorization
        const decode = jwt.verify(token, process.env.secretKey)
        const t = await redisClient.get(`token`)
        console.log(decode)
        if (t === token) {
            return res.send("Token is not valid")
        }
        req.user = decode.user
        next()
    } catch (error) {
        res.send(error.message)
    }

}


module.exports = { auth }