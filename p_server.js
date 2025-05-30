const express = require('express');
const {Pool} = require('pg');
const app = express();

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'express',
    password: 'qwerty123',
    port: 5432
});

app.get('/', (req, res)=>{
    pool.query('SELECT NOW()', (err, result)=>{
        if(err){
            console.error("Error: "+err);
            res.send(err);
        }else{
            res.send(result.rows[0].now);
        }
    })
})

app.listen(3000, ()=>{
    console.log("http://localhost:3000");
})