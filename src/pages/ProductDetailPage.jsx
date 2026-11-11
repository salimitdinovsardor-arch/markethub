import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  ShoppingCart, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Check, 
  Plus, 
  Minus, 
  Sparkles, 
  Heart, 
  MessageSquare, 
  Send 
} from 'lucide-react';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/constants';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from '../components/ProductCard';
import { INITIAL_PRODUCTS } from '../utils/mockData';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: 'Bobur Mirzayev',
      rating: 5,
      date: '3 kun oldin',
      comment: 'Juda ajoyib mahsulot! Sifatiga gap yo‘q, qadoqlanishi ham mukammal darajada bo‘ldi.'
    },
    {
      id: 2,
      name: 'Zilola Rahimova',
      rating: 5,
      date: '1 hafta oldin',
      comment: 'Yetkazib berish juda tez amalga oshirildi. Tavsifiga to‘liq mos keladi, tavsiya qilaman!'
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

  useEffect(() => {
    let isMounted = true;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await productService.getProductById(id);
        if (isMounted && res?.product) {
          setProduct(res.product);
        }
      } catch (err) {
        console.error('Failed to load product details', err);
        if (isMounted) {
          toast.error('Mahsulot ma’lumotlarini yuklashda xatolik');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const isFavorite = product ? isInWishlist(product.id) : false;

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setIsAdded(true);
    toast.success(`${quantity} dona "${product.name.slice(0, 20)}..." savatchaga qo‘shildi!`);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const reviewObj = {
      id: Date.now(),
      name: user?.name || 'Xaridor',
      rating: newRating,
      date: 'Hozirgina',
      comment: newComment.trim()
    };

    setReviews([reviewObj, ...reviews]);
    setNewComment('');
    toast.success('Sharhingiz uchun tashakkur!');
  };

  if (loading) {
    return <LoadingSpinner text="Mahsulot ma’lumotlari olinmoqda..." />;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Mahsulot topilmadi</h2>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-indigo-600 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Mahsulotlar katalogiga qaytish
        </Link>
      </div>
    );
  }

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const relatedProducts = INITIAL_PRODUCTS.filter(
    p => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb / Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Orqaga qaytish
        </button>
      </div>

      {/* Main product view */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        
        {/* Left: Image Container */}
        <div className="relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-10 flex items-center justify-center overflow-hidden shadow-sm">
          {discountPercent && (
            <span className="absolute top-6 left-6 px-3 py-1.5 text-sm font-extrabold text-white bg-rose-500 rounded-xl shadow-md">
              -{discountPercent}% Chegirma
            </span>
          )}

          <button
            onClick={() => {
              toggleWishlist(product);
              if (!isFavorite) {
                toast.success('Sevimlilarga qo‘shildi!');
              } else {
                toast.info('Sevimlilardan olib tashlandi');
              }
            }}
            className={`absolute top-6 right-6 p-3 rounded-full backdrop-blur-md shadow-md transition-all active:scale-75 ${
              isFavorite ? 'bg-rose-50 text-rose-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
          </button>

          <img
            src={product.image}
            alt={product.name}
            className="w-full max-h-[480px] object-contain rounded-2xl hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Right: Info and Actions */}
        <div className="flex flex-col space-y-6">
          
          {/* Category & Badge */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 rounded-lg">
              {product.category}
            </span>
            {product.isFeatured && (
              <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 rounded-lg">
                <Sparkles className="w-3 h-3" /> Tavsiya etiladi
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {product.name}
          </h1>

          {/* Rating & Stock */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-lg text-amber-700 dark:text-amber-400 font-bold">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{product.rating}</span>
            </div>
            <span className="text-slate-500 dark:text-slate-400">
              ({reviews.length} sharh)
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              Omborda mavjud ({product.stock} dona)
            </span>
          </div>

          {/* Price block */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 flex items-baseline gap-4">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-slate-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {product.description}
          </p>

          {/* Features bullet points */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Asosiy afzalliklari:
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700 dark:text-slate-300">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity selector & Actions */}
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Miqdori:
              </span>
              <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-bold text-slate-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(prev => Math.min(product.stock || 99, prev + 1))}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
                  isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5" /> Qo‘shildi!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" /> Savatchaga qo‘shish
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3.5 px-6 rounded-xl font-bold text-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-md transition-all active:scale-95"
              >
                Darhol xarid qilish
              </button>
            </div>
          </div>

          {/* Value props */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40">
              <Truck className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">Tezkor yetkazish</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">1 yil kafolat</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40">
              <RefreshCw className="w-5 h-5 text-amber-600 mx-auto mb-1" />
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">14 kun qaytarish</span>
            </div>
          </div>

        </div>

      </div>

      {/* Customer Reviews Section */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-8">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-indigo-600" /> Mijozlar sharhlari ({reviews.length})
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Ushbu mahsulot haqida xaridorlarning haqiqiy fikrlari
          </p>
        </div>

        {/* Add Review Form */}
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            O‘z fikringizni qoldiring
          </h3>
          <form onSubmit={handleAddReview} className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Baholash:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setNewRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={3}
              required
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Mahsulot haqida taassurotingizni yozing..."
              className="w-full p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-indigo-500/40 focus:outline-none"
            />

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-colors"
            >
              <Send className="w-3.5 h-3.5" /> Sharhni yuborish
            </button>
          </form>
        </div>

        {/* Existing Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 font-bold flex items-center justify-center text-xs">
                    {rev.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{rev.name}</h4>
                    <span className="text-[11px] text-slate-400">{rev.date}</span>
                  </div>
                </div>

                <div className="flex items-center text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {rev.comment}
              </p>
            </div>
          ))}
        </div>

      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="pt-10 border-t border-slate-200 dark:border-slate-800 space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              O‘xshash mahsulotlar
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Ushbu toifadagi boshqa mashhur mahsulotlar
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relProd) => (
              <ProductCard key={relProd.id} product={relProd} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetailPage;
