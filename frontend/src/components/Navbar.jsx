import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../services/CartContext';
import { useLanguage } from '../services/LanguageContext';
import { languages } from '../services/i18n';
import { getAuth, clearAuth } from '../services/api';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [query, setQuery] = useState('');
  const langRef = useRef(null);
  const { count } = useCart();
  const { t, lang, setLang } = useLanguage();
  const { token, user } = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    function onClickOutside(e) {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/';
  };

  const current = languages.find((l) => l.code === lang);

  const onSearch = (e) => {
    e.preventDefault();
    navigate(query.trim() ? `/products?search=${encodeURIComponent(query.trim())}` : '/products');
    setOpen(false);
  };

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/products', label: t('nav.products') },
    { to: '/services', label: t('nav.services') },
    { to: '/internship', label: t('nav.internship') },
    { to: '/courses', label: t('nav.courses') },
    { to: '/blog', label: t('nav.blog') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ];

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="bg-slate-950 text-gray-300 text-xs hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 h-8 flex items-center justify-between">
          <span className="text-gray-400">🌍 {t('hero.welcome')}</span>
          <div className="flex items-center gap-4">
            <Link to="/internship" className="hover:text-sun-400">{t('nav.internship')}</Link>
            <Link to="/contact" className="hover:text-sun-400">{t('nav.contact')}</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl shrink-0">
          <img src="/logo.PNG" alt="Billboard Technology logo" className="w-11 h-11 object-cover rounded-lg shadow-sm ring-1 ring-gray-200" />
          <span className="hidden md:inline">onBillBoard<span className="text-gradient">.com</span></span>
        </Link>

        <form onSubmit={onSearch} className="hidden lg:flex flex-1 max-w-xl border-2 border-brand-500 rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-brand-300">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('nav.search')}
            className="flex-1 px-4 py-2.5 text-sm outline-none"
          />
          <button type="submit" className="btn-gradient text-white px-6 text-sm font-semibold">
            🔍
          </button>
        </form>

        <div className="flex-1 lg:hidden" />

        <div className="flex items-center gap-3 shrink-0">
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 border rounded-lg px-2.5 py-1.5 text-sm text-gray-700 hover:border-brand-500"
              aria-label="Select language"
            >
              <span className="text-lg leading-none">{current.flag}</span>
              <span className="hidden sm:inline font-semibold">{current.native}</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border py-2 z-50">
                <p className="px-4 pb-2 text-[11px] uppercase tracking-wide text-gray-400 font-semibold border-b mb-1">
                  Choose language
                </p>
                <div className="grid grid-cols-2">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setLangOpen(false); }}
                      className={`flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-50 ${lang === l.code ? 'text-brand-600 font-semibold bg-brand-50' : 'text-gray-700'}`}
                    >
                      <span className="text-base leading-none">{l.flag}</span>
                      <span className="truncate">{l.native}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link to="/cart" className="relative text-gray-700 hover:text-brand-600" aria-label={t('nav.cart')}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 4.6a1 1 0 00.9 1.4h12M16 21a1 1 0 100-2 1 1 0 000 2zM9 21a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-vivid-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          {token ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-sm text-gray-700 capitalize">
                {t('nav.hi')}, {user?.full_name?.split(' ')[0] || 'User'}
              </span>
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-sm text-brand-600 font-semibold">{t('nav.admin')}</Link>
              )}
              <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-vivid-500">
                {t('nav.logout')}
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-sm font-semibold text-white bg-brand-600 px-4 py-2 rounded-lg hover:bg-brand-700">
              {t('nav.login')}
            </Link>
          )}

          <button onClick={() => setOpen(!open)} className="lg:hidden text-gray-700" aria-label="Menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <nav className="hidden lg:block border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 text-sm font-medium">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `py-3 border-b-2 transition ${isActive ? 'text-brand-600 border-brand-600 font-semibold' : 'border-transparent text-gray-700 hover:text-brand-600'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {open && (
        <div className="lg:hidden border-t bg-white px-4 py-3 flex flex-col gap-3 text-sm font-medium">
          <form onSubmit={onSearch} className="flex border rounded-lg overflow-hidden">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('nav.search')} className="flex-1 px-3 py-2 text-sm outline-none" />
            <button type="submit" className="btn-gradient text-white px-4">🔍</button>
          </form>
          {navLinks.map((l) => (
            <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-gray-700 hover:text-brand-600">
              {l.label}
            </NavLink>
          ))}
          {!token && (
            <Link to="/login" onClick={() => setOpen(false)} className="text-brand-600 font-semibold">
              {t('nav.login')}
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
