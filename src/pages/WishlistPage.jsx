import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, Trash2, ShoppingCart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/constants';
import EmptyState from '../components/EmptyState';

const WishlistPage = () => {
  const { wishlist, toggleWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const toast = useToast();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={Heart}
          title="Sevimlilar ro‘yxati bo‘sh"
          description="Siz hali hech qanday mahsulotni sevimlilar ro‘yxatiga qo‘shmadingiz. O‘zingizga yoqqan mahsulotlardagi yurakcha belgisini bosing!"
          actionText="Katalogni ko‘rish"
          actionLink="/products"
        />
      </div>
    );
  }

  const handleAddAllToCart = () => {
    wishlist.forEach(item => addToCart(item, 1));
    toast.success('Barcha sevimli mahsulotlar savatchaga qo‘shildi!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Heart className="w-7 h-7 text-rose-500 fill-rose-500" /> Sevimlilar ro‘yxati
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Jami <span className="font-bold text-indigo-600 dark:text-indigo-400">{wishlist.length} ta</span> sevimli mahsulot
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAddAllToCart}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
          >
            <ShoppingCart className="w-4 h-4" /> Barchasini savatchaga qo‘shish
          </button>
          <button
            onClick={clearWishlist}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            Tozalash
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((item) => (
          <div
            key={item.id}
            className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-lg transition-all overflow-hidden"
          >
            {/* Remove from wishlist button */}
            <button
              onClick={() => {
                toggleWishlist(item);
                toast.info(`"${item.name.slice(0, 20)}..." sevimlilardan olib tashlandi`);
              }}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 dark:bg-slate-900/90 text-rose-500 shadow-md hover:scale-110 active:scale-90 transition-transform"
              title="Sevimlilardan o‘chirish"
            >
              <Heart className="w-4 h-4 fill-rose-500" />
            </button>

            {/* Product Image */}
            <Link to={`/products/${item.id}`} className="aspect-square bg-slate-100 dark:bg-slate-800/60 p-4 flex items-center justify-center overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </Link>

            {/* Details */}
            <div className="p-4 flex flex-col flex-1 justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {item.category}
                </span>
                <Link to={`/products/${item.id}`} className="block font-bold text-sm text-slate-900 dark:text-white line-clamp-1 hover:text-indigo-600">
                  {item.name}
                </Link>
                <div className="text-base font-black text-slate-900 dark:text-white mt-1">
                  {formatPrice(item.price)}
                </div>
              </div>

              <button
                onClick={() => {
                  addToCart(item, 1);
                  toast.success(`"${item.name.slice(0, 20)}..." savatchaga qo‘shildi!`);
                }}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <ShoppingCart className="w-4 h-4" /> Savatchaga qo‘shish
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default WishlistPage;

