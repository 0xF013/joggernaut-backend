module.exports = function createAuthService({ userRepository, createHash, userValidator }) {
  const userLense = user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.created_at,
    roles: user.roles
  });

  return {
    getUserById(id) {
      return userRepository.getUserById(id);
    },

    async getAll() {
      const users = await userRepository.getAll();
      return users.map(userLense);
    },

    async create(name, email, password) {
      await userValidator.validateCreate(name, email, password);
      const formattedEmail = email.toLowerCase();
      await userRepository.createUser(name, formattedEmail, createHash(password));
      const user = await userRepository.getUserByEmail(formattedEmail);
      return userLense(user);
    },

    async update(id, name, email, password) {
      await userValidator.validateUpdate(id, name, email, password);
      await userRepository
        .updateUser(id, name, email.toLowerCase(), password && createHash(password));
      const user = await userRepository.getUserById(id);
      return userLense(user);
    },

    async updateRoles(id, roles) {
      await userRepository
        .updateUserRoles(id, roles);
      const user = await userRepository.getUserById(id);
      return userLense(user);
    },

    delete(id) {
      return userRepository.delete(id);
    }
  };
};
