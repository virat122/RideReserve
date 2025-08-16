const mysql = require('mysql2/promise');
const config = require('../config/development.json');

// Database connection
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'trip_reservation',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;


