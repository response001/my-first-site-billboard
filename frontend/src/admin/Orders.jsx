import { useEffect, useState } from 'react';
import { api } from '../services/api';

function formatRWF(n) {
  return new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', maximumFractionDigits: 0 }).format(n);
}

const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const load = () => {
    api.adminOrders().then((d) => setOrders(d.orders)).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.adminUpdateOrder(id, status);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">Order No</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Pay Status</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-2 font-medium">{o.order_number}</td>
                <td className="px-4 py-2">
                  <div>{o.customer_name}</div>
                  <div className="text-xs text-gray-400">{o.customer_email}</div>
                  <div className="text-xs text-gray-400">{o.customer_phone}</div>
                </td>
                <td className="px-4 py-2 text-xs">
                  {o.items.map((i) => (
                    <div key={i.id}>{i.product_name} × {i.quantity}</div>
                  ))}
                </td>
                <td className="px-4 py-2 font-semibold">{formatRWF(o.total)}</td>
                <td className="px-4 py-2 text-xs">{o.payment_method}</td>
                <td className="px-4 py-2">
                  <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                    o.payment?.status === 'paid' ? 'bg-green-100 text-green-700'
                    : o.payment?.status === 'failed' ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {o.payment?.status || 'pending'}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className={`border rounded px-2 py-1 text-xs font-medium ${
                      o.status === 'delivered' ? 'text-green-700' : o.status === 'cancelled' ? 'text-red-700' : ''
                    }`}
                  >
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
