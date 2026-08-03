const db = require('../config/db');

const Course = {
  async create({ name, slug, duration, description, topics, fee, image }) {
    const [result] = await db.execute(
      'INSERT INTO courses (name, slug, duration, description, topics, fee, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, slug, duration || '3 Months', description || '', topics || '', fee || 0, image || null]
    );
    return result.insertId;
  },
  async all() {
    const [rows] = await db.execute('SELECT * FROM courses ORDER BY name');
    return rows;
  },
  async bySlug(slug) {
    const [rows] = await db.execute('SELECT * FROM courses WHERE slug = ?', [slug]);
    return rows[0];
  },
  async byId(id) {
    const [rows] = await db.execute('SELECT * FROM courses WHERE id = ?', [id]);
    return rows[0];
  },
  async update(id, fields) {
    const allowed = ['name', 'slug', 'duration', 'description', 'topics', 'fee', 'image'];
    const keys = Object.keys(fields).filter((k) => allowed.includes(k));
    if (keys.length === 0) return;
    const set = keys.map((k) => `${k} = ?`).join(', ');
    const values = keys.map((k) => fields[k]);
    await db.execute(`UPDATE courses SET ${set} WHERE id = ?`, [...values, id]);
  },
  async remove(id) {
    await db.execute('DELETE FROM courses WHERE id = ?', [id]);
  },
  async count() {
    const [rows] = await db.execute('SELECT COUNT(*) AS total FROM courses');
    return rows[0].total;
  },
};

const CourseRegistration = {
  async create({ full_name, email, phone, course_id, course_name, education_level }) {
    const [result] = await db.execute(
      `INSERT INTO course_registrations (full_name, email, phone, course_id, course_name, education_level)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [full_name, email, phone || '', course_id || null, course_name, education_level || '']
    );
    return result.insertId;
  },
  async all() {
    const [rows] = await db.execute('SELECT * FROM course_registrations ORDER BY id DESC');
    return rows;
  },
  async updateStatus(id, status) {
    await db.execute('UPDATE course_registrations SET status = ? WHERE id = ?', [status, id]);
  },
  async count() {
    const [rows] = await db.execute('SELECT COUNT(*) AS total FROM course_registrations');
    return rows[0].total;
  },
};

module.exports = { Course, CourseRegistration };
