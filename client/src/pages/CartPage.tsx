import React from 'react';
import { useCartStore } from '../store/cartStore';
import { CartItem as TCartItem } from '../components/pizza/CartItem';
import { OrderSummary } from '../components/pizza/OrderSummary';
import { EmptyState } from '../components/common/EmptyState';
import { useNavigate } from 'react-router-dom';

const CartPage: React.FC = () => {
    const items = useCartStore(state => state.items);
    const removeItem = useCartStore(state => state.removeItem);
    const updateItemQuantity = useCartStore(state => state.updateItemQuantity);
    const clearCart = useCartStore(state => state.clearCart);
    const totalItems = useCartStore(state => state.totalItems);

    const navigate = useNavigate();

    const handleCheckout = () => {
        if (totalItems > 0) {
            navigate('/checkout');
        } else {
            alert('Your cart is empty!');
        }
    };

    if (items.length === 0) {
        return (
            <div className="container mx-auto p-6 min-h-[calc(100vh-160px)] flex justify-center items-center">
                <EmptyState
                    title="Your Cart is Empty"
                    message="Looks like you haven't added any pizzas yet. Start building your perfect order!"
                    buttonText="Explore Our Menu"
                    buttonLink="/menu"
                    icon="🛒"
                />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <h1 className="text-4xl font-extrabold text-center text-red-700 mb-8 font-display">
                Your Shopping Cart
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items List */}
                <div className="lg:col-span-2">
                    {items.map((item) => (
                        <TCartItem
                            key={item.id}
                            item={item}
                            onRemove={removeItem}
                            onUpdateQuantity={updateItemQuantity}
                        />
                    ))}
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={clearCart}
                            className="text-red-600 hover:text-red-800 font-semibold transition-colors flex items-center space-x-2"
                        >
                            <i className="fas fa-undo-alt"></i>
                            <span>Clear Cart</span>
                        </button>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <OrderSummary onCheckoutClick={handleCheckout} />
                </div>
            </div>
        </div>
    );
};

export default CartPage;
