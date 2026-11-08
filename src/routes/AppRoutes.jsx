import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import HomePage from '../pages/HomePage';
import ProductsPage from '../pages/ProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import CategoriesPage from '../pages/CategoriesPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import MyOrdersPage from '../pages/MyOrdersPage';
import ProfilePage from '../pages/ProfilePage';
import WishlistPage from '../pages/WishlistPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import NotFoundPage from '../pages/NotFoundPage';

// Protected Route Guard
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes (Faqat tizimga kirgan foydalanuvchilar uchun) */}
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <MyOrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* 404 Not Found Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
