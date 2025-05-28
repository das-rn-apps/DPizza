// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import PizzaDetailPage from './pages/PizzaDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import OrderConfirmationPage from './pages/orders/OrderConfirmationPage';
import OrderTrackingDetailPage from './pages/orders/OrderTrackingDetailPage';
import OrdersPage from './pages/orders/OrderPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-amber-200">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/pizza/:id" element={<PizzaDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/order-tracking/:id" element={<OrderTrackingDetailPage />} />
            {/* Add a 404 page later */}
            <Route
              path="*"
              element={
                <div className="flex items-center justify-center h-[calc(100vh-160px)]">
                  <h1 className="text-4xl text-gray-700 font-bold">404 - Page Not Found</h1>
                </div>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
