const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
exports.register = async (req, res)=>{
    try{
        const {username, email, password} = req.body;
        // Проверка, существует ли пользователь
        const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if(existingUser.length > 0){
            return res.status(401).json({message: "User already exists"});
        }
        // Хешируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);
        // Создание пользователя
        const [result] = await db.query("INSERT INTO users (username, email, password) VALUES (?,?,?)",
            [username, email, hashedPassword]);
        res.status(201).json({message: "success"});
    }catch (e) {
        res.status(500).json({message: "error reg user", error: e.message});
    }
}

exports.login = async (req, res)=>{
    try {
        const {email, password} = req.body;
        // Поиск пользователя
        const [users] = await db.query("SELECT * FROM users WHERE email = ? and password = ?", [email]);
        if(users.length === 0){
            return res.status(401).json({message: "Wrong email or pass"});
        }
        const user = users[0];
        // Проверка пароля
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
           return res.status(401).json({message: "Wrong email or pass"});
        }
        // Создание JWT токена
        const token = jwt.sign(
            {id: user.id, username: user.username},
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );
        res.json({token, user: {id: user.id, username: user.username, email: user.email}});

    }catch (e) {
        res.status(500).json({message: "Error logging in", error: e.message});
    }
}