const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const upload = multer();
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
// Routes
app.use('/api/auth', authRoutes);
app.get('/',(req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'main.html'));
});
app.get('/register', (req, res)=>{
    res.sendFile(__dirname + '/public/register.html');
});
app.get('/login', (req, res)=>{
  res.sendFile(__dirname + '/public/login.html');
});
/*app.get('/getWishes', (req, res)=>{
    const connection =  mysql.createConnection(dbConfig);
    connection.query(`SELECT * FROM wishes`, (err, results)=>{
        res.json(results);
    });
    connection.end();
})*/
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

app.listen(process.env.PORT, ()=>{
    console.log("Сервер запущен! http://localhost:"+process.env.PORT);
})