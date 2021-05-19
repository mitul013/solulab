const geoschema = require('./Geo')
const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        default: Date.now()
    },
    //location's type is geoschema which we define in Geo.js
    location: {
        type: geoschema,
        index: "2dsphere"
    },
    //in followers we store user Ids and we mention ref so we can use populate method in future
    followers:[{
        type:ObjectId,
        ref:"User"
    }],   
    following:[{
        type:ObjectId,
        ref:"User"
    }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;