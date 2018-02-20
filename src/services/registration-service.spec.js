const createRegistrationService = require('./registration-service');

describe('registration service', () => {
  describe('register()', () => {
    it('validates the input', async () => {
      const userRepository = { createUser: () => {} };
      const userValidator = { validateCreate: jest.fn() };
      const createHash = () => {};
      const registrationService = createRegistrationService({
        userRepository, createHash, userValidator
      });
      await registrationService.register('name', 'Some@email', '123123');
      expect(userValidator.validateCreate).toHaveBeenCalledWith('name', 'Some@email', '123123');
    });

    it('saves the user with the downcased email and hashed password', async () => {
      const userValidator = {
        validateCreate: () => {}
      };
      const userRepository = {
        createUser: jest.fn(() => null),
      };
      const createHash = jest.fn(() => 'somehash');
      const registrationService = createRegistrationService({
        userRepository, createHash, userValidator
      });
      await registrationService.register('name', 'Some@email', '123123');
      expect(userRepository.createUser).toHaveBeenCalledWith('name', 'some@email', 'somehash', []);
      expect(createHash).toHaveBeenCalledWith('123123');
    });
  });
});
