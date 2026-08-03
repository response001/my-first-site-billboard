import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const filters = ['All', 'Latest Technology News', 'Programming Tutorials', 'Networking Tips', 'Graphic Design Ideas', 'Student Success Stories'];

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    api.blog().then((d) => setPosts(d.posts)).catch(() => {});
  }, []);

  const shown = filter === 'All' ? posts : posts.filter((p) => p.category === filter);

  return (
    <div className="max-w-6xl mx-auto px-4 py-14">
      <div className="rounded-3xl overflow-hidden relative mb-8 h-52">
        <img src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=60" alt="Blog" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-transparent flex items-center px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Blog</h1>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-8">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === f ? 'bg-brand-600 text-white' : 'bg-white text-gray-700 shadow'}`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shown.map((p, idx) => (
          <article key={p.id} className="bg-white rounded-2xl shadow card-hover overflow-hidden">
            <div className="h-40 overflow-hidden">
              {p.image ? (
                <img src={p.image} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <img
                  src={`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=60${idx % 2 ? '' : ''}`}
                  alt={p.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
            </div>
            <div className="p-5">
              <span className="text-xs text-accent-500 font-semibold uppercase">{p.category}</span>
              <Link to={`/blog/${p.slug}`} className="block font-semibold text-gray-900 hover:text-brand-600 mt-1">{p.title}</Link>
              <p className="text-sm text-gray-500 mt-2">{p.excerpt}</p>
              <p className="text-xs text-gray-400 mt-3">By {p.author} · {new Date(p.created_at).toLocaleDateString()}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
