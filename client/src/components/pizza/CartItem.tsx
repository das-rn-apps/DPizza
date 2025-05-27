// src/components/pizza/CartItem.tsx
import React from 'react';
import type { CartItem as TCartItem } from '../../api/types'; // Renaming to avoid conflict
// Renaming to avoid conflict
import { Button } from '../ui/Button';

interface CartItemProps {
    item: TCartItem;
    onRemove: (itemId: string) => void;
    onUpdateQuantity: (itemId: string, quantity: number) => void;
}

export const CartItem: React.FC<CartItemProps> = ({ item, onRemove, onUpdateQuantity }) => {
    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = parseInt(event.target.value, 10);
        if (!isNaN(newQuantity) && newQuantity >= 1) {
            onUpdateQuantity(item.id, newQuantity);
        }
    };

    const handleDecrease = () => {
        if (item.quantity > 1) {
            onUpdateQuantity(item.id, item.quantity - 1);
        }
    };

    const handleIncrease = () => {
        onUpdateQuantity(item.id, item.quantity + 1);
    };

    return (
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-200">
            <div className="flex items-center space-x-4">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md"
                />
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-600">Size: {item.selectedSize}</p>
                    <p className="text-md text-red-600 font-bold">${item.price.toFixed(2)}</p>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-md">
                    <Button
                        onClick={handleDecrease}
                        variant="ghost"
                        size="sm"
                        className="px-2 py-1 text-gray-700 hover:bg-gray-100"
                    >
                        -
                    </Button>
                    <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={handleQuantityChange}
                        className="w-12 text-center border-x border-gray-300 py-1 text-gray-800 focus:outline-none"
                    />
                    <Button
                        onClick={handleIncrease}
                        variant="ghost"
                        size="sm"
                        className="px-2 py-1 text-gray-700 hover:bg-gray-100"
                    >
                        +
                    </Button>
                </div>
                <span className="text-lg font-bold text-gray-900 w-20 text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                </span>
                <Button
                    onClick={() => onRemove(item.id)}
                    variant="ghost"
                    className="text-red-500 hover:text-red-700 px-2 py-1"
                    aria-label={`Remove ${item.name}`}
                >
                    <i className="fas fa-trash-alt"></i> {/* Requires FontAwesome */}
                    <span className="sr-only">Remove</span>
                </Button>
            </div>
        </div>
    );
};