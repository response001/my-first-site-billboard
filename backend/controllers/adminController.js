const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Internship = require('../models/Internship');
const { Course, CourseRegistration } = require('../models/Course');
const { Message } = require('../models/Message');

exports.dashboard = async (req, res) => {
  try {
    const [users, products, orders, revenue, internships, registrations, messages] = await Promise.all([
      User.count(),
      Product.count(),
      Order.count(),
      Order.revenue(),
      Internship.count(),
      CourseRegistration.count(),
      Message.count(),
    ]);
    res.json({
      success: true,
      stats: {
        users,
        products,
        orders,
        revenue,
        internships,
        registrations,
        messages,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.orders = async (req, res) => {
  try {
    const orders = await Order.all();
    const withItems = await Promise.all(
      orders.map(async (o) => ({ ...o, items: await Order.itemsByOrder(o.id) }))
    );
    res.json({ success: true, orders: withItems });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!valid.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    await Order.updateStatus(req.params.id, status);
    res.json({ success: true, message: 'Order status updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.reports = async (req, res) => {
  try {
    const db = require('../config/db');
    const [byCategory] = await db.execute(`
      SELECT c.name AS category, COUNT(p.id) AS product_count
      FROM categories c LEFT JOIN products p ON p.category_id = c.id
      GROUP BY c.id ORDER BY product_count DESC
    `);
    const [ordersByStatus] = await db.execute(`
      SELECT status, COUNT(*) AS total FROM orders GROUP BY status
    `);
    const [topProducts] = await db.execute(`
      SELECT product_name, SUM(quantity) AS sold
      FROM order_items GROUP BY product_name ORDER BY sold DESC LIMIT 5
    `);
    const [internshipsByLevel] = await db.execute(`
      SELECT level, COUNT(*) AS total FROM internships GROUP BY level
    `);
    res.json({
      success: true,
      reports: { byCategory, ordersByStatus, topProducts, internshipsByLevel },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
