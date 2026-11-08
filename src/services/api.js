import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

// Axios instansiyasi
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Xavfsiz cookie (httpOnly refresh token) ni yuborish uchun shart
  headers: {
    'Content-Type': 'application/json'
  }
});

// So'rovlar navbati (bir vaqtda bir nechta 401 bo'lganda token bir marta yangilanadi)
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 1. REQUEST INTERCEPTOR: Har bir so'rovga Access Tokenni qo'shish
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. RESPONSE INTERCEPTOR: 401 Unauthorized kelganda Refresh Token orqali yangilash
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Agar serverdan javob kelmasa (tarmoq xatosi)
    if (!error.response) {
      return Promise.reject(error);
    }

    // Login, Register yoki Refresh so'rovlarining o'zida 401 bo'lsa zanjirga kirmaydi
    const isAuthEndpoint = originalRequest.url.includes('/auth/login') ||
                           originalRequest.url.includes('/auth/register') ||
                           originalRequest.url.includes('/auth/refresh');

    // 401 kelgan va bu so'rov hali qayta yuborilmagan bo'lsa
    if (error.response.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // Hozirda refresh ketayotgan bo'lsa, bu so'rovni navbatga qo'yamiz
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Fallback sifatida localStorage dagi refresh tokenni ham yuboramiz (agar cookie cheklangan bo'lsa)
        const fallbackRefreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken: fallbackRefreshToken },
          { withCredentials: true }
        );

        const { accessToken } = response.data;
        if (!accessToken) {
          throw new Error('Yangi access token olinmadi');
        }

        // Yangi access tokenni saqlash
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Navbatdagi barcha kutib turgan so'rovlarni yangi token bilan yechish
        processQueue(null, accessToken);

        // Asl so'rovni yangi token bilan qayta yuborish
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token ham eskirgan bo'lsa yoki bekor qilingan bo'lsa
        processQueue(refreshError, null);
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);

        // Agar foydalanuvchi login bo'lmagan bo'lsa va refresh o'tmasa, xabardor qilamiz
        window.dispatchEvent(new Event('auth:unauthorized'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

