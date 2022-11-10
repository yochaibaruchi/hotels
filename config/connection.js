const mySQL = require('mysql2')
require('dotenv').config()

const db = mySQL.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    timeout: 100000
})



db.connect((err) => {
    if (err) {
        console.log(err);
    }
    console.log('mySql connected');
})

module.exports = db