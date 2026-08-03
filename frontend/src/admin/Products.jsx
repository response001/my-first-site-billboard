import { useEffect, useState } from 'react';
import { api } from '../services/api';

function formatRWF(n) {
  return new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', maximumFractionDigits: 0 }).format(n);
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', category_id: '', description: '', price: '', quantity: '', featured: false });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => {
    api.products().then((d) => setProducts(d.products)).catch(() => {});
  };

  useEffect(() => {
    load();
    api.categories().then((d) => setCategories(d.categories)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v !== '' && fd.append(k, v));
      if (image) fd.append('image', image);
      await api.adminCreateProduct(fd);
      setMessage('Product created successfully');
      setShowForm(false);
      setForm({ name: '', category_id: '', description: '', price: '', quantity: '', featured: false });
      load();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.adminDeleteProduct(id);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-700">
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-6 grid sm:grid-cols-2 gap-4">
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product Name" className="border rounded-lg px-4 py-2" />
          <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="border rounded-lg px-4 py-2">
            <option value="">Category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price (RWF)" className="border rounded-lg px-4 py-2" />
          <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="Quantity" className="border rounded-lg px-4 py-2" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={2} className="border rounded-lg px-4 py-2 sm:col-span-2" />
          <div className="sm:col-span-2 flex items-center gap-6">
            <label className="text-sm text-gray-600">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="mr-2" />
              Featured
            </label>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} className="text-sm" />
          </div>
          <div className="sm:col-span-2">
            <button disabled={busy} className="bg-accent-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-accent-400 disabled:opacity-50">
              {busy ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      )}
      {message && <p className="mb-4 text-sm text-green-600">{message}</p>}

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-2">
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                    {p.image ? <img src={p.image} alt={p.name} className="h-full w-full object-contain" /> : <span>📦</span>}
                  </div>
                </td>
                <td className="px-4 py-2 font-medium">{p.name}</td>
                <td className="px-4 py-2 text-gray-500">{p.category_name || '-'}</td>
                <td className="px-4 py-2">{formatRWF(p.price)}</td>
                <td className="px-4 py-2">{p.quantity}</td>
                <td className="px-4 py-2">
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800 text-xs font-semibold">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
