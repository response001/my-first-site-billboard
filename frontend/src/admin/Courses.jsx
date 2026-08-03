import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function AdminCourses() {
  const [registrations, setRegistrations] = useState([]);

  const load = () => {
    api.adminRegistrations().then((d) => setRegistrations(d.registrations)).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.adminUpdateRegistration(id, status);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Course Registrations</h1>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Level</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {registrations.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-2 font-medium">{r.full_name}</td>
                <td className="px-4 py-2 text-gray-500">{r.course_name}</td>
                <td className="px-4 py-2">{r.education_level || '-'}</td>
                <td className="px-4 py-2 text-xs">
                  <div>{r.email}</div>
                  <div className="text-gray-400">{r.phone}</div>
                </td>
                <td className="px-4 py-2">
                  <select
                    value={r.status}
                    onChange={(e) => updateStatus(r.id, e.target.value)}
                    className={`border rounded px-2 py-1 text-xs font-medium ${
                      r.status === 'accepted' ? 'text-green-700' : r.status === 'rejected' ? 'text-red-700' : ''
                    }`}
                  >
                    <option value="pending">pending</option>
                    <option value="accepted">accepted</option>
                    <option value="rejected">rejected</option>
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
