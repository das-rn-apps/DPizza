// src/pages/CheckoutPage.tsx
import React, { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { OrderSummary } from '../components/pizza/OrderSummary';
import { Input } from '../components/ui/Input';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../api/fakeApi';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const CheckoutPage: React.FC = () => {
    const { items, clearCart } = useCartStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const [shippingDetails, setShippingDetails] = useState({
        name: user?.name || '',
        email: user?.email || '',
        address: '',
        city: '',
        zip: '',
        phone: '',
    });
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isLoading, setIsLoading] = useState(false);
    const [checkoutError, setCheckoutError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingDetails((prev) => ({ ...prev, [name]: value }));
    };
    const handleOrderPlacement = async () => {
        if (items.length === 0) {
            setCheckoutError('Your cart is empty. Please add items before checking out.');
            return;
        }

        for (const key in shippingDetails) {
            if ((shippingDetails as any)[key] === '') {
                setCheckoutError('Please fill in all shipping details.');
                return;
            }
        }

        setIsLoading(true);
        setCheckoutError(null);

        try {
            const order = await placeOrder(items, user?.id || null);
            clearCart();
            navigate('/order-confirmation', { state: { orderId: order.id, orderDetails: order } });
        } catch (error: any) {
            setCheckoutError(error.message || 'Failed to place order. Please try again.');
            console.error('Checkout error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleOrderPlacement();
    };

    if (items.length === 0 && !isLoading) {
        return (
            <div className="container mx-auto p-6 min-h-[calc(100vh-160px)] flex justify-center items-center">
                <EmptyState
                    title="No Items to Checkout"
                    message="Your cart is empty. Please add items to your cart to proceed with checkout."
                    buttonText="Go to Menu"
                    buttonLink="/menu"
                    icon="🛒"
                />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-extrabold text-center text-red-700 mb-8 font-display">
                Checkout
            </h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Shipping Details */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
                        Shipping Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">
                                Full Name
                            </label>
                            <Input
                                type="text"
                                id="name"
                                name="name"
                                value={shippingDetails.name}
                                onChange={handleInputChange}
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
                                Email Address
                            </label>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                value={shippingDetails.email}
                                onChange={handleInputChange}
                                placeholder="john.doe@example.com"
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="address" className="block text-gray-700 text-sm font-semibold mb-2">
                                Street Address
                            </label>
                            <Input
                                type="text"
                                id="address"
                                name="address"
                                value={shippingDetails.address}
                                onChange={handleInputChange}
                                placeholder="123 Pizza Street"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="city" className="block text-gray-700 text-sm font-semibold mb-2">
                                City
                            </label>
                            <Input
                                type="text"
                                id="city"
                                name="city"
                                value={shippingDetails.city}
                                onChange={handleInputChange}
                                placeholder="Pizza Town"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="zip" className="block text-gray-700 text-sm font-semibold mb-2">
                                Zip Code
                            </label>
                            <Input
                                type="text"
                                id="zip"
                                name="zip"
                                value={shippingDetails.zip}
                                onChange={handleInputChange}
                                placeholder="12345"
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="phone" className="block text-gray-700 text-sm font-semibold mb-2">
                                Phone Number
                            </label>
                            <Input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={shippingDetails.phone}
                                onChange={handleInputChange}
                                placeholder="+1 (555) 123-4567"
                                required
                            />
                        </div>
                    </div>

                    {/* Payment Method */}
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 mt-10 border-b pb-4">
                        Payment Method
                    </h2>
                    <div className="space-y-4">
                        <label className="flex items-center text-lg text-gray-700 cursor-pointer">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="card"
                                checked={paymentMethod === 'card'}
                                onChange={() => setPaymentMethod('card')}
                                className="form-radio h-5 w-5 text-red-600"
                            />
                            <span className="ml-3">Credit Card</span>
                        </label>
                        <label className="flex items-center text-lg text-gray-700 cursor-pointer">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="cash"
                                checked={paymentMethod === 'cash'}
                                onChange={() => setPaymentMethod('cash')}
                                className="form-radio h-5 w-5 text-red-600"
                            />
                            <span className="ml-3">Cash on Delivery</span>
                        </label>
                    </div>
                    {paymentMethod === 'card' && (
                        <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
                            <p className="text-gray-600 text-sm italic">
                                (Credit card integration would go here in a real application)
                            </p>
                            {/* Placeholder for card details */}
                            <div className="mb-4">
                                <label htmlFor="cardNumber" className="block text-gray-700 text-sm font-semibold mb-2 mt-2">
                                    Card Number
                                </label>
                                <Input type="text" id="cardNumber" placeholder="**** **** **** ****" disabled />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="expiryDate" className="block text-gray-700 text-sm font-semibold mb-2">
                                        Expiry Date
                                    </label>
                                    <Input type="text" id="expiryDate" placeholder="MM/YY" disabled />
                                </div>
                                <div>
                                    <label htmlFor="cvv" className="block text-gray-700 text-sm font-semibold mb-2">
                                        CVV
                                    </label>
                                    <Input type="text" id="cvv" placeholder="123" disabled />
                                </div>
                            </div>
                        </div>
                    )}
                    {checkoutError && (
                        <p className="text-red-500 mt-4 text-center text-lg">{checkoutError}</p>
                    )}
                </div>

                {/* Order Summary on the side */}
                <div className="lg:col-span-1">
                    <OrderSummary onCheckoutClick={handleOrderPlacement} buttonText={isLoading ? "Placing Order..." : "Place Order"} />
                    {isLoading && <LoadingSpinner />}
                </div>
            </form>
        </div>
    );
};

export default CheckoutPage;