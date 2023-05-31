var AccessKey = require('../models/accesskey.model');

async function verifyRequest(req, res, next) {
    const requestWith = req.headers['x-requested-with'];
    const thisKey = requestWith;

    if (thisKey == null || thisKey == '') {
        console.log("Someone tried to open our doors with out a key. We kept the doors closed.");
        return res.status(403).json({
            status: 403,
            message: "Ah... Oh! This is a forbidden fruit."
        });
    }

    var key = await AccessKey.findOne({ key: thisKey }).catch((er) => {
        if (err) console.log(er);
        console.log("Someone tried to open our doors with a key, but the keyhole is jammed it seems. We kept the doors closed.");
        return res.status(403).json({
            status: 403,
            message: "Ah... Oh! This is a forbidden fruit."
        });
    });

    if (!key) {
        console.log("Someone tried to open our doors with a FAKE key. We kept the doors closed.");
        return res.status(403).json({
            status: 403,
            message: "Ah... Oh! This is a forbidden fruit."
        });
    }

    next();
};

module.exports = verifyRequest;