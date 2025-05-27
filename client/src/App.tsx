// src/App.tsx
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LoadingSpinner } from './components/common/LoadingSpinner';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const MenuPage = lazy(() => import('./pages/MenuPage'));
const PizzaDetailPage = lazy(() => import('./pages/PizzaDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));

const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));

const OrderConfirmationPage = lazy(() => import('./pages/orders/OrderConfirmationPage'));
const OrderTrackingDetailPage = lazy(() => import('./pages/orders/OrderTrackingDetailPage'));
const OrdersPage = lazy(() => import('./pages/orders/OrderPage'));

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/pizza/:id" element={<PizzaDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/orders" element={<OrdersPage />} /> {/* New Route */}
              <Route path="/order-tracking/:id" element={<OrderTrackingDetailPage />} /> {/* New Route */}
              {/* Add a 404 page later */}
              <Route path="*" element={
                <div className="flex items-center justify-center h-[calc(100vh-160px)]">
                  <h1 className="text-4xl text-gray-700 font-bold">404 - Page Not Found</h1>
                </div>
              } />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;