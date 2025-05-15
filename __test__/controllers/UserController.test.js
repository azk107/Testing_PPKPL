import UserController from "../../controllers/UserController.js";
import UserRepository from "../../repositories/UserRepository.js";

// Mock semua usecase (injectable functions)
import createUserFn from "../../usecases/createUser.js";
import getUsersFn from "../../usecases/getUsers.js";
import getUserByIdFn from "../../usecases/getUserById.js";
import updateUserFn from "../../usecases/updateUser.js";
import deleteUserFn from "../../usecases/deleteUser.js";


// Mock dependency usecases
jest.mock("../../usecases/createUser.js");
jest.mock("../../usecases/getUsers.js");
jest.mock("../../usecases/getUserById.js");
jest.mock("../../usecases/updateUser.js");
jest.mock("../../usecases/deleteUser.js");

describe("UserController", () => {
  let mockCreateUser, mockGetUsers, mockGetUserById, mockUpdateUser, mockDeleteUser;

  beforeEach(() => {
    // Buat mock return dari masing-masing usecase function
    mockCreateUser = jest.fn();
    mockGetUsers = jest.fn();
    mockGetUserById = jest.fn();
    mockUpdateUser = jest.fn();
    mockDeleteUser = jest.fn();

    createUserFn.mockReturnValue(mockCreateUser);
    getUsersFn.mockReturnValue(mockGetUsers);
    getUserByIdFn.mockReturnValue(mockGetUserById);
    updateUserFn.mockReturnValue(mockUpdateUser);
    deleteUserFn.mockReturnValue(mockDeleteUser);

    // Inject ulang fungsi ke UserController
    UserController.createUserController = async (name, email, gender) => {
      await mockCreateUser({ name, email, gender });
      console.log("User berhasil ditambahkan");
    };

    UserController.getAllUsers = async () => {
      const users = await mockGetUsers();
      console.table(users.map((u) => u.dataValues));
    };

    UserController.getUserByIdController = async (id) => {
      const user = await mockGetUserById(id);
      if (user) {
        console.table([user.dataValues]);
      }
      return user;
    };

    UserController.updateUserController = async (id, updatedData) => {
      const result = await mockUpdateUser(id, updatedData);
      console.log(result.message);
    };

    UserController.deleteUserController = async (id) => {
      const result = await mockDeleteUser(id);
      console.log(result.message);
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // createUserController
  test("createUserController should call createUser and log message", async () => {
    mockCreateUser.mockResolvedValue();
    console.log = jest.fn();

    await UserController.createUserController("Azka", "azka@email.com", "female");

    expect(mockCreateUser).toHaveBeenCalledWith({
      name: "Azka",
      email: "azka@email.com",
      gender: "female",
    });

    expect(console.log).toHaveBeenCalledWith("User berhasil ditambahkan");
  });

  test("createUserController should handle error from usecase", async () => {
    const error = new Error("Creation failed");
    mockCreateUser.mockRejectedValue(error);
    console.log = jest.fn();
  
    await expect(UserController.createUserController("Azka", "azka@email.com", "female")).rejects.toThrow("Creation failed");
  });

  test("createUserController should handle missing input", async () => {
    mockCreateUser.mockResolvedValue();
    console.log = jest.fn();
  
    await UserController.createUserController("", "", "");
    expect(mockCreateUser).toHaveBeenCalledWith({
      name: "",
      email: "",
      gender: "",
    });
  });

//getAllUsers
  test("getAllUsers should call getUsers and print users", async () => {
    const mockUsers = [
      { dataValues: { id: 1, name: "Azka" } },
      { dataValues: { id: 2, name: "Amalia" } },
    ];
    mockGetUsers.mockResolvedValue(mockUsers);
    console.table = jest.fn();

    await UserController.getAllUsers();

    expect(mockGetUsers).toHaveBeenCalled();
    expect(console.table).toHaveBeenCalledWith([
      { id: 1, name: "Azka" },
      { id: 2, name: "Amalia" },
    ]);
  });

  test("getAllUsers should handle error from usecase", async () => {
    const error = new Error("Failed to fetch users");
    mockGetUsers.mockRejectedValue(error);
    console.table = jest.fn();
  
    await expect(UserController.getAllUsers()).rejects.toThrow("Failed to fetch users");
  });

  test("getAllUsers should handle empty user list", async () => {
    mockGetUsers.mockResolvedValue([]);
    console.table = jest.fn();
  
    await UserController.getAllUsers();
  
    expect(console.table).toHaveBeenCalledWith([]);
  });

//getUserByIdController
  test("getUserByIdController should call getUserById and print user if exists", async () => {
    const mockUser = { dataValues: { id: 1, name: "Azka" } };
    mockGetUserById.mockResolvedValue(mockUser);
    console.table = jest.fn();

    const result = await UserController.getUserByIdController(1);

    expect(mockGetUserById).toHaveBeenCalledWith(1);
    expect(console.table).toHaveBeenCalledWith([mockUser.dataValues]);
    expect(result).toEqual(mockUser);
   
  });

  test("getUserByIdController should handle user not found", async () => {
    mockGetUserById.mockResolvedValue(null);
    console.table = jest.fn();
  
    const result = await UserController.getUserByIdController(999);
  
    expect(mockGetUserById).toHaveBeenCalledWith(999);
    expect(console.table).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  test("getUserByIdController should throw error if getUserById fails", async () => {
    const error = new Error("Database error");
    mockGetUserById.mockRejectedValue(error);
  
    await expect(UserController.getUserByIdController(1)).rejects.toThrow("Database error");
  });

// updateUserController
  test("updateUserController should call updateUser and log message", async () => {
    const message = { message: "User updated successfully" };
    mockUpdateUser.mockResolvedValue(message);
    console.log = jest.fn();

    await UserController.updateUserController(1, { name: "Updated" });

    expect(mockUpdateUser).toHaveBeenCalledWith(1, { name: "Updated" });
    expect(console.log).toHaveBeenCalledWith("User updated successfully");
  });

  test("updateUserController should handle error from usecase", async () => {
    const error = new Error("Update failed");
    mockUpdateUser.mockRejectedValue(error);
    console.log = jest.fn();
  
    await expect(UserController.updateUserController(1, { name: "Updated" })).rejects.toThrow("Update failed");
  });

  test("updateUserController should handle empty updatedData", async () => {
    const message = { message: "Nothing to update" };
    mockUpdateUser.mockResolvedValue(message);
    console.log = jest.fn();
  
    await UserController.updateUserController(1, {});
    expect(mockUpdateUser).toHaveBeenCalledWith(1, {});
    expect(console.log).toHaveBeenCalledWith("Nothing to update");
  });

// deleteUserController
  test("deleteUserController should call deleteUser and log message", async () => {
    const message = { message: "User deleted successfully" };
    mockDeleteUser.mockResolvedValue(message);
    console.log = jest.fn();

    await UserController.deleteUserController(1);

    expect(mockDeleteUser).toHaveBeenCalledWith(1);
    expect(console.log).toHaveBeenCalledWith("User deleted successfully");
  });

  test("deleteUserController should handle error from usecase", async () => {
    const error = new Error("Delete failed");
    mockDeleteUser.mockRejectedValue(error);
    console.log = jest.fn();
  
    await expect(UserController.deleteUserController(1)).rejects.toThrow("Delete failed");
  });
  
  test("deleteUserController should handle invalid ID", async () => {
    const message = { message: "User not found" };
    mockDeleteUser.mockResolvedValue(message);
    console.log = jest.fn();
  
    await UserController.deleteUserController("abc");
    expect(mockDeleteUser).toHaveBeenCalledWith("abc");
    expect(console.log).toHaveBeenCalledWith("User not found");
  });
});
