const db = require('../config/db');

const Internship = {
  async create({ full_name, school, level, email, phone, cv_file, recommendation_file }) {
    const [result] = await db.execute(
      `INSERT INTO internships (full_name, school, level, email, phone, cv_file, recommendation_file)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [full_name, school || '', level, email, phone || '', cv_file || null, recommendation_file || null]
    );
    return result.insertId;
  },
  async all() {
    const [rows] = await db.execute('SELECT * FROM internships ORDER BY id DESC');
    return rows;
  },
  async byId(id) {
    const [rows] = await db.execute('SELECT * FROM internships WHERE id = ?', [id]);
    return rows[0];
  },
  async updateStatus(id, status) {
    await db.execute("UPDATE internships SET status = ? WHERE id = ?", [status, id]);
  },
  async count() {
    const [rows] = await db.execute('SELECT COUNT(*) AS total FROM internships');
    return rows[0].total;
  },
};

module.exports = Internship;
