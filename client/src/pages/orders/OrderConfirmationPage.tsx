// src/pages/OrderConfirmationPage.tsx
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import type { Order } from '../../types';

const OrderConfirmationPage: React.FC = () => {
    const location = useLocation();
    const { orderId, orderDetails } = location.state as { orderId: string; orderDetails: Order };

    if (!orderId || !orderDetails) {
        return (
            <div className="container mx-auto p-6 h-[calc(100vh-160px)] flex justify-center items-center">
                <div className="text-center bg-white p-8 rounded-lg shadow-md border border-gray-200">
                    <h1 className="text-3xl font-bold text-red-600 mb-4">Order Details Not Found</h1>
                    <p className="text-lg text-gray-700 mb-6">
                        It seems like you landed on this page without a valid order.
                    </p>
                    <Link to="/menu">
                        <Button variant="primary">Go to Menu</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 min-h-screen flex justify-center items-center">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full text-center border border-gray-200">
                <div className="text-green-500 text-6xl mb-6">
                    <i className="fas fa-check-circle"></i> {/* Requires FontAwesome */}
                </div>
                <h1 className="text-4xl font-extrabold text-red-700 mb-4 font-display">
                    Order Confirmed!
                </h1>
                <p className="text-xl text-gray-700 mb-6">
                    Thank you for your purchase. Your order has been placed successfully.
                </p>
                <p className="text-lg text-gray-800 font-semibold mb-2">
                    Your Order ID: <span className="text-red-600">{orderId}</span>
                </p>
                <p className="text-lg text-gray-800 font-semibold mb-2">
                    Total Amount: <span className="text-red-600">${orderDetails.totalAmount.toFixed(2)}</span>
                </p>
                <p className="text-md text-gray-600 mb-8">
                    You will receive an email confirmation shortly with details of your order.
                </p>

                <div className="mt-8 flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
                    <Link to="/menu">
                        <Button variant="primary" size="lg">
                            Continue Shopping
                        </Button>
                    </Link>
                    {/* In a real app, you might have an "Order Tracking" page */}
                    <Link to="/orders">
                        <Button variant="outline" size="lg" className="border-gray-500 text-gray-500 hover:bg-gray-50">
                            Track My Order (Coming Soon)
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;