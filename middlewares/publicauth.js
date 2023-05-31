const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

async function authenticatePublic(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.status(401).json({
        status: 401,
        message: "Not authorized."
    });

    var usr = await User.findOne({ authtoken: token }).catch((er) => {
        console.log(er);
        return res.status(401).json({
            status: 401,
            message: "Not authorized"
        });
    });

    if (!usr) {
        console.log("No active session for this user");
        return res.status(401).json({
            status: 401,
            message: "Not authorized."
        });
    }

    jwt.verify(thisToken, process.env.TOKEN_SECRET || 'ADB!MSM-AAP-31052023-SDB-TP', (err, user) => {
        if (err) {
            console.log(err)
            return res.status(403).json({
                status: 403,
                message: "Not authorized."
            });
        }
        console.log(user);
        req.sessionUser = user

        next()
    })
}

module.exports = authenticatePublic;