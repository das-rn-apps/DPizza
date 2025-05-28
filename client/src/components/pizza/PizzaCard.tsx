import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import type { Pizza } from '../../types';
import { truncate } from '../../utils/helpers';

interface PizzaCardProps {
    pizza: Pizza;
    onAddToCart: (pizza: Pizza, selectedSize: string) => void;
}

export const PizzaCard: React.FC<PizzaCardProps> = ({ pizza, onAddToCart }) => {
    const [selectedSize, setSelectedSize] = useState<string>(pizza.sizes[0] || 'Medium');

    const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSize(event.target.value);
    };

    const handleAddClick = () => {
        onAddToCart(pizza, selectedSize);
    };

    return (
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden">
            <Link to={`/pizza/${pizza.id}`}>
                <img
                    src={pizza.image}
                    alt={pizza.name}
                    className="w-full h-40 object-cover transition-transform duration-300 hover:scale-105"
                />
            </Link>
            <div className="p-4 space-y-2">
                <Link to={`/pizza/${pizza.id}`}>
                    <h3 className="text-lg font-semibold text-gray-800 hover:text-red-600 transition-colors truncate">
                        {pizza.name}
                    </h3>
                </Link>
                <p className="text-sm text-gray-500">{truncate(pizza.description, 36)}</p>


                <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-red-600">${pizza.price.toFixed(2)}</span>
                    <select
                        value={selectedSize}
                        onChange={handleSizeChange}
                        className="text-sm rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-red-500"
                    >
                        {pizza.sizes.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>

                <Button
                    onClick={handleAddClick}
                    className="w-full bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 rounded-md mt-2 transition"
                >
                    Add to Cart
                </Button>
            </div>
        </div>
    );
};
