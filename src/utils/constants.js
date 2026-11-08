export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'shop_access_token',
  REFRESH_TOKEN: 'shop_refresh_token',
  USER: 'shop_user',
  CART: 'shop_cart',
  THEME: 'shop_theme'
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(price);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

