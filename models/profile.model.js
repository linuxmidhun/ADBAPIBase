const mongoose = require('mongoose');

let ArtScheme = mongoose.Schema({
    userid: {
        type: String,
        default: ''
    },
    artids: {
        type: Array,
        default: ''
    },
    description: {
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

var Art = module.exports = mongoose.model('Art', ArtScheme);