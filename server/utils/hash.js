const crypto = require('crypto');

/**
 * MD5 hash for a text
 * @param {*} text 
 */
const md5Hash = (text) => {
    const crypto = require('crypto');
    return crypto
        .createHmac('sha256', process.env.SECRET)
        .update(text)
        .digest('hex');
}

module.exports = {
    md5Hash
}
