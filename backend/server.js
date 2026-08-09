require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2');

const db = require('./config/db');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');
const internshipRoutes = require('./routes/internship');
const courseRoutes = require('./routes/courses');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');
const blogRoutes = require('./routes/blog');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf; } }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', async (req, res) => {
  try {
    await db.query('SELECT 1 AS ok');
    res.json({ success: true, message: 'Billboard Technology API is running' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'DB connection failed', code: err.code, errno: err.errno, sqlState: err.sqlState, detail: err.message });
  }
});

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Backend is running successfully' });
});

app.get('/api/db-status', (req, res) => {
  const uri = process.env.MYSQL_URL || '';
  let host = 'not set';
  if (uri) {
    try {
      const parsed = new URL(uri);
      host = parsed.hostname;
    } catch (e) {
      host = 'unparsable';
    }
  }
  res.json({
    hasMysqlUrl: !!uri,
    host,
    dbHost: process.env.DB_HOST || 'not set',
    dbUser: process.env.DB_USER || 'not set',
    dbName: process.env.DB_NAME || 'not set',
  });
});

app.get('/api/init-db', async (req, res) => {
  try {
    const [check] = await db.query('SELECT COUNT(*) AS c FROM products');
    return res.json({ success: true, message: 'DB already initialized', products: check[0].c });
  } catch (err) {
    const uri = process.env.MYSQL_URL;
    const conn = mysql.createConnection(uri || {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'onbillboard',
    }, { multipleStatements: true });
    const sql = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf8')
      .replace(/^CREATE DATABASE.*$/gm, '')
      .replace(/^USE .*;$/gm, '');
    await conn.promise().query(sql);
    conn.destroy();
    res.json({ success: true, message: 'DB initialized' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/internship', internshipRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Billboard Technology API running on http://localhost:${PORT}`);
  });
}
