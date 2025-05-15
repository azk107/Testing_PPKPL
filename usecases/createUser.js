import User from "../models/UserModel.js";

const createUser = (userRepo) => async (data) => {
    if (!data.name || !data.email || !data.gender) {
        throw new Error("Semua field wajib diisi");
    }
    return await userRepo.create(data);
}

export default createUser;