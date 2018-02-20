const bcrypt = require('bcrypt-nodejs');

module.exports = {
  compareHash: (password, hash) => bcrypt.compareSync(password, hash),
  createHash: password => bcrypt.hashSync(password)
};

