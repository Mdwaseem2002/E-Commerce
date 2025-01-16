/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { CartProvider, useCart } from './cart/CartContext';

// Header Component with Cart Button
const Header = () => {
  const { currentView, setCurrentView, getCartItemsCount } = useCart();
  const cartCount = getCartItemsCount();

  return (
    <header className="bg-white shadow-sm mb-8">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Men Fashion Store</h1>
        <button
          onClick={() => setCurrentView(currentView === 'products' ? 'cart' : 'products')}
          className="relative bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
        >
          <ShoppingCart size={20} />
          {currentView === 'products' ? 'View Cart' : 'View Products'}
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
          
        </button>
      </div>
    </header>
  );
};

// Product Grid Component
const ProductGrid = ({ title, products }) => {
  const [showAll, setShowAll] = useState(false);
  const { addToCart } = useCart();

  const displayedProducts = showAll ? products : products.slice(0, 3);

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-blue-600 hover:underline"
        >
          {showAll ? 'Show less ←' : 'See more →'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
              {product.discount && (
                <span className="absolute top-2 left-2 bg-gray-900 text-white px-2 py-1 text-sm rounded">
                  {product.discount}
                </span>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-medium text-lg mb-2">{product.name}</h3>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl font-bold">${product.price}</span>
                <span className="text-gray-500 line-through text-sm">
                  ${product.originalPrice}
                </span>
              </div>

              <button
                onClick={() => addToCart(product)}
                className="w-full bg-gray-900 text-white py-2 px-4 rounded flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
              >
                <ShoppingCart size={20} />
                Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Cart Page Component
const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, setCurrentView, handleCheckout } = useCart();

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const onCheckout = () => {
    const success = handleCheckout();
    if (success) {
      alert('Purchase completed successfully!');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <button
          onClick={() => setCurrentView('products')}
          className="text-blue-600 hover:underline flex items-center gap-2 mx-auto justify-center"
        >
          <ArrowLeft size={20} />
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex items-center gap-2 mb-8">
        <button
          onClick={() => setCurrentView('products')}
          className="text-blue-600 hover:underline flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Continue Shopping
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-6">Shopping Cart</h2>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
            <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />

            <div className="flex-grow">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-gray-600">${item.price}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="px-2 py-1 border rounded"
              >
                -
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="px-2 py-1 border rounded"
              >
                +
              </button>
            </div>

            <div className="text-right">
              <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-semibold">Total:</span>
          <span className="text-xl font-bold">${calculateTotal().toFixed(2)}</span>
        </div>
        <button 
          onClick={onCheckout}
          className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

// Main Content Component
const MainContent = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('tshirts');
  const { currentView } = useCart();

  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {currentView === 'products' ? (
        <>
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setSelectedCategory('tshirts')}
              className={`px-4 py-2 rounded ${selectedCategory === 'tshirts' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              T-shirts
            </button>
            <button
              onClick={() => setSelectedCategory('jackets')}
              className={`px-4 py-2 rounded ${selectedCategory === 'jackets' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Jackets
            </button>
            <button
              onClick={() => setSelectedCategory('trousers')}
              className={`px-4 py-2 rounded ${selectedCategory === 'trousers' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Trousers
            </button>
          </div>

          <ProductGrid
            title={`${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products`}
            products={products.filter(product => product.category === selectedCategory)}
          />
        </>
      ) : (
        <CartPage />
      )}
    </div>
  );
};

// Root Component
const TshirtGrid = () => {
  return (
    <CartProvider>
      <MainContent />
    </CartProvider>
  );
};

export default TshirtGrid;