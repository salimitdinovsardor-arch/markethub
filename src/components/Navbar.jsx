import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  ShoppingCart, 
  User, 
  Sun, 
  Moon, 
  LogOut, 
  Package, 
  Menu, 
  X, 
  ChevronDown,
  Heart,
  Search
} from 'lucide-react';
import SearchModal from './SearchModal';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItemsCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Tizimdan muvaffaqiyatli chiqdingiz');
      setProfileDropdownOpen(false);
      setMobileMenuOpen(false);
      navigate('/login');
    } catch {
      toast.error('Chiqishda xatolik yuz berdi');
    }
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
      isActive
        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
        : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-slate-900/85 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-600 dark:from-white dark:via-slate-200 dark:to-indigo-400 bg-clip-text text-transparent">
                Market<span className="text-indigo-600 dark:text-indigo-400">Hub</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
                Online Shop
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            <NavLink to="/" className={navLinkClass}>Bosh sahifa</NavLink>
            <NavLink to="/products" className={navLinkClass}>Mahsulotlar</NavLink>
            <NavLink to="/categories" className={navLinkClass}>Kategoriyalar</NavLink>
            {isAuthenticated && (
              <NavLink to="/orders" className={navLinkClass}>Buyurtmalarim</NavLink>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* Live Search Trigger Button */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="p-2 sm:p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Tezkor qidiruv"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={theme === 'dark' ? "Yorug' rejim" : "Qorong'i rejim"}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400 hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600 hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-2 sm:p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
              title="Sevimlilar"
            >
              <Heart className="w-5 h-5 group-hover:scale-110 text-rose-500 transition-transform" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-4.5 px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart Button */}
            <Link
              to="/cart"
              className="relative p-2 sm:p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
              title="Savatcha"
            >
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm animate-pulse-subtle">
                  {totalItemsCount > 99 ? '99+' : totalItemsCount}
                </span>
              )}
            </Link>

            {/* Auth State / Profile */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all"
                >
                  <img
                    src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'User')}`}
                    alt={user?.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover ring-2 ring-indigo-500/30"
                  />
                  <span className="hidden sm:inline text-sm font-semibold max-w-[100px] truncate text-slate-800 dark:text-slate-200">
                    {user?.name?.split(' ')[0] || 'Profil'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setProfileDropdownOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800/80 py-2 z-20 animate-slide-down">
                      <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {user?.email}
                        </p>
                      </div>

                      <div className="p-1">
                        <Link
                          to="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <User className="w-4 h-4 text-indigo-500" />
                          Mening profilim
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Package className="w-4 h-4 text-indigo-500" />
                          Buyurtmalarim
                        </Link>
                        <Link
                          to="/wishlist"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Heart className="w-4 h-4 text-rose-500" />
                          Sevimlilar
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Tizimdan chiqish
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-semibold rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Kirish
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-600/25 transition-all"
                >
                  Ro‘yxatdan o‘tish
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-1 animate-slide-down">
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl font-medium ${
                  isActive ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50' : 'text-slate-700 dark:text-slate-300'
                }`
              }
            >
              Bosh sahifa
            </NavLink>
            <NavLink
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl font-medium ${
                  isActive ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50' : 'text-slate-700 dark:text-slate-300'
                }`
              }
            >
              Mahsulotlar
            </NavLink>
            <NavLink
              to="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl font-medium ${
                  isActive ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50' : 'text-slate-700 dark:text-slate-300'
                }`
              }
            >
              Kategoriyalar
            </NavLink>
            <NavLink
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl font-medium ${
                  isActive ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50' : 'text-slate-700 dark:text-slate-300'
                }`
              }
            >
              Sevimlilar ({wishlistCount})
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2.5 rounded-xl font-medium ${
                      isActive ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50' : 'text-slate-700 dark:text-slate-300'
                    }`
                  }
                >
                  Buyurtmalarim
                </NavLink>
                <NavLink
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2.5 rounded-xl font-medium ${
                      isActive ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50' : 'text-slate-700 dark:text-slate-300'
                    }`
                  }
                >
                  Mening profilim
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 rounded-xl font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  Tizimdan chiqish
                </button>
              </>
            ) : (
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  Ro‘yxatdan o‘tish
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Live Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </header>
  );
};

export default Navbar;
