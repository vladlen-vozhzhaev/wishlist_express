const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const upload = multer();
const path = require('path');
const app = express();
const dbConfig = {
    host: "127.127.126.50",
    user: "root",
    password: "",
    database: "wishlist"
}
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',(req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'main.html'));
});
app.get('/getWishes', (req, res)=>{
    const connection =  mysql.createConnection(dbConfig);
    connection.query(`SELECT * FROM wishes`, (err, results)=>{
        res.json(results);
    });
    connection.end();
})
app.post('/addWish', upload.any(), (req, res)=>{
    try {
        const name = req.body.name;
        const description = req.body.description;
        const connection = mysql.createConnection(dbConfig);
        connection.execute(`INSERT INTO wishes (name, description) VALUES (?, ?)`, [name, description]);
        connection.end();
        res.end("ok");
    } catch (error){
        console.error("Ошибка добавления записи в БД", error);
        res.status(500).send("Ошибка добавления записи в БД");
    }
});

app.listen(3000, ()=>{
    console.log("Сервер запущен! http://localhost:3000");
})