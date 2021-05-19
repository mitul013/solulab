const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../model/User');

// it is used for check requester is authenticated or not
const { ensureAuthenticated } = require('../middleware/auth');

// this router for redirect to the login page
router.get('/login', (req, res) => {
    res.render("login")
})


// this post request to authenticate and  redirect to Dashboard
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})

// this router for redirect to the register form
router.get('/register', (req, res) => {
    res.render("register")
})

//this post request to create user and validating while creating 
router.post('/register', (req, res) => {
    const { name, email, password, password2, latitude, longitude } = req.body;
    const errors = [];
    if (!name || !email || !password || !password2) {
        errors.push({ msg: "All fields required..." })
    }
    if (password !== password2) {
        errors.push({ msg: "Passwords don't match" });
    }
    if (password.length < 6) {
        errors.push({ msg: "Password must be more than 6 letter" });
    }
    if (errors.length == 0) {

        User.findOne({ email: email })
            .then(user => {
                // if given email id is already present in the database then show error msg
                if (user) {
                   
                    errors.push({ msg: "User is already exist" });
                    res.status(400)
                    res.render("register", { errors, name, email, password });
                }
                else {
                    // if email id is not present in DB then create new user
                    const user = new User({
                        name,
                        email,
                        password,
                        location: { type: "Point", coordinates: [longitude, latitude] }
                    })

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(password, salt, (err, hash) => {
                            if (err) throw new Error(err)
                            user.password = hash;
                            user.save()
                                .then(result => {
                                 
                                    req.flash('success_msg', 'you are registered, You can login now');
                                    res.redirect("/users/login");
                                    res.status(201);
                                })
                                .catch(err => {
                                    errors.push({ msg: err });
                                    res.status(400)
                                    res.render("register", { errors, name, email, password });
                                })
                        })
                    })
                }

            })
            .catch(e => {
                errors.push({ msg: e });
                res.status(400)
                res.render("register", { errors, name, email, password });
            })


    }
    else {
        res.status(400)
        res.render("register", { errors, name, email, password });
    }
})


// it gives us all near by users which lives in less than 500km distance
router.get('/nearby', ensureAuthenticated, (req, res) => {
    //console.log(parseFloat(req.user.location.coordinates[0]), parseFloat(req.user.location.coordinates[1]))
    User.find({
        location: {
            '$near': {
                '$maxDistance': 500000,
                '$geometry': { type: 'Point', coordinates: [parseFloat(req.user.location.coordinates[0]), parseFloat(req.user.location.coordinates[1])] }
            }
        }
    }).then((nearByUsers) => {
        User.findById(req.user._id, (err, data) => {
            if(err){
                res.send(err).status(400);
            }

            let followingIdList = data.following
            let updatedNearByUser = []

            for (let i = 0; i < nearByUsers.length; i++) {

                // check if user is following nearer user or not so later we can disabled follow button
                if (followingIdList.indexOf(nearByUsers[i].id) < 0) {
                    let data = { name: nearByUsers[i].name, _id: nearByUsers[i]._id, isfollow: false }
                    updatedNearByUser.push(data)
                }
                else {
                    let data = { name: nearByUsers[i].name, _id: nearByUsers[i]._id, isfollow: true }
                    updatedNearByUser.push(data)
                }
            }
            res.status(200)
            res.send(updatedNearByUser)
        })


    })

})


// this post request for follow other users
router.post('/follow',ensureAuthenticated, (req, res) => {
    // we add user id to other user's followers list and also update user's following list
    User.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.user._id }
    },
        { new: true },
        (err, data) => {
            if (err) {
                return res.status(422).json({ error: err })
            }
            User.findByIdAndUpdate(req.user._id, {
                $push: { following: req.body.followId }
            },
                { new: true }).then(result => {
                    res.json(result)
                    res.status(200)
                }).catch(err => {
                    res.status(422).json({ error: err })
                })
        })
})

// this post request for unfollow other users
router.post('/unfollow',ensureAuthenticated, (req, res) => {
    // we remove user id to other user's followers list and also update user's following list
    User.findByIdAndUpdate(req.body.followId, {
        $pull: { followers: req.user._id }
    },
        { new: true },
        (err, data) => {
            if (err) {
                return res.status(422).json({ error: err })
            }
            User.findByIdAndUpdate(req.user._id, {
                $pull: { following: req.body.followId }
            },
                { new: true }).then(result => {
                    res.json(result)
                    res.status(200)
                }).catch(err => {
                    res.status(422).json({ error: err })
                })
        })
})



// it return user's followers list
router.get('/followers',ensureAuthenticated, (req, res) => {
    
    User.findById(req.user._id).populate('followers').exec((err, data) => {
        res.json(data)
        res.status(200)
    })

})

// it return user's following list
router.get('/following',ensureAuthenticated, (req, res) => {
    
    User.findById(req.user._id).populate('following').exec((err, data) => {
        res.json(data)
        res.status(200)
    })

})

// it's for user logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'log out successfully');
    res.redirect('/users/login');
})


module.exports = router;