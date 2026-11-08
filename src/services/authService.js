import api from './api';

export const authService = {
  async register(data) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async refreshToken(fallbackToken) {
    const response = await api.post('/auth/refresh', { refreshToken: fallbackToken });
    return response.data;
  },

  async logout(fallbackToken) {
    try {
      const response = await api.post('/auth/logout', { refreshToken: fallbackToken });
      return response.data;
    } catch (e) {
      console.warn('Logout API call failed or already cleared', e);
      return { success: true };
    }
  },

  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  }
};

