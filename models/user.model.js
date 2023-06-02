const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

let UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true,
        default: ''
    },
    email: {
        type: String,
        default: '',
    },
    phone: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    authtoken: {
        type: String,
        default: null
    },
    lastsession: {
        type: Date,
        default: null
    },
    lastsessionend: {
        type: Date,
        default: null
    },
    currentsession: {
        type: Date,
        default: null
    },
    createdat: {
        type: Date,
        default: null
    },
    createdby: {
        type: String,
        default: 'Self'
    },
    modifiedat: {
        type: Date,
        default: null
    },
    modifiedby: {
        type: String,
        default: 'Self'
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserByUsername = async function (username) {
    var query = { username: username };
    var user = await User.findOne(query);
    return user;
};

module.exports.getUserByEmail = async function (email) {
    var query = { email: email };
    var user = await User.findOne(query);
    return user;
};

module.exports.getUserByPhone = async function (phone) {
    var query = { phone: phone };
    var user = await User.findOne(query);
    return user;
};

module.exports.getUserById = async function (id) {
    var user = await User.findById(id);
    return user;
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err) {
            console.log(err);
            callback(null, false);
        } else {
            callback(null, isMatch);
        }
    });
};