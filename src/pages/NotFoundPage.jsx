import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="text-8xl sm:text-9xl font-black text-indigo-600/20 dark:text-indigo-400/20 tracking-widest select-none">
        404
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-4 mb-2">
        Sahifa topilmadi
      </h1>
      <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
        Siz qidirayotgan sahifa o‘chirilgan, nomi o‘zgargan yoki vaqtincha mavjud bo‘lmasligi mumkin.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
      >
        <Home className="w-4 h-4" /> Bosh sahifaga qaytish
      </Link>
    </div>
  );
};

export default NotFoundPage;

