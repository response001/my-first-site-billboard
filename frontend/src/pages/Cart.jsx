import { Link } from 'react-router-dom';
import { useCart } from '../services/CartContext';

function formatRWF(n) {
  return new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', maximumFractionDigits: 0 }).format(n);
}

export default function Cart() {
  const { items, updateQty, removeItem, total, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Browse our products and add something you love.</p>
        <Link to="/products" className="bg-brand-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-700">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Shopping Cart</h1>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {items.map((i) => (
          <div key={i.product_id} className="flex items-center gap-4 p-4 border-b">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              {i.image ? <img src={i.image} alt={i.product_name} className="h-full w-full object-contain" /> : <span>📦</span>}
            </div>
            <div className="flex-1">
              <Link to={`/products/${i.product_id}`} className="font-semibold text-gray-900 hover:text-brand-600">{i.product_name}</Link>
              <p className="text-sm text-gray-500">{formatRWF(i.price)}</p>
            </div>
            <div className="flex items-center border rounded-lg">
              <button onClick={() => updateQty(i.product_id, i.quantity - 1)} className="px-3 py-1.5 text-gray-600">−</button>
              <span className="px-3 py-1.5 font-semibold">{i.quantity}</span>
              <button onClick={() => updateQty(i.product_id, i.quantity + 1)} className="px-3 py-1.5 text-gray-600">+</button>
            </div>
            <span className="font-bold text-brand-700 w-28 text-right">{formatRWF(i.price * i.quantity)}</span>
            <button onClick={() => removeItem(i.product_id)} className="text-red-500 hover:text-red-700" aria-label="Remove">✕</button>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        <button onClick={clear} className="text-sm text-gray-500 hover:text-red-600">Clear Cart</button>
        <div className="text-right">
          <p className="text-lg">Total: <span className="font-bold text-brand-700">{formatRWF(total)}</span></p>
          <Link to="/checkout" className="inline-block bg-accent-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-400 mt-2">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
