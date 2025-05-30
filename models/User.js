const db = require('../config/db');
const bcrypt = require('bcryptjs');
class User{
    static async create({username, email, password}){
        // Хешируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);
        // Создание пользователя
        const [result] = await db.query("INSERT INTO users (username, email, password) VALUES (?,?,?)",
            [username, email, hashedPassword]);
        return result.insertId;
    }
    static async findByEmail(email){
        const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        return users[0];
    }
}

module.exports = User;