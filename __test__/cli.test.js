import readline from 'readline';
import UserController from '../controllers/UserController.js';
import { promptMenu, initCLI } from '../cli.js';

jest.mock('readline');
jest.mock('../controllers/UserController.js', () => ({
  getAllUsers: jest.fn(),
  createUserController: jest.fn(),
  updateUserController: jest.fn(),
  deleteUserController: jest.fn(),
  getUserByIdController: jest.fn(),
}));

describe('CLI Tests', () => {
  let rl;

  beforeEach(() => {
    rl = {
      question: jest.fn(),
      close: jest.fn(),
    };
    readline.createInterface.mockReturnValue(rl);
    initCLI(rl);
    jest.clearAllMocks();
  });

  it('should display all users when option 1 is selected', async () => {
    UserController.getAllUsers.mockResolvedValue([]);
    rl.question.mockImplementationOnce((_, callback) => callback('1'));

    await promptMenu();

    expect(UserController.getAllUsers).toHaveBeenCalled();
    expect(rl.question).toHaveBeenCalled();
  });

  it('should add a user when option 2 is selected', async () => {
    rl.question
      .mockImplementationOnce((_, callback) => callback('2'))
      .mockImplementationOnce((_, callback) => callback('John'))
      .mockImplementationOnce((_, callback) => callback('john@example.com'))
      .mockImplementationOnce((_, callback) => callback('male'));

    UserController.createUserController.mockResolvedValue();

    await promptMenu();

    expect(UserController.createUserController).toHaveBeenCalledWith('John', 'john@example.com', 'male');
    expect(rl.question).toHaveBeenCalledTimes(4);
  });

  it('should exit when option 6 is selected', async () => {
    rl.question.mockImplementationOnce((_, callback) => callback('6'));

    await promptMenu();

    expect(rl.close).toHaveBeenCalled();
  });

  it('should handle invalid menu options gracefully', async () => {
    rl.question
      .mockImplementationOnce((_, callback) => callback('invalid'))
      .mockImplementationOnce((_, callback) => callback('6'));

    await promptMenu();

    expect(rl.question).toHaveBeenCalledTimes(2);
  });
});