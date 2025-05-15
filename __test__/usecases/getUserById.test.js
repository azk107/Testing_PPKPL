import getUserByIdFn from '../../usecases/getUserById.js';
import UserRepository from '../../repositories/UserRepository.js';

jest.mock('../../repositories/UserRepository.js');

describe('getUserById', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // reset mock sebelum setiap test
  });

  it('should return user if found', async () => {
    const id = 1;
    const user = { id, name: 'John', email: 'john@example.com', gender: 'male' };
    UserRepository.findById.mockResolvedValue(user);

    const result = await getUserByIdFn(UserRepository)(id);

    expect(UserRepository.findById).toHaveBeenCalledWith(id);
    expect(result).toEqual(user);
  });

  it('should return null if user not found', async () => {
    const id = 999;
    UserRepository.findById.mockResolvedValue(null);

    await expect(getUserByIdFn(UserRepository)(id)).rejects.toThrow(`User dengan ID ${id} tidak ditemukan.`);
  });

  it('should throw error if id is missing', async () => {
    try {
      await getUserByIdFn(UserRepository)(null);
    } catch (error) {
      expect(error.message).toBe('ID tidak boleh kosong');
    }
  });
});
