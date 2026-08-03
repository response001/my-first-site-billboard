import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  function addItem(product, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.product_id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product_id === product.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, {
        product_id: product.id,
        product_name: product.name,
        price: Number(product.price),
        quantity: qty,
        image: product.image,
      }];
    });
  }

  function removeItem(productId) {
    setItems((prev) => prev.filter((i) => i.product_id !== productId));
  }

  function updateQty(productId, qty) {
    if (qty <= 0) return removeItem(productId);
    setItems((prev) => prev.map((i) => (i.product_id === productId ? { ...i, quantity: qty } : i)));
  }

  function clear() {
    setItems([]);
  }

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );
  const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clear, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
