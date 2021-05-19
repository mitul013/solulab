const express = require('express');
const expressLayouts = require('express-ejs-layouts');
require('./db/connection');
const passport = require('passport');
//flash
const flash = require('connect-flash');

//express session
const session = require('express-session');
const app = express();
require('./config/passport-config')(passport);

const { json } = require('express');
const cors = require('cors')

// //use cors for security of our server,db & data
// var whitelist = ['http://solulabtest.com','http://localhost:5007','https://solulabtest.herokuapp.com']
// var corsOptions = {
//   origin: function (origin, callback) {
//       console.log("ORIGIN -> "+origin)
//     if (whitelist.indexOf(origin) !== -1 || origin == undefined) { 
//       callback(null, true)                                        
//     } else {                                                      
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

// //use cors as middleware
// app.use(cors(corsOptions))

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json())

app.use(session({
    secret: 'asdfg',
    resave: true,
    saveUninitialized: true
}))


//passport middleware
app.use(passport.initialize());
app.use(passport.session());


//flash middleware
app.use(flash());




//middleware for flash messages
app.use(function (req, res, next) {
    res.locals.data = req.flash('success_msg');
    res.locals.error = req.flash('error');
    res.locals.error_msg = req.flash('error_msg');
    next();
})



// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/user.js'));

module.exports = app