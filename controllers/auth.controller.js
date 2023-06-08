const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var User = require('../models/user.model');
const { validate, Joi } = require('express-validation');

const loginValidation = {
    body: Joi.object({
        username: Joi.string()
            .required(),
        password: Joi.string()
            .regex(/[a-zA-Z0-9]{3,30}/)
            .required(),
    }),
};

const registrationValidation = {
    body: Joi.object({
        username: Joi.string()
            .required(),
        email: Joi.string()
            .email()
            .required(),
        phone: Joi.string()
            .required(),
        password: Joi.string()
            .regex(/[a-zA-Z0-9]{3,30}/)
            .required(),
    }),
}

router.post('/register', validate(registrationValidation, {}, {}), async (req, res) => {
    let request = req.body;
    var user = await User.findOne({
        "$or": [
            { username: request.username },
            { email: request.email },
        ]
    })
        .catch(err => {
            console.log(err);
            res.Exception("Error registering user.");
        });
    if (!user) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                console.log('error in gensalt');
                console.log(err);
                return res.Error("Error registering user.");
            }
            bcrypt.hash(request.password, salt, function (err, hash) {
                if (err) {
                    console.log('error in hash');
                    console.log(err);
                    return res.Error("Error registering user.");
                }
                var newUser = new User({
                    username: request.username,
                    email: request.email,
                    phone: request.phone,
                    password: hash,
                    createdat: Date.now()
                });
                newUser.save()
                    .then(_ => { res.Success("User registered successfully."); })
                    .catch(err => {
                        console.log(err);
                        res.Error("Error registering user.");
                    });
            });
        });
    } else res.Exists("The user already exists.");
});

router.post('/login', validate(loginValidation, {}, {}), async (req, res) => {
    let request = req.body;
    var user = await User.findOne({
        "$or": [
            { username: request.username },
            { email: request.username },
            { phone: request.username }]
    })
        .catch(err => {
            console.log(err);
            res.Exception("Error logging in.");
        });
    if (!user) res.NotFound("User not found.");
    else {
        User.comparePassword(request.password, user.password, async function (err, isMatch) {
            if (err) {
                console.log(err);
                res.Error("User not found.");
            } else {
                if (!isMatch) res.NotFound("User not found.");
                else {
                    if (!user.currentsession) {
                        user.currentsession = Date.now();
                    } else {
                        user.lastsession = user.currentsession;
                        user.currentsession = Date.now();
                    };
                    let token;
                    try {
                        //Creating jwt token
                        token = jwt.sign(
                            { userId: user._id, username: user.username, email: user.email },
                            process.env.TOKEN_SECRET || "ADB!MSM-AAP-31052023-SDB-TP",
                            {
                                expiresIn: "4380h",
                            }
                        );
                    } catch (err) {
                        console.log(err);
                        const error = new Error("Error! Something went wrong.");
                        return next(error);
                    }
                    user.authtoken = token;
                    await User.findByIdAndUpdate(user._id, {
                        currentsession: user.currentsession,
                        lastsession: user.lastsession, authtoken: user.authtoken
                    }).catch((er) => {
                        console.log("Error updating the session for " + user.username);
                        console.log(er);
                    });
                    res.Success("User found", { token: user.authtoken });
                }
            }
        });
    }
});



module.exports = router;