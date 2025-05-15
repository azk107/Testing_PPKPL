import deleteUserFn from '../../usecases/deleteUser.js';
import UserRepository from '../../repositories/UserRepository.js';

jest.mock('../../repositories/UserRepository.js');

describe('deleteUser', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // reset mock sebelum setiap test
  });

  it('should delete a user successfully', async () => {
    const id = 1;
    UserRepository.findById.mockResolvedValue({ id });
    UserRepository.delete.mockResolvedValue({});

    const result = await deleteUserFn(UserRepository)(id);

    expect(UserRepository.findById).toHaveBeenCalledWith(id);
    expect(UserRepository.delete).toHaveBeenCalledWith(id);
    expect(result.message).toBe('User berhasil dihapus');
  });

  it('should throw error if user not found', async () => {
    const id = 999;
    UserRepository.findById.mockResolvedValue(null);

    await expect(deleteUserFn(UserRepository)(id)).rejects.toThrow('Gagal menghapus, user tidak ditemukan');
  });

  it('should handle database errors gracefully', async () => {
    const id = 1;
    UserRepository.findById.mockResolvedValue({ id });
    UserRepository.delete.mockRejectedValue(new Error('Database error'));

    await expect(deleteUserFn(UserRepository)(id)).rejects.toThrow('Database error');
  });
});
