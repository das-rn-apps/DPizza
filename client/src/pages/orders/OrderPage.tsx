// src/pages/OrdersPage.tsx
import React, { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useOrderStore } from '../../store/orderStore';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { formatCurrency } from '../../utils/helpers'; // Assuming you have this helper

const OrdersPage: React.FC = () => {
    const { user, isAuthenticated, loading: authLoading } = useAuthStore();
    const { userOrders, loadingOrders, errorOrders, fetchUserOrders, clearUserOrders } = useOrderStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login'); // Redirect to login if not authenticated
        } else if (user?.id) {
            fetchUserOrders(user.id);
        }

        // Clear orders when component unmounts or user logs out
        return () => {
            clearUserOrders();
        };
    }, [isAuthenticated, user?.id, authLoading, fetchUserOrders, navigate, clearUserOrders]);

    if (authLoading || (!isAuthenticated && !authLoading)) {
        return (
            <div className="container mx-auto p-6 h-[calc(100vh-160px)] flex justify-center items-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (errorOrders) {
        return (
            <div className="container mx-auto p-6 h-[calc(100vh-160px)] flex justify-center items-center">
                <EmptyState
                    title="Error Loading Orders"
                    message={errorOrders}
                    buttonText="Retry"
                    buttonLink="#" // Maybe implement a refresh button or retry logic
                    icon="⚠️"
                />
            </div>
        );
    }

    if (userOrders.length === 0 && !loadingOrders) {
        return (
            <div className="container mx-auto p-6 min-h-[calc(100vh-160px)] flex justify-center items-center">
                <EmptyState
                    title="No Orders Yet"
                    message="It looks like you haven't placed any orders with us."
                    buttonText="Start Ordering Now!"
                    buttonLink="/menu"
                    icon="📦"
                />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-extrabold text-center text-red-700 mb-8 font-display">
                Your Orders
            </h1>

            {loadingOrders ? (
                <LoadingSpinner />
            ) : (
                <div className="space-y-6">
                    {userOrders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
                        >
                            <div className="flex justify-between items-start mb-4 border-b pb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Order #{order.id.slice(-6).toUpperCase()}</h2>
                                    <p className="text-sm text-gray-500">
                                        Placed on: {new Date(order.orderDate).toLocaleDateString()} at {new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-semibold
                    ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : ''}
                    ${order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : ''}
                    ${order.status === 'Pending' || order.status === 'Preparing' || order.status === 'Out for Delivery' ? 'bg-yellow-100 text-yellow-800' : ''}
                  `}
                                >
                                    {order.status}
                                </span>
                            </div>

                            <div className="space-y-3">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded-md"
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-700">{item.name} ({item.selectedSize})</p>
                                            <p className="text-sm text-gray-500">
                                                {item.quantity} x {formatCurrency(item.price)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 mt-4 flex justify-between items-center">
                                <span className="text-xl font-bold text-red-700">
                                    Total: {formatCurrency(order.totalAmount)}
                                </span>
                                <Link to={`/order-tracking/${order.id}`}>
                                    <Button variant="outline" size="sm" className="border-red-600 text-red-600 hover:bg-red-50">
                                        View Details
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;