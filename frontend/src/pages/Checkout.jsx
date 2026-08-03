import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useCart } from '../services/CartContext';
import { api, getAuth } from '../services/api';

function formatRWF(n) {
  return new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', maximumFractionDigits: 0 }).format(n);
}

export default function Checkout() {
  const { items, total, clear } = useCart();
  const { user, token } = getAuth();
  const [form, setForm] = useState({
    customer_name: user?.full_name || '',
    customer_email: user?.email || '',
    customer_phone: '',
    address: '',
    payment_method: 'Cash on Delivery',
  });
  const [placed, setPlaced] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!token) return <Navigate to="/login" replace />;
  if (placed) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-6">Your order number is <strong>{placed}</strong>. We will contact you soon for delivery.</p>
        <Link to="/products" className="bg-brand-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-700">Continue Shopping</Link>
      </div>
    );
  }

  if (items.length === 0) return <Navigate to="/cart" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await api.placeOrder({
        ...form,
        user_id: user?.id,
        items: items.map((i) => ({
          product_id: i.product_id,
          product_name: i.product_name,
          price: i.price,
          quantity: i.quantity,
        })),
      });
      clear();
      setPlaced(data.order_number || `BB-${Date.now().toString().slice(-8)}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Delivery Information</h2>
          <input
            required
            value={form.customer_name}
            onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
            placeholder="Full Name"
            className="w-full border rounded-lg px-4 py-3"
          />
          <input
            required
            type="email"
            value={form.customer_email}
            onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
            placeholder="Email"
            className="w-full border rounded-lg px-4 py-3"
          />
          <input
            required
            value={form.customer_phone}
            onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
            placeholder="Phone"
            className="w-full border rounded-lg px-4 py-3"
          />
          <textarea
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="Delivery Address"
            rows={3}
            className="w-full border rounded-lg px-4 py-3"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <select
              value={form.payment_method}
              onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
              className="w-full border rounded-lg px-4 py-3"
            >
              <option>Cash on Delivery</option>
              <option>Mobile Money (MTN MoMo / Airtel Money)</option>
              <option>Bank Card</option>
            </select>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
          <div className="bg-white rounded-xl shadow p-4 space-y-3">
            {items.map((i) => (
              <div key={i.product_id} className="flex justify-between text-sm">
                <span>{i.product_name} × {i.quantity}</span>
                <span className="font-medium">{formatRWF(i.price * i.quantity)}</span>
              </div>
            ))}
            <div className="border-t pt-3 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-brand-700">{formatRWF(total)}</span>
            </div>
          </div>
          {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
          <button
            disabled={busy}
            className="w-full mt-4 bg-accent-500 text-white py-3 rounded-lg font-semibold hover:bg-accent-400 disabled:opacity-50"
          >
            {busy ? 'Placing order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
}
