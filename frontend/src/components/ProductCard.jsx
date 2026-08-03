import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../services/CartContext';
import { useLanguage } from '../services/LanguageContext';

const fallbackImages = {
  'Computers': 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=600&q=60',
  'Laptops': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=60',
  'Smart Watches': 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=60',
  'Smartphones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=60',
  'Tablets': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=60',
  'Printers': 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=600&q=60',
  'Networking Devices': 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=60',
  'Accessories': 'https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=600&q=60',
};

const genericFallback = 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=60';

export function formatRWF(n) {
  return new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', maximumFractionDigits: 0 }).format(n);
}

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { t } = useLanguage();
  const [failCount, setFailCount] = useState(0);
  const [imgSrc, setImgSrc] = useState(
    product.image && !product.image.includes('undefined')
      ? product.image
      : fallbackImages[product.category_name] || fallbackImages['Accessories']
  );

  const inStock = product.quantity > 0;

  const handleImgError = () => {
    if (failCount === 0) {
      setFailCount(1);
      setImgSrc(fallbackImages[product.category_name] || genericFallback);
    } else {
      setImgSrc(genericFallback);
      setFailCount(2);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-brand-200 transition overflow-hidden flex flex-col">
      <Link to={`/products/${product.slug}`} className="relative block h-44 overflow-hidden bg-gradient-to-br from-brand-50 to-accent-50">
        <img
          src={imgSrc}
          alt={product.name}
          onError={handleImgError}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <span
          className={`absolute top-2 left-2 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
            inStock ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {inStock ? 'In Stock' : t('common.outOfStock')}
        </span>
      </Link>

      <div className="p-3.5 flex flex-col gap-1.5 flex-1">
        <span className="text-[11px] text-accent-500 font-semibold uppercase tracking-wide truncate">
          {product.category_name || 'Product'}
        </span>
        <Link to={`/products/${product.slug}`} className="font-semibold text-sm text-gray-900 leading-snug hover:text-brand-600 line-clamp-2 min-h-[2.4em]">
          {product.name}
        </Link>
        <div className="mt-auto pt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-extrabold text-brand-700">{formatRWF(product.price)}</span>
            <span className="text-xs text-gray-400">RWF</span>
          </div>
          <button
            onClick={() => addItem(product)}
            disabled={!inStock}
            className="mt-2 w-full btn-gradient text-white text-xs font-semibold py-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t('common.addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
}
