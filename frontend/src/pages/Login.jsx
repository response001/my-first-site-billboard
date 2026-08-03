import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, setAuth } from '../services/api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await api.login(form);
      setAuth(data.token, data.user);
      navigate(data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Student / Customer Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full border rounded-lg px-4 py-3" />
          <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" className="w-full border rounded-lg px-4 py-3" />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button disabled={busy} className="w-full bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 disabled:opacity-50">
            {busy ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-sm text-gray-500 mt-4">
          Don't have an account? <Link to="/register" className="text-brand-600 font-semibold">Register</Link>
        </p>
      </div>
    </div>
  );
}
