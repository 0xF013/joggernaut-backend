const db = require('./db')();
const { compareHash, createHash } = require('./hash-service');
const userRepository = require('./user-repository')({ db });
const jogRepository = require('./jog-repository')({ db });
const userValidator = require('./user-validator')({ userRepository });
const jogValidator = require('./jog-validator')({ jogRepository });
const authService = require('./auth-service')({ userRepository, compareHash });
const registrationService = require('./registration-service')({
  userRepository,
  userValidator,
  createHash
});
const userService = require('./user-service')({
  userRepository,
  userValidator,
  createHash
});
const jogService = require('./jog-service')({
  jogRepository,
  jogValidator
});


module.exports = {
  authService,
  registrationService,
  userService,
  jogService
};
