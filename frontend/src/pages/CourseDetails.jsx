import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';

export default function CourseDetails() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', education_level: '' });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.course(slug).then((d) => setCourse(d.course)).catch(() => {});
  }, [slug]);

  if (!course) {
    return <div className="max-w-4xl mx-auto px-4 py-14 text-gray-500">Loading course...</div>;
  }

  const topics = (course.topics || '').split(',').map((t) => t.trim()).filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.registerCourse({ ...form, course_id: course.id });
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link to="/courses" className="text-sm text-brand-600 hover:underline">&larr; All courses</Link>
      <div className="mt-4 grid md:grid-cols-2 gap-10">
        <div>
          <div className="h-48 bg-gradient-to-br from-brand-500 to-accent-500 rounded-xl flex items-center justify-center text-6xl">
            {course.name === 'Software Development' ? '💻' : course.name === 'Networking' ? '🌐' : '🎨'}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mt-6">{course.name}</h1>
          <p className="text-gray-600 mt-2">{course.description}</p>
          <p className="mt-3 text-gray-500">Duration: <strong className="text-gray-800">{course.duration}</strong></p>
          <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-3">What you will learn</h2>
          <div className="grid grid-cols-2 gap-2">
            {topics.map((t) => (
              <span key={t} className="bg-gray-100 text-gray-700 text-sm px-3 py-2 rounded-lg">✔ {t}</span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 h-fit">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Registration Form</h2>
          <p className="text-sm text-gray-500 mb-4">Register for this course</p>
          {success ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-3">🎉</div>
              <p className="font-semibold text-green-600">Registration submitted!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Full Name" className="w-full border rounded-lg px-4 py-3" />
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full border rounded-lg px-4 py-3" />
              <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="w-full border rounded-lg px-4 py-3" />
              <select value={form.education_level} onChange={(e) => setForm({ ...form, education_level: e.target.value })} className="w-full border rounded-lg px-4 py-3">
                <option value="">Education Level</option>
                <option value="L3">L3</option>
                <option value="L4">L4</option>
                <option value="L5">L5</option>
                <option value="A-Level">A-Level</option>
                <option value="Diploma">Diploma</option>
                <option value="Degree">Degree</option>
                <option value="Other">Other</option>
              </select>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button disabled={busy} className="w-full bg-accent-500 text-white py-3 rounded-lg font-semibold hover:bg-accent-400 disabled:opacity-50">
                {busy ? 'Submitting...' : 'Register Now'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
