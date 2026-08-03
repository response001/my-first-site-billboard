import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';
import { useLanguage } from '../services/LanguageContext';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name (A-Z)' },
];

export default function Products() {
  const [params] = useSearchParams();
  const activeCategory = params.get('category');
  const search = params.get('search') || '';
  const { t } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('featured');

  useEffect(() => {
    api.categories().then((d) => setCategories(d.categories)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    api.products()
      .then((d) => setAllProducts(d.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const products = useMemo(() => {
    let list = allProducts;
    if (activeCategory) {
      const cat = categories.find((c) => c.slug === activeCategory);
      if (cat) list = list.filter((p) => p.category_id === cat.id);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q) ||
          (p.category_name || '').toLowerCase().includes(q)
      );
    }
    const sorted = [...list];
    switch (sort) {
      case 'price-asc': sorted.sort((a, b) => a.price - b.price); break;
      case 'price-desc': sorted.sort((a, b) => b.price - a.price); break;
      case 'name': sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: sorted.sort((a, b) => (b.featured || 0) - (a.featured || 0));
    }
    return sorted;
  }, [allProducts, activeCategory, categories, search, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="rounded-3xl overflow-hidden relative mb-6 h-44">
        <img src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1600&q=60" alt="Products" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-700/90 to-accent-500/70 flex items-center px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">{t('nav.products')}</h1>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <a href="/products" className={`px-4 py-2 rounded-lg text-sm font-medium ${!activeCategory && !search ? 'bg-brand-600 text-white' : 'bg-white text-gray-700 shadow-sm'}`}>
          {t('common.all')}
        </a>
        {categories.map((c) => (
          <a
            key={c.id}
            href={search ? `/products?category=${c.slug}&search=${encodeURIComponent(search)}` : `/products?category=${c.slug}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${activeCategory === c.slug ? 'bg-brand-600 text-white' : 'bg-white text-gray-700 shadow-sm hover:text-brand-600'}`}
          >
            {c.name}
          </a>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <p className="text-sm text-gray-500">
          <strong className="text-gray-800">{products.length}</strong> {products.length === 1 ? 'product' : 'products'}
          {activeCategory && categories.find((c) => c.slug === activeCategory) ? ` in ${categories.find((c) => c.slug === activeCategory).name}` : ''}
          {search ? ` for "${search}"` : ''}
        </p>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500 hidden sm:inline">Sort:</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm bg-white text-gray-700"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">{t('home.loading')}</p>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No products found.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
