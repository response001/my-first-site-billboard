import { useEffect, useState } from 'react';
import { api } from '../services/api';

function Bar({ label, value, max, color }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-700">{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <div className="bg-gray-100 h-2.5 rounded-full">
        <div className={`${color} h-2.5 rounded-full`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function AdminReports() {
  const [reports, setReports] = useState(null);

  useEffect(() => {
    api.adminReports().then((d) => setReports(d.reports)).catch(() => {});
  }, []);

  if (!reports) return <p className="text-gray-500">Loading reports...</p>;

  const { byCategory, ordersByStatus, topProducts, internshipsByLevel } = reports;
  const maxCategory = Math.max(...byCategory.map((c) => c.product_count), 1);
  const maxProduct = Math.max(...topProducts.map((p) => p.sold), 1);
  const maxInternship = Math.max(...internshipsByLevel.map((i) => i.total), 1);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reports</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Products per Category</h2>
          {byCategory.map((c) => (
            <Bar key={c.category} label={c.category} value={c.product_count} max={maxCategory} color="bg-brand-600" />
          ))}
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Orders by Status</h2>
          {ordersByStatus.map((o) => (
            <Bar key={o.status} label={o.status} value={o.total} max={Math.max(...ordersByStatus.map((x) => x.total), 1)} color="bg-accent-500" />
          ))}
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Top Selling Products</h2>
          {topProducts.map((p) => (
            <Bar key={p.product_name} label={p.product_name} value={p.sold} max={maxProduct} color="bg-green-600" />
          ))}
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Internships by Level</h2>
          {internshipsByLevel.map((i) => (
            <Bar key={i.level} label={i.level} value={i.total} max={maxInternship} color="bg-purple-600" />
          ))}
        </div>
      </div>
    </div>
  );
}
