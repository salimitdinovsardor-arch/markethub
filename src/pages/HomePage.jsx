import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Truck, 
  Clock, 
  Smartphone, 
  Shirt, 
  Home, 
  Watch, 
  Activity,
  Layers
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { productService } from '../services/productService';

const categoryIcons = {
  electronics: Smartphone,
  fashion: Shirt,
  home: Home,
  accessories: Watch,
  sports: Activity
};

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          productService.getProducts(),
          productService.getCategories()
        ]);
        setFeaturedProducts(prodRes?.products || []);
        setCategories(catRes?.categories?.filter(c => c.id !== 'all') || []);
      } catch (err) {
        console.error('Home data load error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-6 sm:pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-2xl p-8 sm:p-14 lg:p-20">
            
            {/* Background glowing blobs */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Yangi kolleksiya 2026</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-none">
                Sifatli xaridlar olamiga xush kelibsiz
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                Eng yangi elektronika gadjetlari, zamonaviy kiyimlar va qulay uy anjomlari bitta joyda. 
                Kafolatli va tezkor yetkazib berish xizmati bilan.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/products"
                  className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all"
                >
                  Katalogni ko‘rish
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/categories"
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm sm:text-base border border-white/20 backdrop-blur-md transition-colors"
                >
                  Kategoriyalar
                </Link>
              </div>
            </div>

            {/* Quick stats banner inside hero */}
            <div className="relative z-10 mt-12 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">10k+</div>
                <div className="text-xs text-slate-400 font-medium">Original mahsulotlar</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">99.8%</div>
                <div className="text-xs text-slate-400 font-medium">Mamnun mijozlar</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">24h</div>
                <div className="text-xs text-slate-400 font-medium">Tezkor yetkazish</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">100%</div>
                <div className="text-xs text-slate-400 font-medium">Xavfsiz to‘lov</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Categories preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Ommabop kategoriyalar
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              O‘zingizga kerakli bo‘limni tanlang
            </p>
          </div>
          <Link
            to="/categories"
            className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 group"
          >
            Barchasi
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.id] || Layers;
            return (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <Icon className="w-7 h-7" />
                </div>
                <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-500">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Tavsiya etilgan mahsulotlar
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Eng ko‘p xarid qilinayotgan va yuqori baholangan mahsulotlar
              </p>
            </div>
          </div>
          <Link
            to="/products"
            className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 group"
          >
            Barcha mahsulotlar
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Mahsulotlar yuklanmoqda..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* Special Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-white/20 rounded-full">
              Haftalik taklif
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold">
              Barcha elektronika mahsulotlariga 20% gacha chegirma!
            </h3>
            <p className="text-indigo-100 text-sm sm:text-base">
              Chegirmalar muddati cheklangan. Bugun buyurtma bering va bepul yetkazib berishga ega bo‘ling.
            </p>
          </div>
          <Link
            to="/products?category=electronics"
            className="px-8 py-4 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-extrabold text-sm shadow-xl active:scale-95 transition-all flex-shrink-0"
          >
            Chegirmalarni ko‘rish
          </Link>
        </div>
      </section>

    </div>
  );
};

export default HomePage;

