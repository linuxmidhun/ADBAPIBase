const mongoose = require('mongoose');

let AccessKeySchema = mongoose.Schema({
    key: {
        type: String
    }
});

var AccessKey = module.exports = mongoose.model('AccessKey', AccessKeySchema);