const {historyModel} = require('../Model/history.model');

const historyMiddleware = async (req, res, next) => {
    try {
        const {city} = req.body;
        const {email} = req.user;
        const history = new historyModel({city, email});
        await history.save();
        next();
    } catch (error) {
        res.send(error.message);
    }
}


module.exports = {historyMiddleware}