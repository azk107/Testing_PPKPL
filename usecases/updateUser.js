import User from "../models/UserModel.js";

const updateUser = (userRepo) => async(id, data) => {
    if (!id) throw new Error("ID tidak boleh kosong");

    const [updated] = await userRepo.update(id, data);
    if (updated === 0) throw new Error ("User gagal diperbarui");

    return {message: "User berhasil diperbarui"};
}

export default updateUser;