import api from './api';

export const orderService = {
  async getOrders() {
    const response = await api.get('/orders');
    return response.data;
  },

  async createOrder(orderData) {
    const response = await api.post('/orders', orderData);
    return response.data;
  }
};

