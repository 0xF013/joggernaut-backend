const createUserService = require('./user-service');


describe('user service', () => {
  describe('create()', () => {
    beforeEach(async () => {
      this.mockRawUser = { id: 1, name: 'some name', email: 'email@example.com', created_at: new Date(), roles: [] };
      this.createHash = jest.fn(() => 'my hash');
      this.userValidator = { validateCreate: jest.fn() };
      this.userRepository = {
        createUser: jest.fn(() => {}),
        getUserByEmail: jest.fn(() => this.mockRawUser)
      };
      this.userService = createUserService({
        userRepository: this.userRepository,
        userValidator: this.userValidator,
        createHash: this.createHash
      });
      this.result = await this.userService.create('name', 'some@eMail', '123321');
    });

    it('validates', () => {
      expect(this.userValidator.validateCreate).toHaveBeenCalledWith('name', 'some@eMail', '123321');
    });

    it('hashes the password', () => {
      expect(this.createHash).toHaveBeenCalledWith('123321');
    });

    it('creates the user', () => {
      expect(this.userRepository.createUser).toHaveBeenCalledWith('name', 'some@email', 'my hash');
    });

    it('returns the correct result', () => {
      expect(this.result).toEqual({
        id: this.mockRawUser.id,
        name: this.mockRawUser.name,
        email: this.mockRawUser.email,
        createdAt: expect.any(Date),
        roles: []
      });
    });
  });

  describe('udpate()', () => {
    beforeEach(async () => {
      this.mockRawUser = { id: 1, name: 'some name', email: 'email@example.com', created_at: new Date(), roles: [] };
      this.createHash = jest.fn(() => 'my hash');
      this.userValidator = { validateUpdate: jest.fn() };
      this.userRepository = {
        updateUser: jest.fn(() => {}),
        getUserById: jest.fn(() => this.mockRawUser)
      };
      this.userService = createUserService({
        userRepository: this.userRepository,
        userValidator: this.userValidator,
        createHash: this.createHash
      });
      this.result = await this.userService.update(1, 'name', 'some@eMail', '123321');
    });

    it('validates', () => {
      expect(this.userValidator.validateUpdate).toHaveBeenCalledWith(1, 'name', 'some@eMail', '123321');
    });

    it('hashes the password', () => {
      expect(this.createHash).toHaveBeenCalledWith('123321');
    });

    it('udpates the user', () => {
      expect(this.userRepository.updateUser).toHaveBeenCalledWith(1, 'name', 'some@email', 'my hash');
    });

    it('returns the correct result', () => {
      expect(this.result).toEqual({
        id: this.mockRawUser.id,
        name: this.mockRawUser.name,
        email: this.mockRawUser.email,
        createdAt: expect.any(Date),
        roles: []
      });
    });
  });
});
