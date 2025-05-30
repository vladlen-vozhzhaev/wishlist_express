const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
exports.register = async (req, res)=>{
    try{
        const {username, email, password} = req.body;
        // Проверка, существует ли пользователь
        const existingUser = await User.findByEmail(email);
        if(existingUser){
            return res.render('register', {
                error: "Пользователь с таким email уже сущесствует",
            })
        }
        const userId = await User.create({username, email, password});
        res.status(201).json({message: "success"});
    }catch (e) {
        res.status(500).json({message: "error reg user", error: e.message});
    }
}

exports.login = async (req, res)=>{
    try {
        const {email, password} = req.body;
        // Поиск пользователя
        const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
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

exports.getUser = async (req, res)=>{
    try {
        const  [users] = await db.query("SELECT id, username, email, created_at FROM users WHERE id = ?", [req.user.id]);
        if (users.length === 0){
            res.status(404).json({message: 'User not found'});
        }
        res.json(users[0]);
    }catch (e) {
        res.status(500);
    }
}