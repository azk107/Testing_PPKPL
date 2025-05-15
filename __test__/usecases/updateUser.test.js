import updateUserFn from '../../usecases/updateUser.js';
import UserRepository from '../../repositories/UserRepository.js';

jest.mock('../../repositories/UserRepository.js');

describe('updateUser', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // reset mock sebelum setiap test
  });
  
  it('should update a user successfully', async () => {
    const id = 1;
    const updatedData = { name: 'Jane', email: 'jane@example.com' };
    UserRepository.update.mockResolvedValue([1]); 

    const result = await updateUserFn(UserRepository)(id, updatedData);

    expect(UserRepository.update).toHaveBeenCalledWith(id, updatedData);
    expect(result.message).toBe('User berhasil diperbarui');
  });

  it('should throw error if user not found', async () => {
    const id = 999;
    const updatedData = { name: 'Jane' };
    UserRepository.update.mockResolvedValue([0]); 

    try {
      await updateUserFn(UserRepository)(id, updatedData);
    } catch (error) {
      expect(error.message).toBe('User gagal diperbarui');
    }
  });

  it('should throw error if id is missing', async () => {
    const updatedData = { name: 'Jane' };

    try {
      await updateUserFn(UserRepository)(null, updatedData);
    } catch (error) {
      expect(error.message).toBe('ID tidak boleh kosong');
    }
  });
});
