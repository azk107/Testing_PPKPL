import User from "../models/UserModel.js";

const deleteUser = (userRepo) => async(id) => {
    if (!id) throw new Error("ID tidak boleh kosong");

    const user = await userRepo.findById(id);
    if (!user) throw new Error ("Gagal menghapus, user tidak ditemukan");

    await userRepo.delete(id);

    return {message: "User berhasil dihapus"};
}

export default deleteUser;