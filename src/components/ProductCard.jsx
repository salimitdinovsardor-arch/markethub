import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Check, Eye, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/constants';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const toast = useToast();
  const [isAdded, setIsAdded] = useState(false);

  const isFavorite = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    toast.success(`"${product.name.slice(0, 24)}..." savatchaga qo‘shildi!`);
    
    setTimeout(() => {
      setIsAdded(false);
    }, 1200);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (!isFavorite) {
      toast.success(`"${product.name.slice(0, 20)}..." sevimlilarga qo‘shildi!`);
    } else {
      toast.info(`"${product.name.slice(0, 20)}..." sevimlilardan olib tashlandi`);
    }
  };

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all duration-300 overflow-hidden">
      
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {discountPercent && (
          <span className="px-2.5 py-1 text-xs font-bold text-white bg-rose-500 rounded-lg shadow-sm">
            -{discountPercent}%
          </span>
        )}
        {product.isFeatured && (
          <span className="px-2.5 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800/60 rounded-lg shadow-sm">
            Top
          </span>
        )}
      </div>

      {/* Wishlist Heart Button */}
      <button
        onClick={handleToggleWishlist}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all shadow-md active:scale-75 ${
          isFavorite
            ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-500 scale-105'
            : 'bg-white/80 dark:bg-slate-900/80 text-slate-400 hover:text-rose-500 opacity-90 group-hover:opacity-100'
        }`}
        title={isFavorite ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
      >
        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
      </button>

      {/* Image container */}
      <div className="relative aspect-square w-full bg-slate-100 dark:bg-slate-800/60 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Link
            to={`/products/${product.id}`}
            className="px-3.5 py-2 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <Eye className="w-4 h-4 text-indigo-600" />
            Batafsil
          </Link>
        </div>
      </div>

      {/* Product Content */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        
        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center text-amber-400">
            <Star className="w-4 h-4 fill-amber-400" />
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {product.rating}
          </span>
          <span className="text-xs text-slate-400">
            ({product.reviewsCount} sharh)
          </span>
        </div>

        {/* Title */}
        <Link to={`/products/${product.id}`} className="block flex-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`p-2.5 sm:px-3 sm:py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
            }`}
            title="Savatchaga qo‘shish"
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline font-bold">Qo‘shildi</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline font-bold">Qo‘shish</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
