const bcrypt = require('bcrypt-nodejs');

module.exports = (password, hash) => bcrypt.compareSync(password, hash);
