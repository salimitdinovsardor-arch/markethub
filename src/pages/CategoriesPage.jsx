import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Smartphone, 
  Shirt, 
  Home, 
  Watch, 
  Activity, 
  ArrowRight,
  Layers
} from 'lucide-react';
import { productService } from '../services/productService';
import LoadingSpinner from '../components/LoadingSpinner';

const iconMap = {
  electronics: Smartphone,
  fashion: Shirt,
  home: Home,
  accessories: Watch,
  sports: Activity
};

const categoryDescriptions = {
  electronics: 'Smartfonlar, noutbuklar, quloqchinlar va aqlli gadjetlar',
  fashion: 'Erkaklar va ayollar uchun zamonaviy va qulay kiyimlar',
  home: 'Zamonaviy oshxona anjomlari va maishiy texnikalar',
  accessories: 'Qo‘l soatlari, ko‘zoynaklar va charm aksessuarlar',
  sports: 'Fitnes, yoga va faol hayot tarzi uchun kerakli jihozlar'
};

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await productService.getCategories();
        setCategories(res?.categories?.filter(c => c.id !== 'all') || []);
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Kategoriyalar yuklanmoqda..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Barcha kategoriyalar
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          O‘zingizga qiziq bo‘lgan mahsulotlar to‘plamini tanlang
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const Icon = iconMap[cat.id] || Layers;
          const desc = categoryDescriptions[cat.id] || 'Barcha turdagi mahsulotlar to‘plami';

          return (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-105 transition-all duration-300 shadow-inner">
                  <Icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Mahsulotlarni ko‘rish</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesPage;

