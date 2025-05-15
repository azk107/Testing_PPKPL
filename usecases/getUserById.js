import User from "../models/UserModel.js";

const getUserById = (userRepo) => async(id) => {
    if (!id) throw new Error("ID tidak boleh kosong");

    const user = await userRepo.findById(id);
    if (!user) {
        throw new Error(`User dengan ID ${id} tidak ditemukan.`);
    }

    return user;
}

export default getUserById;