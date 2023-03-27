const mongoose = require('mongoose');

const preferScema = mongoose.Schema({
    city : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
    }
})


const preferModel = mongoose.model('prefer', preferScema);


module.exports = {preferModel}