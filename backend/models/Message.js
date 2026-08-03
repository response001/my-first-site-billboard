const db = require('../config/db');

const Message = {
  async create({ name, email, subject, message }) {
    const [result] = await db.execute(
      'INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, subject || '', message]
    );
    return result.insertId;
  },
  async all() {
    const [rows] = await db.execute('SELECT * FROM messages ORDER BY id DESC');
    return rows;
  },
  async markRead(id) {
    await db.execute('UPDATE messages SET `read` = 1 WHERE id = ?', [id]);
  },
  async count() {
    const [rows] = await db.execute('SELECT COUNT(*) AS total FROM messages');
    return rows[0].total;
  },
};

const BlogPost = {
  async create({ title, slug, excerpt, content, category, image, author }) {
    const [result] = await db.execute(
      'INSERT INTO blog (title, slug, excerpt, content, category, image, author) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, slug, excerpt || '', content || '', category || 'Latest Technology News', image || null, author || 'Billboard Tech Team']
    );
    return result.insertId;
  },
  async all() {
    const [rows] = await db.execute('SELECT * FROM blog ORDER BY id DESC');
    return rows;
  },
  async bySlug(slug) {
    const [rows] = await db.execute('SELECT * FROM blog WHERE slug = ?', [slug]);
    return rows[0];
  },
  async remove(id) {
    await db.execute('DELETE FROM blog WHERE id = ?', [id]);
  },
};

module.exports = { Message, BlogPost };
