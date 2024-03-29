const mongoose = require('mongoose');

let AccessKeySchema = mongoose.Schema({
    key: {
        type: String,
        default: ''
    },
    active: {
        type: Boolean,
        default: false
    },
    createdat: {
        type: Date,
        default: null
    },
    createdby: {
        type: String,
        default: 'system'
    },
    modifiedat: {
        type: Date,
        default: null,
    },
    modifiedby: {
        type: String,
        default: 'system'
    }
});

var AccessKey = module.exports = mongoose.model('AccessKey', AccessKeySchema);