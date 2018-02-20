module.exports = function createAuthService({ userRepository, compareHash }) {
  return {
    async authenticate(email, password) {
      if (!email || !password) {
        return null;
      }

      const user = await userRepository.getUserByEmail(email.toLowerCase());
      if (user && compareHash(password, user.password)) {
        const accessToken = await userRepository.generateAccessToken(user.id);
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          roles: user.roles,
          accessToken
        };
      }
      return null;
    },

    async getUserByAccessToken(accessToken) {
      const user = await userRepository.getUserByAccessToken(accessToken);
      if (!user) {
        return null;
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        accessToken
      };
    },

    async logout(token) {
      if (token) {
        await userRepository.clearToken(token);
      }
    }
  };
};
