const mySQL = require('mysql2')

require('dotenv').config()

const db = mySQL.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 15
})



db.connect((err) => {
    if (err) {
        console.log(err);
    }
    console.log('mySql connected');
})

module.exports = db