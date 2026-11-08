import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, X, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { productService } from '../services/productService';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters from URL searchParams
  const currentCategory = searchParams.get('category') || 'all';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'default';

  const [searchInput, setSearchInput] = useState(currentSearch);

  // Kategoriyalarni yuklash
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await productService.getCategories();
        setCategories(res?.categories || []);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCats();
  }, []);

  // Mahsulotlarni yuklash (params o'zgarganda)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await productService.getProducts({
          category: currentCategory,
          search: currentSearch,
          sort: currentSort
        });
        setProducts(res?.products || []);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentCategory, currentSearch, currentSort]);

  // Qidiruvni yuborish
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      params.set('search', searchInput.trim());
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  // Kategoriyani o'zgartirish
  const handleCategoryChange = (catId) => {
    const params = new URLSearchParams(searchParams);
    if (catId && catId !== 'all') {
      params.set('category', catId);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
  };

  // Saralashni o'zgartirish
  const handleSortChange = (e) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', e.target.value);
    setSearchParams(params);
  };

  // Barcha filtrlarni tozalash
  const handleClearFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const hasActiveFilters = currentCategory !== 'all' || currentSearch !== '' || currentSort !== 'default';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Barcha mahsulotlar
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Topilgan natijalar: <span className="font-bold text-indigo-600 dark:text-indigo-400">{products.length} ta mahsulot</span>
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Mahsulot nomi yoki tavsifi bo‘yicha qidiring..."
            className="w-full pl-11 pr-24 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
          >
            Qidirish
          </button>
        </form>
      </div>

      {/* Categories Tabs & Sort dropdown */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              currentCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            Barchasi
          </button>
          {categories.filter(c => c.id !== 'all').map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                currentCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort and Clear Filter */}
        <div className="flex items-center gap-3 self-end lg:self-auto">
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 flex items-center gap-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Filtrlarni tozalash
            </button>
          )}

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <select
              value={currentSort}
              onChange={handleSortChange}
              className="py-2 pl-3 pr-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer"
            >
              <option value="default">Standart saralash</option>
              <option value="price_asc">Narx: Arzondan qimmatga</option>
              <option value="price_desc">Narx: Qimmatdan arzonga</option>
              <option value="rating">Reyting bo‘yicha</option>
            </select>
          </div>
        </div>

      </div>

      {/* Product List Grid */}
      {loading ? (
        <LoadingSpinner text="Mahsulotlar saralanmoqda..." />
      ) : products.length === 0 ? (
        <EmptyState
          title="Hech qanday mahsulot topilmadi"
          description="Qidiruv so‘zini o‘zgartirib ko‘ring yoki boshqa kategoriyani tanlang."
          actionText="Barcha mahsulotlar"
          actionLink="/products"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
};

export default ProductsPage;

