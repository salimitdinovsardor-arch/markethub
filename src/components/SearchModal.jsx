import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Star } from 'lucide-react';
import { INITIAL_PRODUCTS } from '../utils/mockData';
import { formatPrice } from '../utils/constants';

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length > 1) {
      const q = query.toLowerCase().trim();
      const filtered = INITIAL_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      ).slice(0, 5);
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  if (!isOpen) return null;

  const handleSelectProduct = (productId) => {
    onClose();
    navigate(`/products/${productId}`);
  };

  const handleSearchAll = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-slide-down">
        
        {/* Search Input Bar */}
        <form onSubmit={handleSearchAll} className="relative flex items-center p-4 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 ml-2" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Mahsulot nomi yoki toifasi bo‘yicha tezkor qidiruv..."
            className="w-full pl-3 pr-10 py-2 bg-transparent text-sm sm:text-base font-medium text-slate-900 dark:text-white focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </form>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {query.trim().length > 1 && results.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">
              "{query}" bo‘yicha hech narsa topilmadi
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3">
                Topilgan mahsulotlar:
              </span>
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product.id)}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded-xl object-contain bg-slate-50 dark:bg-slate-800 p-1 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="capitalize">{product.category}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3 h-3 fill-amber-500" />
                        <span>{product.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                    {formatPrice(product.price)}
                  </div>
                </div>
              ))}
              <div className="pt-2 text-center">
                <button
                  onClick={handleSearchAll}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                >
                  Barcha natijalarni ko‘rish <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : (
            <div className="py-6 px-4 space-y-2 text-center sm:text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Ommabop qidiruvlar:
              </span>
              <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
                {['iPhone 15', 'PlayStation', 'Sony ANC', 'Nike Jordan', 'Apple Watch', 'Dyson'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default SearchModal;

