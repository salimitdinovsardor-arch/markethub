import React, { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Har safar sahifa o'zgarganda sahifaning eng tepasiga ko'tarish
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <BrowserRouter>
                <ScrollToTop />
                <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
                  <Navbar />
                  <main className="flex-1">
                    <AppRoutes />
                  </main>
                  <Footer />
                </div>
              </BrowserRouter>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
