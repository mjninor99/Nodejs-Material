const bcrypt = require('bcryptjs');
const handlebars = require('handlebars');

const helpers = {};

helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

helpers.matchPassword = async (password, savedPassword) => {
    try {
        return await bcrypt.compare(password, savedPassword);
    } catch (e) {
        console.log(e);
    }
};

helpers.eq = function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
};

module.exports = helpers;