import { create } from "domain";
import User from "../models/UserModel.js";

const UserRepository = {
    async create(data) {
        return await User.create(data);
    },
    async findAll() {
        return await User.findAll();
    },
    async findById(id) {
        return await User.findByPk(id);
    },
    async update(id, data) {
        return await User.update(data, { where: { id }});
    },
    async delete(id) {
        return await User.destroy({where: { id }});
    }
};

export default UserRepository;