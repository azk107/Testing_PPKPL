import createUserFn from '../../usecases/createUser.js';
import UserRepository from '../../repositories/UserRepository.js';

jest.mock('../../repositories/UserRepository.js');

describe('createUser', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Bersihkan mock sebelum setiap test
  });

  it('should create a user successfully', async () => {
    const data = { name: 'John', email: 'john@example.com', gender: 'male' };
    UserRepository.create.mockResolvedValue(data);

    const result = await createUserFn(UserRepository)(data);

    expect(UserRepository.create).toHaveBeenCalledWith(data);
    expect(result).toEqual(data);
  });

  it('should throw error when fields are missing', async () => {
    const data = { name: '', email: '', gender: '' };

    await expect(createUserFn(UserRepository)(data)).rejects.toThrow('Semua field wajib diisi');
  });

  it('should handle database errors gracefully', async () => {
    const data = { name: 'Jane', email: 'jane@example.com', gender: 'female' };
    UserRepository.create.mockRejectedValue(new Error('Database error'));

    await expect(createUserFn(UserRepository)(data)).rejects.toThrow('Database error');
  });
});
