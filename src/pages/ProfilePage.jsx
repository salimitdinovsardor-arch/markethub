import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Key, 
  Check, 
  LogOut, 
  Loader2,
  Clock,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateProfile({ name, phone, address });
      toast.success('Profil muvaffaqiyatli yangilandi!');
    } catch (err) {
      toast.error('Profilni yangilashda xatolik yuz berdi');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Tizimdan muvaffaqiyatli chiqdingiz');
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Foydalanuvchi profili
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Shaxsiy ma’lumotlaringiz va hisob xavfsizligi
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar & Quick Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm text-center flex flex-col items-center">
            <div className="relative mb-4">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'User')}`}
                alt={user?.name}
                className="w-24 h-24 rounded-3xl object-cover ring-4 ring-indigo-500/20 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white text-[10px]" title="Onlayn">
                ✓
              </div>
            </div>

            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              {user?.name}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {user?.email}
            </p>

            <div className="w-full mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Tizimdan chiqish
              </button>
            </div>
          </div>

          {/* JWT Security Status Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-lg space-y-3">
            <div className="flex items-center gap-2 text-indigo-400">
              <Shield className="w-5 h-5" />
              <h4 className="text-xs font-bold uppercase tracking-wider">JWT Himoyasi</h4>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span>Access Token:</span>
                <span className="font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded">3 daqiqa</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Refresh Token:</span>
                <span className="font-bold text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded">7 kun (Cookie)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Auto-Refresh:</span>
                <span className="font-bold text-amber-300">Avtomatik (Interceptor)</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-white/10 leading-relaxed">
              Tokeningiz muddati tugasa, sahifani yangilamasdan avtomatik yangi token olinadi.
            </p>
          </div>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="md:col-span-2">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
              Shaxsiy ma’lumotlarni tahrirlash
            </h3>

            <form onSubmit={handleUpdate} className="space-y-5">
              
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
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:ring-2 focus:ring-indigo-500/40 focus:outline-none"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Elektron pochta (o‘zgartirib bo‘lmaydi)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Telefon raqam
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:ring-2 focus:ring-indigo-500/40 focus:outline-none"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Yetkazib berish manzili
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Toshkent shahar, Yunusobod tumani..."
                    className="w-full p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:ring-2 focus:ring-indigo-500/40 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-600/25 active:scale-95 transition-all"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saqlanmoqda...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" /> O‘zgarishlarni saqlash
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ProfilePage;

