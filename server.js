const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const upload = multer();
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const exphbs = require('express-handlebars');
const app = express();

app.engine('hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts')
}))
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
// Routes
app.use('/api/auth', authRoutes);
app.get('/',(req, res)=>{
    res.render('main');
});
app.get('/profile', (req, res)=>{
    res.render('profile');
})
app.get('/register', (req, res)=>{
    res.render('register');
});
app.get('/login', (req, res)=>{
  res.render('login');
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