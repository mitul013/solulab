const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useCrateIndex: true })
.then(() => {
    console.log("connection successfull...");
})
.catch((err) => {
        console.log("error is :- " + err);
    })