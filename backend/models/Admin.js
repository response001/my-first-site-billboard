const db = require('../config/db');

const Admin = {
  async findByUsername(username) {
    const [rows] = await db.execute('SELECT * FROM admins WHERE username = ?', [username]);
    return rows[0];
  },
  async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM admins WHERE email = ?', [email]);
    return rows[0];
  },
};

module.exports = Admin;
