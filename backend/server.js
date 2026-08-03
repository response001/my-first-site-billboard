require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const db = require('./config/db');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const internshipRoutes = require('./routes/internship');
const courseRoutes = require('./routes/courses');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');
const blogRoutes = require('./routes/blog');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', async (req, res) => {
  try {
    await db.query('SELECT 1 AS ok');
    res.json({ success: true, message: 'Billboard Technology API is running' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'DB connection failed', error: err.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/internship', internshipRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

app.listen(PORT, () => {
  console.log(`Billboard Technology API running on http://localhost:${PORT}`);
});
