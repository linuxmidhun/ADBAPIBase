const express = require('express');
const router = express.Router();
var User = require('../models/user.model');

router.post('/logout', async (req, res) => {
    await User.findByIdAndUpdate(req.sessionUser.userId, {
        authtoken: null,
        lastsessionend: Date.now(),
        currentsession: null
    })
        .then(_ => { res.Success("Logged out successfully."); })
        .catch((err) => {
            console.log(err);
            res.Exception("Something went wrong! Please try again later.");
        });
});

module.exports = router;