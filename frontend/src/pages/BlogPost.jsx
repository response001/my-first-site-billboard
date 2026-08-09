import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    api.blogPost(slug).then((d) => setPost(d.post)).catch(() => {});
  }, [slug]);

  if (!post) return <div className="max-w-3xl mx-auto px-4 py-14 text-gray-500">Loading post...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link to="/blog" className="text-sm text-brand-600 hover:underline">&larr; Back to blog</Link>
      <span className="text-xs text-accent-500 font-semibold uppercase mt-4 block">{post.category}</span>
      <h1 className="text-3xl font-bold text-gray-900 mt-1 mb-2">{post.title}</h1>
      <p className="text-sm text-gray-400 mb-6">By {post.author} · {new Date(post.created_at).toLocaleDateString()}</p>
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full max-h-80 object-cover rounded-xl shadow mb-8"
          loading="lazy"
        />
      )}
      <div className="bg-white rounded-xl shadow p-8 text-gray-700 leading-relaxed whitespace-pre-wrap">
        {post.content}
      </div>
    </div>
  );
}
