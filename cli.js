import readline from 'readline';
import db from './config/Database.js';
import UserController from './controllers/UserController.js';

let rl;

export const initCLI = (customRL = null) => {
  rl = customRL || readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
};

const menu = `
=== Aplikasi BREAD Sederhana ===
1. Tampilkan Semua User
2. Tambah User
3. Ubah User
4. Hapus User
5. Cari User Berdasarkan ID
6. Keluar
Pilih menu: `;

export const promptMenu = async () => {
  rl.question(menu, async (choice) => {
    switch (choice) {
      case '1':
        await UserController.getAllUsers().catch(console.error);
        return promptMenu();

      case '2':
        rl.question("Nama: ", (name) => {
          rl.question("Email: ", (email) => {
            rl.question("Gender: ", (gender) => {
              UserController.createUserController(name, email, gender)
              .catch((err) => console.error(`Error: ${err.message}`))
              .finally(promptMenu);
            });
          });
        });
        break;
        
      case '3':
        rl.question("ID user yang ingin diubah: ", async(id) => {
            const idNum = Number(id);
            if (isNaN(idNum)) {
                console.log("ID harus berupa angka.");
                return promptMenu();
            }
            
            try {
                const user = await UserController.getUserByIdController(idNum);
                
                if (!user) {
                    console.log("User tidak ditemukan.");
                    return promptMenu();
                }

                const oldData = user.dataValues;

                rl.question(`Nama baru [${oldData.name}]: `, (name) => {
                    rl.question(`Email baru [${oldData.email}]: `, (email) => {
                        rl.question(`Gender baru[${oldData.gender}]: `, async (gender) => {
                            const updatedData = {
                                name: name.trim() || oldData.name,
                                email: email.trim() || oldData.email,
                                gender: gender.trim() || oldData.gender
                            };

                            try {
                                await UserController.updateUserController(idNum, updatedData);
                                console.log("User berhasil diubah.");
                            } catch (err) {
                                console.error(`Error: ${err.message}`);
                            }
                            promptMenu();
                        });
                    });
                });
            } catch (err) {
                console.error(`Error: ${err.message}`);
                promptMenu();
            }
        });
        break;

      case '4':
        rl.question("ID user yang ingin dihapus: ", async (id) => {
            const idNum = Number(id);
            if (isNaN(idNum)) {
                console.log("ID harus berupa angka.")
                return promptMenu();
            }

            try {
                await UserController.deleteUserController(idNum);
            } catch (err) {
                console.error(`Error: ${err.message}`);
            }
            promptMenu();
          });
          break;

      case '5':
        rl.question("Masukkan ID user: ", async (id) => {
            const idNum = Number(id);
            if (isNaN(idNum)) {
                console.log("ID harus berupa angka.");
                return promptMenu();
            }
            
            try {
                await UserController.getUserByIdController(idNum);
            } catch (err) {
                console.error(`Error: ${err.message}`);
            }
            promptMenu();
        });
        break;

      case '6':
        rl.close();
        break;
        default:
        console.log("Pilihan tidak valid!");
        promptMenu();
    }
  });
};

export const startApp = async () => {
  try {
    await db.authenticate();
    await db.sync();
    initCLI();
    promptMenu();
  } catch (err) {
    console.error("Gagal koneksi ke database:", err.message);
    if (rl) rl.close();
  }
};

if (process.env.NODE_ENV !== 'test') {
  startApp();
}
