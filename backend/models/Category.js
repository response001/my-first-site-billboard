const db = require('../config/db');

const Category = {
  async create({ name, slug, description }) {
    const [result] = await db.execute(
      'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)',
      [name, slug, description || '']
    );
    return result.insertId;
  },
  async all() {
    const [rows] = await db.execute('SELECT * FROM categories ORDER BY name');
    return rows;
  },
  async bySlug(slug) {
    const [rows] = await db.execute('SELECT * FROM categories WHERE slug = ?', [slug]);
    return rows[0];
  },
  async byId(id) {
    const [rows] = await db.execute('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0];
  },
  async update(id, fields) {
    const allowed = ['name', 'slug', 'description'];
    const keys = Object.keys(fields).filter((k) => allowed.includes(k));
    if (keys.length === 0) return;
    const set = keys.map((k) => `${k} = ?`).join(', ');
    const values = keys.map((k) => fields[k]);
    await db.execute(`UPDATE categories SET ${set} WHERE id = ?`, [...values, id]);
  },
  async remove(id) {
    await db.execute('DELETE FROM categories WHERE id = ?', [id]);
  },
};

module.exports = Category;
