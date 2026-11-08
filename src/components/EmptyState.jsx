import React from 'react';
import { Link } from 'react-router-dom';
import { PackageOpen } from 'lucide-react';

const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'Ma’lumot topilmadi',
  description = 'Hozircha bu bo‘limda hech qanday ma’lumot mavjud emas.',
  actionText = 'Xaridni boshlash',
  actionLink = '/products'
}) => {
  return (
    <div className="py-16 px-4 text-center flex flex-col items-center justify-center max-w-md mx-auto">
      <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5 shadow-inner">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
        {description}
      </p>
      {actionLink && actionText && (
        <Link
          to={actionLink}
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/25 transition-all active:scale-95"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;

