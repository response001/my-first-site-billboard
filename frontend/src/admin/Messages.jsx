import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);

  const load = () => {
    api.adminMessages().then((d) => setMessages(d.messages)).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {messages.map((m) => (
          <div key={m.id} className={`bg-white rounded-xl shadow p-5 ${m.read ? '' : 'border-2 border-brand-300'}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">{m.name}</h3>
              {!m.read && <span className="bg-brand-100 text-brand-700 text-xs px-2 py-0.5 rounded font-semibold">New</span>}
            </div>
            <p className="text-xs text-gray-400">{m.email} · {new Date(m.created_at).toLocaleString()}</p>
            {m.subject && <p className="text-sm font-medium text-gray-700 mt-2">{m.subject}</p>}
            <p className="text-sm text-gray-600 mt-1">{m.message}</p>
          </div>
        ))}
        {messages.length === 0 && <p className="text-gray-500">No messages yet.</p>}
      </div>
    </div>
  );
}
