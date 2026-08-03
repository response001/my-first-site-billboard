import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function AdminInternship() {
  const [applications, setApplications] = useState([]);

  const load = () => {
    api.adminInternships().then((d) => setApplications(d.applications)).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.adminUpdateInternship(id, status);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Internship Applications</h1>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">School</th>
              <th className="px-4 py-3">Level</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Files</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {applications.map((a) => (
              <tr key={a.id}>
                <td className="px-4 py-2 font-medium">{a.full_name}</td>
                <td className="px-4 py-2 text-gray-500">{a.school || '-'}</td>
                <td className="px-4 py-2">
                  <span className="bg-brand-50 text-brand-700 px-2 py-0.5 rounded text-xs font-semibold">{a.level}</span>
                </td>
                <td className="px-4 py-2 text-xs">
                  <div>{a.email}</div>
                  <div className="text-gray-400">{a.phone}</div>
                </td>
                <td className="px-4 py-2 text-xs">
                  {a.cv_file && <a href={a.cv_file} target="_blank" rel="noreferrer" className="text-brand-600 block">CV</a>}
                  {a.recommendation_file && <a href={a.recommendation_file} target="_blank" rel="noreferrer" className="text-brand-600 block">Recommendation</a>}
                </td>
                <td className="px-4 py-2">
                  <select
                    value={a.status}
                    onChange={(e) => updateStatus(a.id, e.target.value)}
                    className={`border rounded px-2 py-1 text-xs font-medium ${
                      a.status === 'accepted' ? 'text-green-700' : a.status === 'rejected' ? 'text-red-700' : ''
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
