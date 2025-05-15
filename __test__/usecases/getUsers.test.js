import getUsersFn from '../../usecases/getUsers.js'
import UserRepository from '../../repositories/UserRepository.js';

jest.mock('../../repositories/UserRepository.js');

describe('getUsers', () => {
  beforeEach(() => {
    jest.clearAllMocks(); //  Reset semua mock antar test
  });

  it('should return all users', async () => {
    const users = [
      { id: 1, name: 'John', email: 'john@example.com', gender: 'male' },
      { id: 2, name: 'Jane', email: 'jane@example.com', gender: 'female' }
    ];

    UserRepository.findAll.mockResolvedValue(users);

    const result = await getUsersFn(UserRepository)();

    expect(UserRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(users);
  });

  it('should return empty list if no users', async () => {
    UserRepository.findAll.mockResolvedValue([]);

    const result = await getUsersFn(UserRepository)();

    expect(UserRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  it('should handle database errors gracefully', async () => {
    UserRepository.findAll.mockRejectedValue(new Error('Database error'));

    await expect(getUsersFn(UserRepository)()).rejects.toThrow('Database error');
  });
});
