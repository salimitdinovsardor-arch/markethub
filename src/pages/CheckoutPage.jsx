import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  CreditCard, 
  MapPin, 
  Phone, 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft,
  Loader2,
  Banknote
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/orderService';
import { formatPrice } from '../utils/constants';

const CheckoutPage = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState(user?.address || 'Toshkent shahar, Amir Temur ko‘chasi, 45-uy');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '+998 90 123 45 67');
  const [paymentMethod, setPaymentMethod] = useState('Payme');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shippingCost = totalPrice > 500 ? 0 : 15;
  const grandTotal = totalPrice + shippingCost;

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!shippingAddress.trim()) {
      toast.error('Yetkazib berish manzilini kiriting');
      return;
    }
    if (!phoneNumber.trim()) {
      toast.error('Telefon raqamingizni kiriting');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount: grandTotal,
        shippingAddress: shippingAddress.trim(),
        paymentMethod: paymentMethod
      };

      const res = await orderService.createOrder(orderData);
      
      toast.success(res?.message || 'Buyurtmangiz muvaffaqiyatli qabul qilindi!');
      clearCart();
      navigate('/orders');
    } catch (err) {
      console.error('Order creation error', err);
      toast.error(err?.response?.data?.message || 'Buyurtma berishda xatolik yuz berdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div>
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Savatchaga qaytish
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Buyurtmani rasmiylashtirish
        </h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Delivery Details & Payment */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Shipping Form */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-600" />
              Yetkazib berish manzili
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Qabul qiluvchi ismi
                </label>
                <div className="relative">
                  <input
                    type="text"
                    disabled
                    value={user?.name || ''}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-not-allowed"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Telefon raqam *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:ring-2 focus:ring-indigo-500/40 focus:outline-none"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Aniq manzil (shahar, tuman, ko‘cha, uy raqami) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Masalan: Toshkent shahar, Yunusobod tumani, 4-mavze, 24-uy"
                  className="w-full p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:ring-2 focus:ring-indigo-500/40 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              To‘lov usulini tanlang
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'Payme', label: 'Payme orqali', desc: 'Tezkor onlayn to‘lov' },
                { id: 'Click', label: 'Click orqali', desc: 'Tezkor onlayn to‘lov' },
                { id: 'Naqd pul', label: 'Naqd yetkazilganda', desc: 'Kuryerga to‘lash' }
              ].map((method) => (
                <div
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    paymentMethod === method.id
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{method.label}</span>
                    {paymentMethod === method.id && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 fill-indigo-600 text-white" />
                    )}
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{method.desc}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Order Summary on Checkout */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              Buyurtmadagi mahsulotlar ({cartItems.length})
            </h3>

            {/* Compact items list */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-contain bg-slate-100 dark:bg-slate-800 p-1"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {item.quantity} dona x {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Mahsulotlar:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Yetkazib berish:</span>
                <span className="font-semibold text-emerald-600">
                  {shippingCost === 0 ? 'Bepul' : formatPrice(shippingCost)}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline">
              <span className="text-base font-bold text-slate-900 dark:text-white">To‘lov summasi:</span>
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {formatPrice(grandTotal)}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-98 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Buyurtma rasmiylashtirilmoqda...
                </>
              ) : (
                'Buyurtmani tasdiqlash'
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Ma’lumotlaringiz xavfsiz himoyalangan</span>
            </div>
          </div>
        </div>

      </form>

    </div>
  );
};

export default CheckoutPage;

