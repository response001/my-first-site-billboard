import { useState } from 'react';
import { api } from '../services/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.sendMessage(form);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-14">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact Us</h1>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Our Location</h2>
            <div className="rounded-lg bg-gray-100 h-56 flex items-center justify-center text-gray-400">
              <span className="text-center">📍 Kigali, Rwanda<br />Map will be displayed here</span>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs uppercase text-gray-400 font-semibold">Phone</p>
              <p className="font-medium">+250 79 410 9388</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-400 font-semibold">Email</p>
              <p className="font-medium">info@onbillboard.com</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-400 font-semibold">WhatsApp</p>
              <p className="font-medium">+250 79 410 9388</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-400 font-semibold">Social</p>
              <p className="font-medium">Facebook · Instagram · LinkedIn</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Send us a message</h2>
          {success ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-3">✅</div>
              <p className="font-semibold text-green-600">Message sent successfully!</p>
              <p className="text-gray-500 text-sm mt-2">We will get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="w-full border rounded-lg px-4 py-3" />
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full border rounded-lg px-4 py-3" />
              <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject" className="w-full border rounded-lg px-4 py-3" />
              <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Message" className="w-full border rounded-lg px-4 py-3" />
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button disabled={busy} className="w-full bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 disabled:opacity-50">
                {busy ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
