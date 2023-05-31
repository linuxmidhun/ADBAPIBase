const express = require('express');
const route = express.Router();
const reqverify = require('../middlewares/requestverify');

route.post('/login', reqverify, (req, res) => {
    var request = req.body;
    console.log(request);
    res.status(200).json({
        status: 200,
        message: "LoggedIn successfully.",
        data: {
            token: "token"
        }
    })
});

module.exports = route;