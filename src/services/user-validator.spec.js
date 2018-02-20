const createUserValidator = require('./user-validator');

const userRepository = {
  getUserByEmail: () => null,
  createUser: () => null,
};

async function expectValidationError(action, errorKey, errorMessage) {
  let hasThrown = false;
  try {
    await action();
  } catch (e) {
    hasThrown = true;
    expect(e.validationErrors[errorKey]).toBe(errorMessage);
  }
  if (!hasThrown) {
    throw new Error(`Error not present: ${errorKey} / ${errorMessage}`);
  }
}

describe('user-validator', () => {
  const userValidator = createUserValidator({ userRepository });
  describe('validateCreate()', () => {
    it('empty name', async () => {
      await expectValidationError(
        () => userValidator.validateCreate(null, 'some@email', 'password'),
        'name', 'NAME_REQUIRED'
      );
    });

    it('empty password', async () => {
      await expectValidationError(
        () => userValidator.validateCreate('name', 'some@email', undefined),
        'password', 'PASSWORD_TOO_SHORT'
      );
    });

    it('short password', async () => {
      await expectValidationError(
        () => userValidator.validateCreate('name', 'some@email', '123'),
        'password', 'PASSWORD_TOO_SHORT'
      );
    });

    it('empty email', async () => {
      await expectValidationError(
        () => userValidator.validateCreate('name', undefined, '123123'),
        'email', 'EMAIL_REQUIRED'
      );
    });

    it('invalid email', async () => {
      await expectValidationError(
        () => userValidator.validateCreate('name', 'invalid_email', '123123'),
        'email', 'EMAIL_INVALID'
      );
    });

    it('already in use email', async () => {
      const userRepository = {
        getUserByEmail: jest.fn(() => ({ name: 'SomeUser' })),
        createUser: () => null,
      };
      const userValidator = createUserValidator({ userRepository });
      await expectValidationError(
        () => userValidator.validateCreate('name', 'existing@email', '123123'),
        'email', 'EMAIL_IN_USE'
      );
    });

    it('downcased email', async () => {
      const userRepository = {
        getUserByEmail: jest.fn(() => ({ name: 'SomeUser' })),
        createUser: () => null,
      };
      const userValidator = createUserValidator({ userRepository });
      try {
        await userValidator.validateCreate('name', 'eXisting@email', '123123');
      } catch (e) {
        expect(userRepository.getUserByEmail).toHaveBeenCalledWith('existing@email');
      }
    });
  });

  describe('validateUpdate()', () => {
    it('empty name', async () => {
      await expectValidationError(
        () => userValidator.validateUpdate(1, null, 'some@email', 'password'),
        'name', 'NAME_REQUIRED'
      );
    });

    it('empty password by allowing undefined', async () => {
      expect(userValidator.validateUpdate(1, 'name', 'some@email', undefined)).resolves.toBeDefined();
    });

    it('short password', async () => {
      await expectValidationError(
        () => userValidator.validateUpdate(1, 'name', 'some@email', '123'),
        'password', 'PASSWORD_TOO_SHORT'
      );
    });

    it('empty email', async () => {
      await expectValidationError(
        () => userValidator.validateUpdate(1, 'name', undefined, '123123'),
        'email', 'EMAIL_REQUIRED'
      );
    });

    it('invalid email', async () => {
      await expectValidationError(
        () => userValidator.validateUpdate(1, 'name', 'invalid_email', '123123'),
        'email', 'EMAIL_INVALID'
      );
    });

    it('already in use email by another user', async () => {
      const userRepository = {
        getUserByEmail: jest.fn(() => ({ id: 2, name: 'SomeUser' })),
        createUser: () => null,
      };
      const userValidator = createUserValidator({ userRepository });
      await expectValidationError(
        () => userValidator.validateUpdate(1, 'name', 'existing@email', '123123'),
        'email', 'EMAIL_IN_USE'
      );
    });

    it('already in use email by same user', async () => {
      const userRepository = {
        getUserByEmail: jest.fn(() => ({ id: 1, name: 'SomeUser' })),
        createUser: () => null,
      };
      const userValidator = createUserValidator({ userRepository });
      expect(userValidator.validateUpdate(1, 'name', 'existing@email', '123123')).resolves.toBeDefined();
    });

    it('downcased email', async () => {
      const userRepository = {
        getUserByEmail: jest.fn(() => ({ name: 'SomeUser' })),
        createUser: () => null,
      };
      const userValidator = createUserValidator({ userRepository });
      try {
        await userValidator.validateUpdate(1, 'name', 'eXisting@email', '123123');
      } catch (e) {
        expect(userRepository.getUserByEmail).toHaveBeenCalledWith('existing@email');
      }
    });
  });
});
