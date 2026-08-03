import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import CourseCard from '../components/CourseCard';
import { api } from '../services/api';
import { useLanguage } from '../services/LanguageContext';

const galleryImages = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=60',
];

const stats = [
  { value: '500+', label: 'Devices Sold' },
  { value: '200+', label: 'Students Trained' },
  { value: '50+', label: 'Interns Placed' },
  { value: '100%', label: 'Warranty Guarantee' },
];

export default function Home() {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api.products().then((d) => setProducts(d.products.slice(0, 12))).catch(() => {});
    api.courses().then((d) => setCourses(d.courses)).catch(() => {});
  }, []);

  const whyUs = t('home.whyUsItems');

  return (
    <div>
      <Hero />

      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-extrabold text-gradient">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{t('home.featured')}</h2>
          <Link to="/products" className="text-brand-600 font-semibold text-sm hover:underline">{t('home.viewAll')} →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
          {products.length === 0 && <p className="text-gray-500">{t('home.loading')}</p>}
        </div>
      </section>

      <section className="bg-gradient-to-r from-brand-700 via-brand-600 to-accent-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-14">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">{t('home.whyUs')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {whyUs.map((w) => (
              <div key={w} className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm font-medium backdrop-blur">
                <span className="text-sun-400 text-lg">✔</span> {w}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{t('home.courses')}</h2>
          <Link to="/courses" className="text-brand-600 font-semibold text-sm hover:underline">{t('home.viewAll')} →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((c) => <CourseCard key={c.id} course={c} />)}
        </div>
      </section>

      <section className="bg-gradient-to-br from-slate-900 to-brand-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-14 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">{t('home.internshipTitle')}</h2>
          <p className="mb-4 text-gray-200">{t('home.internshipText')}</p>
          <div className="flex justify-center gap-3 mb-8">
            {['L3', 'L4', 'L5'].map((l) => (
              <span key={l} className="bg-sun-400 text-slate-900 px-5 py-2 rounded-full font-extrabold shadow-lg">{l}</span>
            ))}
          </div>
          <Link to="/internship" className="btn-vivid inline-block text-white font-bold px-8 py-3.5 rounded-xl text-lg">
            {t('home.applyInternship')}
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">{t('home.galleryTitle')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((img, i) => (
            <div key={i} className="rounded-2xl overflow-hidden card-hover">
              <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-44 object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
