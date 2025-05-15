import createUser from "../usecases/createUser.js";
import getUsers from "../usecases/getUsers.js";
import getUserById from "../usecases/getUserById.js";
import updateUser from "../usecases/updateUser.js";
import deleteUser from "../usecases/deleteUser.js";
import UserRepository from "../repositories/UserRepository.js";

const createUserFn = createUser(UserRepository);
const getUsersFn = getUsers(UserRepository);
const getUserByIdFn = getUserById(UserRepository);
const updateUserFn = updateUser(UserRepository);
const deleteUserFn = deleteUser(UserRepository);

const UserController = {
    async getAllUsers() {
        const users = await getUsersFn();
        console.table(users.map((u) => u.dataValues));
    },

    async createUserController(name, email, gender) {
        await createUserFn({name, email, gender});
        console.log("User berhasil ditambahkan");
    },

    async updateUserController(id,updatedData) {
        const result = await updateUserFn(id, updatedData);
        console.log(result.message);
    },

    async deleteUserController(id){
        const result = await deleteUserFn(id);
        console.log(result.message);
    },

    async getUserByIdController(id) {
        const user = await getUserByIdFn(id);
        if (user) {
            console.table([user.dataValues]);
        } else {
            console.log(`User dengan ID ${id} tidak ditemukan.`);
        }
        return user;
    }
};

export default UserController;