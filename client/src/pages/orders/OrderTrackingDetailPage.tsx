// src/pages/OrderTrackingDetailPage.tsx
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useOrderStore } from '../../store/orderStore';
import { useAuthStore } from '../../store/authStore';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/ui/Button';
import { formatCurrency } from '../../utils/helpers';

const OrderTrackingDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Order ID from URL
    const { user, isAuthenticated, loading: authLoading } = useAuthStore();
    const { currentOrder, loadingCurrentOrder, errorCurrentOrder, fetchOrderDetails, clearCurrentOrder } = useOrderStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login'); // Redirect to login if not authenticated
            return;
        }

        if (id && user?.id) {
            fetchOrderDetails(id, user.id);
        } else if (id && !user?.id && !authLoading) {
            // Potentially allow guest tracking with just order ID and email if you implement it
            // For now, redirect if no user ID for security/simplicity
            navigate('/login?redirect=/order-tracking/' + id); // Suggest login to view order
        }

        return () => {
            clearCurrentOrder(); // Clear order details when leaving page
        };
    }, [id, user?.id, isAuthenticated, authLoading, fetchOrderDetails, clearCurrentOrder, navigate]);

    if (loadingCurrentOrder || authLoading) {
        return (
            <div className="container mx-auto p-6 h-[calc(100vh-160px)] flex justify-center items-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (errorCurrentOrder) {
        return (
            <div className="container mx-auto p-6 h-[calc(100vh-160px)] flex justify-center items-center">
                <EmptyState
                    title="Order Not Found"
                    message={errorCurrentOrder}
                    buttonText="Back to Orders"
                    buttonLink="/orders"
                    icon="😔"
                />
            </div>
        );
    }

    if (!currentOrder) {
        // This case should ideally be covered by errorCurrentOrder, but as a fallback
        return (
            <div className="container mx-auto p-6 h-[calc(100vh-160px)] flex justify-center items-center">
                <EmptyState
                    title="Order Not Found"
                    message="Could not retrieve order details. Please check the order ID."
                    buttonText="Back to Orders"
                    buttonLink="/orders"
                    icon="🔍"
                />
            </div>
        );
    }

    // Define tracking steps and their order
    const orderSteps = [
        'Pending',
        'Confirmed',
        'Preparing',
        'Out for Delivery',
        'Delivered',
    ];
    const currentStepIndex = orderSteps.indexOf(currentOrder.status);

    return (
        <div className="container mx-auto p-2 min-h-screen">
            <h1 className="text-4xl font-extrabold text-center text-red-700 mb-8 font-display">
                Order Tracking: <span className="text-gray-800">#{currentOrder.id.slice(-6).toUpperCase()}</span>
            </h1>

            {/* Order Status Timeline */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Current Status: {currentOrder.status}</h2>
                <div className="relative flex justify-between items-center mb-6">
                    <div className="absolute left-0 right-0 h-1 bg-gray-200 top-1/2 -translate-y-1/2"></div>
                    {orderSteps.map((step, index) => (
                        <div
                            key={step}
                            className={`relative z-10 flex flex-col items-center
                ${index <= currentStepIndex ? 'text-red-600' : 'text-gray-400'}
              `}
                        >
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white
                  ${index <= currentStepIndex ? 'bg-red-600' : 'bg-gray-300'}
                `}
                            >
                                {index + 1}
                            </div>
                            <span className="text-sm mt-2 text-center whitespace-nowrap">
                                {step === 'Out for Delivery' ? 'Out for Del.' : step}
                            </span>
                        </div>
                    ))}
                </div>

                {currentOrder.status === 'Delivered' && (
                    <p className="text-center text-green-600 font-semibold text-lg mt-4">
                        Your order has been successfully delivered! Enjoy your meal!
                    </p>
                )}
                {currentOrder.status === 'Cancelled' && (
                    <p className="text-center text-red-600 font-semibold text-lg mt-4">
                        This order has been cancelled. Please contact support if you have questions.
                    </p>
                )}
                {currentOrder.status === 'Out for Delivery' && (
                    <p className="text-center text-yellow-600 font-semibold text-lg mt-4">
                        Your delicious pizza is on its way! Estimated delivery soon.
                    </p>
                )}
            </div>

            {/* Order Details */}
            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Order Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-gray-700">
                    <div>
                        <p><span className="font-semibold">Order ID:</span> {currentOrder.id}</p>
                        <p><span className="font-semibold">Order Date:</span> {new Date(currentOrder.orderDate).toLocaleString()}</p>
                        <p><span className="font-semibold">Total Amount:</span> {formatCurrency(currentOrder.totalAmount)}</p>
                    </div>
                    <div>
                        <p><span className="font-semibold">Customer:</span> {user?.name || 'Guest'}</p>
                        <p><span className="font-semibold">Email:</span> {user?.email || 'N/A'}</p>
                        {/* Add shipping address details if they were stored in the order object */}
                        {/* <p><span className="font-semibold">Delivery Address:</span> {currentOrder.deliveryAddress}</p> */}
                    </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-4 mt-8 border-b pb-3">Items Ordered</h3>
                <div className="space-y-4">
                    {currentOrder.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-md"
                            />
                            <div>
                                <p className="font-semibold text-gray-700">{item.name} ({item.selectedSize})</p>
                                <p className="text-sm text-gray-500">
                                    {item.quantity} x {formatCurrency(item.price)}
                                </p>
                                <p className="text-md font-bold text-gray-800">
                                    Subtotal: {formatCurrency(item.quantity * item.price)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <Link to="/orders">
                        <Button variant="outline" size="lg" className="border-red-600 text-red-600 hover:bg-red-50">
                            Back to My Orders
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderTrackingDetailPage;