import { useState } from 'react';
import { api } from '../services/api';

const benefits = ['Real Projects', 'Mentorship', 'Certificate', 'Practical Experience', 'Career Guidance'];

export default function Internship() {
  const [form, setForm] = useState({
    full_name: '',
    school: '',
    level: 'L3',
    email: '',
    phone: '',
  });
  const [cv, setCv] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (cv) fd.append('cv', cv);
      if (recommendation) fd.append('recommendation', recommendation);
      await api.internshipApply(fd);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-14">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Students!</h1>
        <p className="text-gray-500">Kick-start your career in software development with our internship program.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-8">
          <section className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-brand-700 mb-3">Requirements</h2>
            <ul className="space-y-2">
              <li className="flex gap-2"><span className="text-green-600">✔</span> Level L3 in Software Development</li>
              <li className="flex gap-2"><span className="text-green-600">✔</span> Level L4 in Software Development</li>
              <li className="flex gap-2"><span className="text-green-600">✔</span> Level L5 in Software Development</li>
            </ul>
          </section>

          <section className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-brand-700 mb-3">Duration</h2>
            <p className="text-3xl font-bold text-gray-900">3 Months</p>
            <p className="text-gray-500 text-sm mt-1">Full-time practical training in a real working environment.</p>
          </section>

          <section className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-brand-700 mb-3">Benefits</h2>
            <ul className="space-y-2">
              {benefits.map((b) => (
                <li key={b} className="flex gap-2"><span className="text-green-600">✔</span> {b}</li>
              ))}
            </ul>
          </section>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Form</h2>
          {success ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-3">🎉</div>
              <p className="font-semibold text-green-600">Application submitted successfully!</p>
              <p className="text-gray-500 text-sm mt-2">We will contact you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Full Name" className="w-full border rounded-lg px-4 py-3" />
              <input value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} placeholder="School" className="w-full border rounded-lg px-4 py-3" />
              <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="w-full border rounded-lg px-4 py-3">
                <option value="L3">L3</option>
                <option value="L4">L4</option>
                <option value="L5">L5</option>
                <option value="Other">Other</option>
              </select>
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full border rounded-lg px-4 py-3" />
              <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="w-full border rounded-lg px-4 py-3" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload CV</label>
                <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setCv(e.target.files[0])} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Recommendation Letter</label>
                <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setRecommendation(e.target.files[0])} className="w-full border rounded-lg px-3 py-2" />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button disabled={busy} className="w-full bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 disabled:opacity-50">
                {busy ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
