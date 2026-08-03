import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../services/CartContext';

function formatRWF(n) {
  return new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', maximumFractionDigits: 0 }).format(n);
}

const genericFallback = 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=60';

export default function ProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    api.product(slug)
      .then((d) => {
        setProduct(d.product);
        setActiveImg(d.product.gallery && d.product.gallery.length ? d.product.gallery[0] : d.product.image);
      })
      .catch(() => {});
  }, [slug]);

  if (!product) {
    return <div className="max-w-7xl mx-auto px-4 py-14 text-gray-500">Loading product...</div>;
  }

  const gallery = Array.isArray(product.gallery) && product.gallery.length
    ? product.gallery.filter((u) => u && !u.includes('undefined'))
    : [product.image];
  const photos = gallery.length ? gallery : [genericFallback];
  const inStock = product.quantity > 0;
  const features = Array.isArray(product.features) ? product.features : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Link to="/products" className="text-sm text-brand-600 hover:underline">&larr; Back to products</Link>

      <div className="grid md:grid-cols-2 gap-10 mt-4">
        <div>
          <div className="bg-white rounded-xl shadow flex items-center justify-center p-8 h-80 border border-gray-100">
            {photos[0] ? (
              <img src={activeImg || photos[0]} alt={product.name} onError={(e) => { e.target.src = genericFallback; }} className="max-h-full max-w-full object-contain" />
            ) : (
              <span className="text-8xl">📦</span>
            )}
          </div>
          {photos.length > 1 && (
            <div className="flex gap-3 mt-4">
              {photos.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(img)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex items-center justify-center bg-white ${
                    (activeImg || photos[0]) === img ? 'border-brand-600' : 'border-gray-200 hover:border-brand-300'
                  }`}
                >
                  <img src={img} alt={`${product.name} view ${i + 1}`} onError={(e) => { e.target.src = genericFallback; }} className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="text-sm text-accent-500 font-semibold uppercase">{product.category_name || 'Product'}</span>
          <h1 className="text-3xl font-bold text-gray-900 mt-1">{product.name}</h1>
          <p className="text-3xl font-extrabold text-brand-700 mt-3">{formatRWF(product.price)}</p>
          <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>
          <p className="text-sm mt-3">
            Stock: {inStock ? <span className="text-green-600 font-semibold">{product.quantity} available</span> : <span className="text-red-600">Out of stock</span>}
          </p>

          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center border rounded-lg">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-gray-600">−</button>
              <span className="px-3 py-2 font-semibold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-3 py-2 text-gray-600">+</button>
            </div>
            <button
              onClick={() => addItem(product, qty)}
              disabled={!inStock}
              className="flex-1 bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 disabled:opacity-40"
            >
              Add to Cart
            </button>
          </div>
          <Link
            to="/checkout"
            onClick={() => addItem(product, qty)}
            className="block text-center mt-3 bg-accent-500 text-white py-3 rounded-lg font-semibold hover:bg-accent-400"
          >
            Buy Now
          </Link>
        </div>
      </div>

      {features.length > 0 && (
        <div className="mt-12 bg-white rounded-xl shadow border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Product Features</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {features.map((f, i) => {
              const idx = f.indexOf(':');
              const label = idx > -1 ? f.slice(0, idx) : 'Feature';
              const value = idx > -1 ? f.slice(idx + 1).trim() : f;
              return (
                <div key={i} className="flex items-start gap-3 bg-brand-50/60 rounded-lg px-4 py-3">
                  <span className="text-brand-600 mt-0.5">✓</span>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">{label}</p>
                    <p className="text-sm font-medium text-gray-800">{value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
