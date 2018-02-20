const createAuthService = require('./auth-service');

describe('auth service', () => {
  describe('getUserByEmail()', () => {
    const compareHash = () => false;
    const userRepository = {
      getUserByEmail: () => {},
      generateAccessToken: () => 'my access token'
    };

    it('compares the incoming password against the hash', async () => {
      const compareHash = jest.fn(() => 'passwordHash');
      const userRepository = {
        getUserByEmail: () => ({ password: 'anotherPasswordHash' }),
        generateAccessToken: () => 'my access token'
      };
      const authService = createAuthService({ compareHash, userRepository });
      await authService.authenticate('user@example.com', '123123');
      expect(compareHash).toHaveBeenCalledWith('123123', 'anotherPasswordHash');
    });

    it('queries userRepository with the given downcased email', async () => {
      const userRepository = {
        getUserByEmail: jest.fn()
      };
      const authService = createAuthService({ compareHash, userRepository });
      await authService.authenticate('usEr@example.com', '123123');
      expect(userRepository.getUserByEmail).toHaveBeenCalledWith('user@example.com');
    });


    describe('when user is not found', () => {
      it('returns null', async () => {
        const authService = createAuthService({ compareHash, userRepository });
        const authenticationPayload = await authService.authenticate('user@example.com', '123123');
        expect(authenticationPayload).toBeNull();
      });
    });

    describe('when email or password in undefined', () => {
      it('returns null', async () => {
        const authService = createAuthService({ compareHash, userRepository });
        const authenticationPayload = await authService.authenticate();
        expect(authenticationPayload).toBeNull();
      });
    });

    describe('when hashes do not match', () => {
      it('returns null', async () => {
        const userRepository = {
          getUserByEmail: () => ({ password: 'anotherPasswordHash' })
        };
        const authService = createAuthService({ compareHash, userRepository });
        const authenticationPayload = await authService.authenticate('user@example.com', '123123');
        expect(authenticationPayload).toBeNull();
      });
    });

    describe('when hashes match', () => {
      it('returns the user\'s name, email, access token and roles', async () => {
        const compareHash = () => true;
        const userRepository = {
          getUserByEmail: () => ({ name: 'John Doe', email: 'user@example.com', access_token: 'iddqd', password: 'passwordHash', roles: [] }),
          generateAccessToken: () => 'iddqd'
        };
        const authService = createAuthService({ compareHash, userRepository });
        const authenticationPayload = await authService.authenticate('user@example.com', '123123');
        expect(authenticationPayload).toEqual({
          name: 'John Doe',
          email: 'user@example.com',
          accessToken: 'iddqd',
          roles: []
        });
      });

      it('generates an access token', async () => {
        const compareHash = () => true;
        const generateAccessToken = jest.fn(() => 'iddqd');
        const userRepository = {
          getUserByEmail: () => ({ id: 12 }),
          generateAccessToken
        };
        const authService = createAuthService({ compareHash, userRepository });

        await authService.authenticate('user@example.com', '123123');
        expect(generateAccessToken).toHaveBeenCalledWith(12);
      });
    });
  });
});
