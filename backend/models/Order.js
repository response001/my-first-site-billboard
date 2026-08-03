const db = require('../config/db');

const Order = {
  async create(order, items) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      const [result] = await connection.execute(
        `INSERT INTO orders (user_id, order_number, customer_name, customer_email, customer_phone, address, total, payment_method)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          order.user_id || null,
          order.order_number,
          order.customer_name,
          order.customer_email,
          order.customer_phone || '',
          order.address || '',
          order.total,
          order.payment_method || 'Cash on Delivery',
        ]
      );
      const orderId = result.insertId;
      for (const item of items) {
        await connection.execute(
          'INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES (?, ?, ?, ?, ?)',
          [orderId, item.product_id || null, item.product_name, item.price, item.quantity]
        );
        if (item.product_id) {
          await connection.execute(
            'UPDATE products SET quantity = GREATEST(quantity - ?, 0) WHERE id = ?',
            [item.quantity, item.product_id]
          );
        }
      }
      await connection.execute(
        'INSERT INTO payments (order_id, amount, method, status) VALUES (?, ?, ?, ?)',
        [orderId, order.total, order.payment_method || 'Cash on Delivery', 'pending']
      );
      await connection.commit();
      return orderId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },
  async all() {
    const [rows] = await db.execute('SELECT * FROM orders ORDER BY id DESC');
    return rows;
  },
  async byId(id) {
    const [rows] = await db.execute('SELECT * FROM orders WHERE id = ?', [id]);
    return rows[0];
  },
  async itemsByOrder(id) {
    const [rows] = await db.execute('SELECT * FROM order_items WHERE order_id = ?', [id]);
    return rows;
  },
  async byUser(userId) {
    const [rows] = await db.execute('SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC', [userId]);
    return rows;
  },
  async updateStatus(id, status) {
    await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
  },
  async count() {
    const [rows] = await db.execute('SELECT COUNT(*) AS total FROM orders');
    return rows[0].total;
  },
  async revenue() {
    const [rows] = await db.execute("SELECT COALESCE(SUM(total), 0) AS total FROM orders WHERE status NOT IN ('cancelled')");
    return rows[0].total;
  },
};

module.exports = Order;
