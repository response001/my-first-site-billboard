const db = require('../config/db');

function parseJson(v) {
  if (Array.isArray(v)) return v;
  if (!v) return null;
  try {
    const parsed = JSON.parse(v);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function decorate(product) {
  if (!product) return product;
  return { ...product, gallery: parseJson(product.gallery), features: parseJson(product.features) };
}

const Product = {
  async create({ category_id, name, slug, description, price, quantity, image, featured, gallery, features }) {
    const [result] = await db.execute(
      'INSERT INTO products (category_id, name, slug, description, price, quantity, image, gallery, features, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        category_id || null,
        name,
        slug,
        description || '',
        price,
        quantity || 0,
        image || null,
        gallery ? JSON.stringify(gallery) : null,
        features ? JSON.stringify(features) : null,
        featured ? 1 : 0,
      ]
    );
    return result.insertId;
  },
  async all() {
    const [rows] = await db.execute(`
      SELECT p.*, c.name AS category_name
      FROM products p LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.id DESC
    `);
    return rows.map(decorate);
  },
  async featured() {
    const [rows] = await db.execute(`
      SELECT p.*, c.name AS category_name
      FROM products p LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.featured = 1 AND p.status = 'active'
    `);
    return rows.map(decorate);
  },
  async byCategory(categoryId) {
    const [rows] = await db.execute(
      'SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.category_id = ? AND p.status = ?',
      [categoryId, 'active']
    );
    return rows.map(decorate);
  },
  async bySlug(slug) {
    const [rows] = await db.execute(
      'SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.slug = ?',
      [slug]
    );
    return decorate(rows[0]);
  },
  async byId(id) {
    const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
    return decorate(rows[0]);
  },
  async update(id, fields) {
    const allowed = ['category_id', 'name', 'slug', 'description', 'price', 'quantity', 'image', 'gallery', 'features', 'featured', 'status'];
    const keys = Object.keys(fields).filter((k) => allowed.includes(k));
    if (keys.length === 0) return;
    const set = keys.map((k) => `${k} = ?`).join(', ');
    const values = keys.map((k) => {
      const v = fields[k];
      if (k === 'gallery' || k === 'features') return Array.isArray(v) ? JSON.stringify(v) : v;
      return v;
    });
    await db.execute(`UPDATE products SET ${set} WHERE id = ?`, [...values, id]);
  },
  async remove(id) {
    await db.execute('DELETE FROM products WHERE id = ?', [id]);
  },
  async decreaseStock(productId, quantity) {
    await db.execute('UPDATE products SET quantity = GREATEST(quantity - ?, 0) WHERE id = ?', [quantity, productId]);
  },
  async count() {
    const [rows] = await db.execute('SELECT COUNT(*) AS total FROM products');
    return rows[0].total;
  },
};

module.exports = Product;
