
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

const caPath = path.join(__dirname, "../certificates/ca.pem");
const caCertificate = fs.readFileSync(caPath, "utf8");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),

  ssl: {
    ca: caCertificate,
    rejectUnauthorized: true
  },

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
