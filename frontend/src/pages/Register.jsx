import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, setAuth } from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', role: 'customer' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await api.register(form);
      setAuth(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Full Name" className="w-full border rounded-lg px-4 py-3" />
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full border rounded-lg px-4 py-3" />
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="w-full border rounded-lg px-4 py-3" />
          <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" className="w-full border rounded-lg px-4 py-3" />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full border rounded-lg px-4 py-3">
            <option value="customer">Customer</option>
            <option value="student">Student</option>
          </select>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button disabled={busy} className="w-full bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 disabled:opacity-50">
            {busy ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="text-sm text-gray-500 mt-4">
          Already have an account? <Link to="/login" className="text-brand-600 font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
}
