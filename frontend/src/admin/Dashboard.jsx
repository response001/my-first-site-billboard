import { useEffect, useState } from 'react';
import { api } from '../services/api';

function formatRWF(n) {
  return new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', maximumFractionDigits: 0 }).format(n);
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.adminDashboard().then((d) => setStats(d.stats)).catch(() => {});
  }, []);

  if (!stats) return <p className="text-gray-500">Loading dashboard...</p>;

  const cards = [
    { label: 'Users', value: stats.users, emoji: '👥' },
    { label: 'Products', value: stats.products, emoji: '📦' },
    { label: 'Orders', value: stats.orders, emoji: '🧾' },
    { label: 'Revenue', value: formatRWF(stats.revenue), emoji: '💰' },
    { label: 'Internship Applications', value: stats.internships, emoji: '🎓' },
    { label: 'Course Registrations', value: stats.registrations, emoji: '📚' },
    { label: 'Messages', value: stats.messages, emoji: '✉️' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl shadow p-5">
            <div className="text-3xl mb-2">{c.emoji}</div>
            <div className="text-2xl font-bold text-gray-900">{c.value}</div>
            <div className="text-sm text-gray-500">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
