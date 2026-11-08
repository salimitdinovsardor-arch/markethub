import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  ShieldCheck, 
  Truck,
  ArrowLeft,
  Tag,
  Check,
  X
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/constants';
import EmptyState from '../components/EmptyState';

const CartPage = () => {
  const { 
    cartItems, 
    totalPrice, 
    totalItemsCount, 
    increaseQuantity, 
    decreaseQuantity, 
    removeFromCart, 
    clearCart 
  } = useCart();

  const toast = useToast();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Savatchangiz hozircha bo‘sh"
          description="Siz hali hech qanday mahsulot tanlamadingiz. Bizning katalogimizdan yangi va sifatli mahsulotlarni tanlab oling!"
          actionText="Xaridni boshlash"
          actionLink="/products"
        />
      </div>
    );
  }

  // Promo code validation
  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();

    if (!code) return;

    if (code === 'CHEGIRMA10') {
      const discount = Math.round(totalPrice * 0.1);
      setAppliedPromo({ code, discount, percent: 10 });
      toast.success('10% chegirma muvaffaqiyatli qo‘llandi!');
    } else if (code === 'MARKET20') {
      const discount = Math.round(totalPrice * 0.2);
      setAppliedPromo({ code, discount, percent: 20 });
      toast.success('20% chegirma muvaffaqiyatli qo‘llandi!');
    } else if (code === 'SUPER50') {
      const discount = Math.min(50, totalPrice);
      setAppliedPromo({ code, discount, fixed: 50 });
      toast.success('$50 chegirma muvaffaqiyatli qo‘llandi!');
    } else {
      setPromoError('Yaroqsiz promokod. Sinab ko‘ring: CHEGIRMA10 yoki MARKET20');
      toast.error('Bunday promokod mavjud emas');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
    toast.info('Promokod bekor qilindi');
  };

  const discountAmount = appliedPromo ? appliedPromo.discount : 0;
  const shippingCost = totalPrice > 500 ? 0 : 15;
  const grandTotal = Math.max(0, totalPrice - discountAmount + shippingCost);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Xarid savatchasi
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Savatchada jami <span className="font-bold text-indigo-600 dark:text-indigo-400">{totalItemsCount} ta</span> mahsulot bor
          </p>
        </div>

        <button
          onClick={clearCart}
          className="self-start sm:self-auto text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
        >
          Savatchani tozalash
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col sm:flex-row items-center gap-4 transition-all"
            >
              {/* Product Image */}
              <Link to={`/products/${item.id}`} className="w-24 h-24 flex-shrink-0 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden p-2">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain hover:scale-105 transition-transform"
                />
              </Link>

              {/* Product Details */}
              <div className="flex-1 text-center sm:text-left space-y-1">
                <Link
                  to={`/products/${item.id}`}
                  className="font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-1 transition-colors"
                >
                  {item.name}
                </Link>
                <div className="text-xs text-slate-400 uppercase font-semibold">
                  {item.category}
                </div>
                <div className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                  {formatPrice(item.price)}
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-1">
                <button
                  onClick={() => decreaseQuantity(item.id)}
                  className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                  title="Kamaytirish"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-sm font-bold text-slate-900 dark:text-white">
                  {item.quantity}
                </span>
                <button
                  onClick={() => increaseQuantity(item.id)}
                  className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                  title="Oshirish"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Item Total Price */}
              <div className="w-24 text-right">
                <span className="font-black text-base text-slate-900 dark:text-white">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                title="O‘chirish"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}

          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> Xarid qilishni davom ettirish
            </Link>
          </div>
        </div>

        {/* Order Summary Card & Promo Code */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md space-y-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              Buyurtma xulosasi
            </h3>

            {/* Promo Code Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Promokod (Chegirma kuponi)
              </label>
              {appliedPromo ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>{appliedPromo.code} (-{formatPrice(appliedPromo.discount)})</span>
                  </div>
                  <button onClick={handleRemovePromo} className="text-rose-500 hover:text-rose-700 p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Masalan: CHEGIRMA10"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    />
                    <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:bg-slate-800 transition-colors"
                  >
                    Qo‘llash
                  </button>
                </form>
              )}
              {promoError && (
                <p className="text-[11px] text-rose-500">{promoError}</p>
              )}
              <p className="text-[11px] text-slate-400">
                Mavjud kodlar: <span className="font-bold text-indigo-500">CHEGIRMA10</span>, <span className="font-bold text-indigo-500">MARKET20</span>
              </p>
            </div>

            <div className="space-y-3 text-sm pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Mahsulotlar narxi:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(totalPrice)}</span>
              </div>

              {appliedPromo && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Chegirma ({appliedPromo.code}):</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Yetkazib berish:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {shippingCost === 0 ? 'Bepul' : formatPrice(shippingCost)}
                </span>
              </div>
              {shippingCost > 0 && (
                <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl">
                  Yana {formatPrice(500 - totalPrice)} lik xarid qilsangiz, yetkazib berish bepul bo‘ladi!
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline">
              <span className="text-base font-bold text-slate-900 dark:text-white">Umumiy to‘lov:</span>
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {formatPrice(grandTotal)}
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-98 transition-all"
            >
              Buyurtmani rasmiylashtirish
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="space-y-2 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>100% Xavfsiz to‘lov kafolati</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-500" />
                <span>Tezkor yetkazish xizmati</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default CartPage;
