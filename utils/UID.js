var shortid = require('shortid');

class UID {
    static create = () => shortid.generate();

    static isValid = (uid) => shortid.isValid(uid);
};

module.exports = UID;