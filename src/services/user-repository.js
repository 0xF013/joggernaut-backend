const crypto = require('crypto');

module.exports = function createUserRepository({ db }) {
  return {
    getUserByEmail(email) {
      return db('users').where({ email }).first();
    },

    getUserById(id) {
      return db('users').where({ id }).first();
    },

    async generateAccessToken(id) {
      const accessToken = crypto.randomBytes(64).toString('hex');
      await db('users').where({ id }).update({ access_token: accessToken });
      return accessToken;
    },

    createUser(name, email, password, roles = []) {
      const createdAt = new Date();
      return db('users').insert({ name, email, password, roles, created_at: createdAt });
    },

    updateUser(id, name, email, password) {
      const updatedAt = new Date();
      return db('users').where({ id }).update({ name, email, password, updated_at: updatedAt });
    },

    updateUserRoles(id, roles) {
      const updatedAt = new Date();
      return db('users').where({ id }).update({ roles, updated_at: updatedAt });
    },

    clearToken(token) {
      return db('users').where({ access_token: token }).update({ access_token: null });
    },

    getUserByAccessToken(token) {
      return db('users').where({ access_token: token }).first();
    },

    getAll() {
      return db('users').orderBy('created_at', 'desc');
    },
    delete(id) {
      return db('users').where({ id }).delete();
    }
  };
};
