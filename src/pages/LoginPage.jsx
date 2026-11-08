import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Iltimos, email va parolni to‘ldiring');
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password });
      toast.success('Xush kelibsiz! Tizimga muvaffaqiyatli kirdingiz');
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error', err);
      const msg = err?.response?.data?.message || 'Email yoki parol noto‘g‘ri';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Test hisob ma'lumotlarini tezda kiritish
  const handleQuickDemo = () => {
    setEmail('user@example.com');
    setPassword('Password123!');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Tizimga kirish
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Hisobingizga kirish uchun ma’lumotlaringizni kiriting
          </p>
        </div>

        {/* Demo Account Box */}
        <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <div className="font-bold text-indigo-900 dark:text-indigo-200">Sinov hisobi (Demo):</div>
            <div className="text-slate-600 dark:text-slate-400">user@example.com / Password123!</div>
          </div>
          <button
            type="button"
            onClick={handleQuickDemo}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-colors flex-shrink-0"
          >
            To‘ldirish
          </button>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl space-y-5">
          
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Elektron pochta
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:ring-2 focus:ring-indigo-500/40 focus:outline-none"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Parol
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:ring-2 focus:ring-indigo-500/40 focus:outline-none"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors"
                  title={showPassword ? 'Parolni yashirish' : 'Parolni ko‘rsatish'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-98 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Tekshirilmoqda...
                </>
              ) : (
                <>
                  Kirish <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Switch to Register */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
            Hisobingiz yo‘qmi?{' '}
            <Link
              to="/register"
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Ro‘yxatdan o‘tish
            </Link>
          </div>

        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>JWT autentifikatsiya orqali xavfsiz himoyalangan</span>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;

