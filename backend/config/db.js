const mysql = require('mysql2');

const uri = process.env.MYSQL_URL;

const pool = uri
  ? mysql.createPool(uri)
  : mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

module.exports = pool.promise();
