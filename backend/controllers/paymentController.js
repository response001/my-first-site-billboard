const Order = require('../models/Order');
const paypack = require('../services/paypack');
const { notifyOrderPlaced } = require('../services/notifier');

async function handleResult(order, items, payment, status) {
  if (status === 'successful' && payment.status !== 'paid') {
    await Order.confirmPayment(order.id, payment.reference);
    notifyOrderPlaced({
      order_number: order.order_number,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      customer_phone: order.customer_phone,
      address: order.address,
      total: order.total,
      payment_method: order.payment_method,
    }, items).catch((err) => console.error('[notify] Order notification error:', err.message));
    return { status, changed: true };
  }
  if ((status === 'failed' || status === 'rejected' || status === 'cancelled') && payment.status === 'pending') {
    await Order.failPayment(order.id);
    return { status, changed: true };
  }
  return { status, changed: false };
}

exports.status = async (req, res) => {
  try {
    const { ref } = req.params;
    const payment = await Order.byRef(ref);
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    const order = await Order.byId(payment.order_id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    const items = await Order.itemsByOrder(order.id);
    const tx = await paypack.findTransaction(ref);
    const result = await handleResult(order, items, payment, tx.status);
    res.json({
      success: true,
      status: result.status,
      order_number: order.order_number,
      payment_status: payment.status,
      order_status: order.status,
      changed: result.changed,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.webhook = async (req, res) => {
  res.status(200).json({ success: true });
  const signature = req.headers['x-paypack-signature'];
  if (!paypack.verifyWebhook(req.rawBody, signature)) {
    console.error('[paypack] Webhook signature invalid');
    return;
  }
  try {
    const body = (req.body && req.body.data) || req.body || {};
    const ref = body.ref;
    const status = body.status;
    if (!ref) {
      console.error('[paypack] Webhook missing ref');
      return;
    }
    const payment = await Order.byRef(ref);
    if (!payment) {
      console.error('[paypack] Webhook unknown ref:', ref);
      return;
    }
    const order = await Order.byId(payment.order_id);
    const items = await Order.itemsByOrder(order.id);
    await handleResult(order, items, payment, status);
  } catch (err) {
    console.error('[paypack] Webhook error:', err.message);
  }
};
