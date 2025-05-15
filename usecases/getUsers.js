import User from "../models/UserModel.js";

const getUsers = (userRepo) => async() => {
    return await userRepo.findAll();
};

export default getUsers;