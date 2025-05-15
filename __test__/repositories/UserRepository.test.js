import User from "../../models/UserModel.js";
import UserRepository from "../../repositories/UserRepository.js";

// Mocking model User
jest.mock("../../models/UserModel.js");

describe("UserRepository", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // CREATE
  describe("create", () => {
    it("should create a user with valid data", async () => {
      const data = { name: "Azka", email: "azka@email.com", gender: "female" };
      User.create.mockResolvedValue(data);
      const result = await UserRepository.create(data);
      expect(User.create).toHaveBeenCalledWith(data);
      expect(result).toEqual(data);
    });

    it("should throw error if create fails", async () => {
      const data = { name: "", email: "", gender: "" };
      User.create.mockRejectedValue(new Error("DB Error"));
      await expect(UserRepository.create(data)).rejects.toThrow("DB Error");
    });

    it("should call create exactly once", async () => {
      const data = { name: "Test", email: "t@test.com", gender: "other" };
      User.create.mockResolvedValue(data);
      await UserRepository.create(data);
      expect(User.create).toHaveBeenCalledTimes(1);
    });
  });

  // FIND ALL
  describe("findAll", () => {
    it("should return all users", async () => {
      const users = [{ id: 1 }, { id: 2 }];
      User.findAll.mockResolvedValue(users);
      const result = await UserRepository.findAll();
      expect(result).toEqual(users);
    });

    it("should call findAll once", async () => {
      User.findAll.mockResolvedValue([]);
      await UserRepository.findAll();
      expect(User.findAll).toHaveBeenCalledTimes(1);
    });

    it("should handle findAll failure", async () => {
      User.findAll.mockRejectedValue(new Error("Find failed"));
      await expect(UserRepository.findAll()).rejects.toThrow("Find failed");
    });
  });

  // FIND BY ID
  describe("findById", () => {
    it("should return a user by ID", async () => {
      const user = { id: 1, name: "Azka" };
      User.findByPk.mockResolvedValue(user);
      const result = await UserRepository.findById(1);
      expect(result).toEqual(user);
    });

    it("should return null if not found", async () => {
      User.findByPk.mockResolvedValue(null);
      const result = await UserRepository.findById(999);
      expect(result).toBeNull();
    });

    it("should handle errors", async () => {
      User.findByPk.mockRejectedValue(new Error("DB error"));
      await expect(UserRepository.findById(1)).rejects.toThrow("DB error");
    });
  });

  // UPDATE
  describe("update", () => {
    it("should update user with valid data", async () => {
      User.update.mockResolvedValue([1]);
      const result = await UserRepository.update(1, { name: "Baru" });
      expect(User.update).toHaveBeenCalledWith({ name: "Baru" }, { where: { id: 1 } });
      expect(result).toEqual([1]);
    });

    it("should return 0 if user not found", async () => {
      User.update.mockResolvedValue([0]);
      const result = await UserRepository.update(999, { name: "Gagal" });
      expect(result).toEqual([0]);
    });

    it("should handle update errors", async () => {
      User.update.mockRejectedValue(new Error("Update Error"));
      await expect(UserRepository.update(1, {})).rejects.toThrow("Update Error");
    });
  });

  // DELETE
  describe("delete", () => {
    it("should delete a user by ID", async () => {
      User.destroy.mockResolvedValue(1);
      const result = await UserRepository.delete(1);
      expect(User.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toBe(1);
    });

    it("should return 0 if no user is deleted", async () => {
      User.destroy.mockResolvedValue(0);
      const result = await UserRepository.delete(999);
      expect(result).toBe(0);
    });

    it("should handle delete errors", async () => {
      User.destroy.mockRejectedValue(new Error("Delete error"));
      await expect(UserRepository.delete(1)).rejects.toThrow("Delete error");
    });
  });
});
