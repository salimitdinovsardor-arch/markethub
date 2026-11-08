import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Calendar, 
  CreditCard, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { formatPrice, formatDate } from '../utils/constants';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.getOrders();
        setOrders(res?.orders || []);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Buyurtmalaringiz yuklanmoqda..." />;
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={Package}
          title="Sizda hali buyurtmalar yo‘q"
          description="Do‘konimizdagi minglab ajoyib mahsulotlar orasidan o‘zingizga yoqqanini tanlang va birinchi buyurtmangizni bering!"
          actionText="Katalogni ko‘rish"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Mening buyurtmalarim
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Barcha buyurtmalaringiz holati va tarixi
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const isDelivered = order.status === 'Yetkazildi';

          return (
            <div
              key={order.id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden"
            >
              {/* Order Header */}
              <div className="p-5 sm:px-6 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm">
                  <div>
                    <span className="text-slate-400 block text-[11px] font-semibold uppercase">Buyurtma ID</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{order.id}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-semibold uppercase">Sana</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{formatDate(order.date)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-semibold uppercase">Umumiy summa</span>
                    <span className="font-black text-indigo-600 dark:text-indigo-400">{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm"
                     style={{
                       backgroundColor: isDelivered ? '#ecfdf5' : '#eff6ff',
                       color: isDelivered ? '#059669' : '#2563eb'
                     }}
                >
                  {isDelivered ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  <span>{order.status}</span>
                </div>
              </div>

              {/* Order Body: Items */}
              <div className="p-5 sm:p-6 space-y-4">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-contain bg-slate-50 dark:bg-slate-800/60 p-1 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/products/${item.id}`}
                          className="font-bold text-sm text-slate-900 dark:text-white hover:text-indigo-600 truncate block"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {item.quantity} dona x {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping & Payment Meta */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="truncate">Manzil: {order.shippingAddress}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:justify-end">
                    <CreditCard className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>To‘lov usuli: {order.paymentMethod}</span>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default MyOrdersPage;

