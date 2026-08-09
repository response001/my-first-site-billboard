const Order = require('../models/Order');
const paypack = require('../services/paypack');
const { notifyOrderPlaced } = require('../services/notifier');

const MOBILE_MONEY = 'Mobile Money (MTN MoMo / Airtel Money)';

function makeOrderNumber() {
  return `BB-${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 90 + 10)}`;
}

exports.create = async (req, res) => {
  try {
    const { customer_name, customer_email, customer_phone, address, items, payment_method, user_id } = req.body;
    if (!customer_name || !customer_email || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Customer info and items are required' });
    }
    if (payment_method === MOBILE_MONEY && !customer_phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required for Mobile Money' });
    }
    const total = items.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0);
    const orderNumber = makeOrderNumber();
    const isMobileMoney = payment_method === MOBILE_MONEY;
    const id = await Order.create({
      user_id: user_id || null,
      order_number: orderNumber,
      customer_name,
      customer_email,
      customer_phone,
      address,
      total,
      payment_method,
    }, items, !isMobileMoney);

    if (isMobileMoney) {
      if (!paypack.isConfigured()) {
        await Order.failPayment(id);
        return res.status(400).json({ success: false, message: 'Mobile Money is not configured yet (PAYPACK_CLIENT_ID / PAYPACK_CLIENT_SECRET missing in .env)' });
      }
      try {
        const tx = await paypack.cashin({ amount: total, number: customer_phone });
        await Order.savePaymentRef(id, tx.ref);
        return res.status(201).json({
          success: true,
          message: 'Payment prompt sent to your phone. Enter your PIN to confirm.',
          order_id: id,
          order_number: orderNumber,
          requires_payment: true,
          paypack_ref: tx.ref,
        });
      } catch (err) {
        await Order.failPayment(id);
        return res.status(400).json({ success: false, message: 'Payment could not be initiated: ' + err.message });
      }
    }

    notifyOrderPlaced({
      order_number: orderNumber,
      customer_name,
      customer_email,
      customer_phone,
      address,
      total,
      payment_method,
    }, items).catch((err) => console.error('[notify] Order notification error:', err.message));
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
