import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, ShoppingBag, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validatsiyalar
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMessage('Barcha maydonlarni to‘ldirish shart');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Email formati noto‘g‘ri (masalan: misol@domain.uz)');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Parol kamida 6 ta belgidan iborat bo‘lishi kerak');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Kiritilgan parollar bir-biriga mos kelmadi');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirmPassword
      });

      toast.success('Tabriklaymiz! Muvaffaqiyatli ro‘yxatdan o‘tdingiz');
      navigate('/');
    } catch (err) {
      console.error('Registration error', err);
      const msg = err?.response?.data?.message || 'Ro‘yxatdan o‘tishda xatolik yuz berdi';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Ro‘yxatdan o‘tish
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            MarketHub oilasiga qo‘shiling va maxsus chegirmalarga ega bo‘ling
          </p>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl space-y-5">
          
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                To‘liq ism
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ali Valiyev"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:ring-2 focus:ring-indigo-500/40 focus:outline-none"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

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
                  placeholder="ali@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:ring-2 focus:ring-indigo-500/40 focus:outline-none"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Parol (kamida 6 ta belgi)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Parolni tasdiqlang
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:ring-2 focus:ring-indigo-500/40 focus:outline-none"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
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
                  <Loader2 className="w-4 h-4 animate-spin" /> Ro‘yxatdan o‘tkazilmoqda...
                </>
              ) : (
                <>
                  Ro‘yxatdan o‘tish <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Switch to Login */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
            Hisobingiz allaqachon bormi?{' '}
            <Link
              to="/login"
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Tizimga kirish
            </Link>
          </div>

        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Shaxsiy ma’lumotlaringiz maxfiy saqlanadi</span>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;

