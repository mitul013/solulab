const mongoose = require('mongoose');


const geoschema = new mongoose.Schema({
    type:{
        default:"Point",
        type:String
    },
    coordinates:{
        type:[Number],
        index:"2dsphere",
        required:true
    }
})

module.exports = geoschema