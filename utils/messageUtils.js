const config = require('../config.json');

function isAdmin(number) {
    return config.adminNumbers.includes(number);
}

function isOwner(number) {
    return number === config.ownerNumber;
}

module.exports = {
    isAdmin,
    isOwner,
};

