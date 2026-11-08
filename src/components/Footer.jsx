import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw, Headphones, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
      
      {/* Advantages Banner */}
      <div className="border-b border-slate-100 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Tezkor yetkazib berish</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Butun O‘zbekiston bo‘ylab 24 soatda</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">100% Kafolatlangan</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Faqat original mahsulotlar</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Oson qaytarish</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">14 kun ichida almashtirish</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400 flex-shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">24/7 Qo‘llab-quvvatlash</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Har qanday savolga tezkor javob</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">MarketHub</span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Eng sifatli elektronika, kiyim-kechak va aksessuarlar internet do‘koni. Har kuni yangi chegirmalar!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Katalog
            </h5>
            <ul className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/products?category=electronics" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Elektronika</Link></li>
              <li><Link to="/products?category=fashion" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Kiyim-kechak</Link></li>
              <li><Link to="/products?category=accessories" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Aksessuarlar</Link></li>
              <li><Link to="/products?category=home" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Uy va oshxona</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h5 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Mijozlarga yordam
            </h5>
            <ul className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/orders" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Buyurtma holati</Link></li>
              <li><Link to="/cart" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Mening savatcham</Link></li>
              <li><Link to="/profile" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Shaxsiy kabinet</Link></li>
              <li><span className="cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Yetkazib berish shartlari</span></li>
            </ul>
          </div>

          {/* Contact / Newsletter */}
          <div>
            <h5 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Bog‘lanish
            </h5>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
              Telefon: +998 (71) 200-00-00
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Email: info@markethub.uz
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-300">Payme</span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-300">Click</span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-300">Uzum</span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-300">Visa / MC</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400 dark:text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} MarketHub Online Shop. Barcha huquqlar himoyalangan.</p>
          <p className="flex items-center gap-1">
            Mukammallik va sevgi bilan yaratilgan <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

