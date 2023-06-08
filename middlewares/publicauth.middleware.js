const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

async function authenticatePublic(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        console.log("No Auth token in request");
        return res.NoAuth();
    }

    var usr = await User.findOne({ authtoken: token }).catch((er) => {
        console.log(er);
        return res.NoAuth();
    });

    if (!usr) {
        console.log("No active session for this user");
        return res.NoAuth();
    }

    jwt.verify(token, process.env.TOKEN_SECRET || 'ADB!MSM-AAP-31052023-SDB-TP', (err, user) => {
        if (err) {
            console.log(err)
            return res.NoAuth();
        }
        req.sessionUser = user

        next()
    })
}

module.exports = authenticatePublic;