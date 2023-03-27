const mongoose = require('mongoose');

const historyScema = mongoose.Schema({
    city : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
    }
})


const historyModel = mongoose.model('history', historyScema);


module.exports = {historyModel}