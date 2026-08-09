import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, setAuth } from '../services/api';

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await api.adminLogin(form);
      setAuth(data.token, { ...data.admin, role: 'admin' });
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-8">
        <Link to="/" className="text-sm text-brand-600 font-semibold">← Back to website</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-6">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Username" className="w-full border rounded-lg px-4 py-3" />
          <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" className="w-full border rounded-lg px-4 py-3" />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button disabled={busy} className="w-full bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 disabled:opacity-50">
            {busy ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
