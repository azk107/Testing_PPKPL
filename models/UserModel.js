import {Sequelize} from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const User = db.define('users', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    gender: DataTypes.STRING
},{
    freezeTableName: true
});

export default User;

// Sinkronisasi database hanya jika dijalankan secara eksplisit
if (process.env.NODE_ENV !== "test") {
    (async()=>{
        await db.sync();
    })();
}