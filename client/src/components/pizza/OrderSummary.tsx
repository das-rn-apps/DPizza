// src/components/pizza/OrderSummary.tsx
import React, { useMemo } from 'react';
import { useCartStore } from '../../store/cartStore';

interface OrderSummaryProps {
    onCheckoutClick: () => void;
    buttonText?: string;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
    onCheckoutClick,
    buttonText = "Proceed to Checkout",
}) => {
    // Extracting store values using shallow comparison to prevent re-renders
    const items = useCartStore((state) => state.items);
    const totalPrice = useCartStore((state) => state.totalPrice);

    // Memoized calculations to avoid recalculations on every render
    const { subtotal, deliveryFee, tax, finalTotal } = useMemo(() => {
        const subtotal = totalPrice;
        const deliveryFee = subtotal > 0 ? 5.0 : 0.0;
        const taxRate = 0.08;
        const tax = subtotal * taxRate;
        const finalTotal = subtotal + deliveryFee + tax;

        return { subtotal, deliveryFee, tax, finalTotal };
    }, [totalPrice]);

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
                Order Summary
            </h2>

            <div className="space-y-3 text-gray-700">
                <div className="flex justify-between text-lg">
                    <span>Subtotal:</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg">
                    <span>Delivery Fee:</span>
                    <span className="font-semibold">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg">
                    <span>Tax (8%):</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-2xl font-extrabold text-red-700 pt-4 border-t border-gray-300 mt-4">
                    <span>Total:</span>
                    <span>${finalTotal.toFixed(2)}</span>
                </div>
            </div>

            <button
                type="button"
                onClick={onCheckoutClick}
                disabled={items.length === 0}
                className={`w-full mt-8 py-3 rounded-lg text-white font-bold text-xl transition-colors duration-200
        ${items.length === 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                    }`}
            >
                {buttonText}
            </button>
        </div>
    );
};
