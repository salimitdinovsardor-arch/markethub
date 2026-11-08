import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ text = 'Yuklanmoqda...' }) => {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-200 dark:border-indigo-900/50"></div>
        <div className="w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
        {text}
      </p>
    </div>
  );
};

export default LoadingSpinner;

