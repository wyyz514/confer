var bcrypt = require('bcrypt');

module.exports = {
    encryptPass: function (toEncrypt) {
        var hash = bcrypt.hashSync(toEncrypt, 10); //10 is salt rounds...whatever that means
        return hash;
    },
    compare: function (notEncrypted, encrypted) {
        return bcrypt.compareSync(notEncrypted, encrypted);
    }
}