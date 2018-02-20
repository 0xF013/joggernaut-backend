module.exports = function createRegistrationService({ userRepository, userValidator, createHash }) {
  return {
    async register(name, email, password) {
      await userValidator.validateCreate(name, email, password);
      await userRepository.createUser(name, email.toLowerCase(), createHash(password), []);
    }
  };
};
