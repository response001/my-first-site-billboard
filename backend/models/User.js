const db = require('../config/db');

const User = {
  async create({ full_name, email, phone, password }) {
    const [result] = await db.execute(
      'INSERT INTO users (full_name, email, phone, password) VALUES (?, ?, ?, ?)',
      [full_name, email, phone, password]
    );
    return result.insertId;
  },
  async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },
  async findById(id) {
    const [rows] = await db.execute('SELECT id, full_name, email, phone, role, created_at FROM users WHERE id = ?', [id]);
    return rows[0];
  },
  async all() {
    const [rows] = await db.execute('SELECT id, full_name, email, phone, role, created_at FROM users ORDER BY id DESC');
    return rows;
  },
  async count() {
    const [rows] = await db.execute('SELECT COUNT(*) AS total FROM users');
    return rows[0].total;
  },
};

module.exports = User;
