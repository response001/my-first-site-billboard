const Order = require('../models/Order');

function makeOrderNumber() {
  return `BB-${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 90 + 10)}`;
}

exports.create = async (req, res) => {
  try {
    const { customer_name, customer_email, customer_phone, address, items, payment_method, user_id } = req.body;
    if (!customer_name || !customer_email || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Customer info and items are required' });
    }
    const total = items.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0);
    const orderNumber = makeOrderNumber();
    const id = await Order.create({
      user_id: user_id || null,
      order_number: orderNumber,
      customer_name,
      customer_email,
      customer_phone,
      address,
      total,
      payment_method,
    }, items);
    res.status(201).json({ success: true, message: 'Order placed successfully', order_id: id, order_number: orderNumber });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.mine = async (req, res) => {
  try {
    const orders = await Order.byUser(req.user.id);
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.track = async (req, res) => {
  try {
    const order = await Order.byId(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    const items = await Order.itemsByOrder(order.id);
    res.json({ success: true, order, items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
