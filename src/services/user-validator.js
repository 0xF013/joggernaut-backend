module.exports = function createUserValidator({ userRepository }) {
  async function validate(isUpdate, { id, name, email, password }) {
    const validationErrors = {};

    if (!name) {
      validationErrors.name = 'NAME_REQUIRED';
    }
    if (isUpdate) {
      if (password && password.length < 6) {
        validationErrors.password = 'PASSWORD_TOO_SHORT';
      }
    } else if (!password || password.length < 6) {
      validationErrors.password = 'PASSWORD_TOO_SHORT';
    }
    if (!email) {
      validationErrors.email = 'EMAIL_REQUIRED';
    } else if (!email.match(/\w@\w/)) {
      validationErrors.email = 'EMAIL_INVALID';
    } else {
      const user = await userRepository.getUserByEmail(email.toLowerCase());
      if (user) {
        if (isUpdate) {
          if (user.id !== id) {
            validationErrors.email = 'EMAIL_IN_USE';
          }
        } else {
          validationErrors.email = 'EMAIL_IN_USE';
        }
      }
    }

    if (Object.keys(validationErrors).length) {
      const error = new Error();
      error.validationErrors = validationErrors;
      throw error;
    }
  }

  return {
    async validateCreate(name, email, password) {
      await validate(false, { name, email, password });
      return true;
    },
    async validateUpdate(id, name, email, password) {
      await validate(true, { id, name, email, password });
      return true;
    }
  };
};
