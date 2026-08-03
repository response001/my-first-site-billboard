import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { clearAuth } from '../services/api';

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/internship', label: 'Internship Applications' },
  { to: '/admin/courses', label: 'Course Registrations' },
  { to: '/admin/messages', label: 'Messages' },
  { to: '/admin/reports', label: 'Reports' },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    clearAuth();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-gray-900 text-gray-200 flex flex-col">
        <Link to="/" className="px-5 py-5 font-bold text-white border-b border-gray-800">
          <span className="text-brand-400">onBillBoard</span> Admin
        </Link>
        <nav className="flex-1 py-4">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `block px-5 py-3 text-sm ${isActive ? 'bg-brand-600 text-white font-semibold' : 'hover:bg-gray-800'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-gray-800 text-sm">
          <Link to="/" className="block mb-2 hover:text-white">View Website</Link>
          <button onClick={logout} className="text-red-400 hover:text-red-300">Logout</button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
