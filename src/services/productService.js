import api from './api';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../utils/mockData';

export const productService = {
  async getProducts(params = {}) {
    try {
      const response = await api.get('/products', { params });
      if (response?.data?.products?.length) {
        return response.data;
      }
      throw new Error('Empty backend list');
    } catch (err) {
      // Backend yoqilmagan yoki xatolik bo'lsa, o'rnatilgan mahsulotlar bazasidan beriladi
      console.warn('Backend API ishlamadi, lokal mahsulotlar ishlatilmoqda:', err.message);

      const { search = '', category = 'all', sort = 'default' } = params;
      let filtered = [...INITIAL_PRODUCTS];

      if (category && category !== 'all') {
        filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
      }

      if (search && search.trim()) {
        const q = search.toLowerCase().trim();
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      }

      if (sort === 'price_asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sort === 'price_desc') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sort === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      }

      return {
        products: filtered,
        total: filtered.length
      };
    }
  },

  async getProductById(id) {
    try {
      const response = await api.get(`/products/${id}`);
      if (response?.data?.product) {
        return response.data;
      }
      throw new Error('Not found in backend');
    } catch (err) {
      const product = INITIAL_PRODUCTS.find(p => p.id === id);
      return { product };
    }
  },

  async getCategories() {
    try {
      const response = await api.get('/categories');
      if (response?.data?.categories?.length) {
        return response.data;
      }
      throw new Error('No categories');
    } catch (err) {
      return { categories: INITIAL_CATEGORIES };
    }
  }
};
