// src/components/pizza/PizzaCard.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // For navigation
import { Button } from '../ui/Button';
import type { Pizza } from '../../types';

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
        <div className="bg-amber-100 rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200">
            <Link to={`/pizza/${pizza.id}`} className="block">
                <img
                    src={pizza.image}
                    alt={pizza.name}
                    className="w-full h-48 object-cover object-center transform hover:scale-105 transition-transform duration-300"
                />
            </Link>
            <div className="p-6">
                <Link to={`/pizza/${pizza.id}`}>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-red-600 transition-colors">
                        {pizza.name}
                    </h3>
                </Link>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{pizza.description}</p>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-extrabold text-red-700">
                        ${pizza.price.toFixed(2)}
                    </span>
                    <div className="flex items-center space-x-2">
                        <label htmlFor={`size-${pizza.id}`} className="sr-only">Select size</label>
                        <select
                            id={`size-${pizza.id}`}
                            value={selectedSize}
                            onChange={handleSizeChange}
                            className="p-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            {pizza.sizes.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <Button
                    onClick={handleAddClick}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                    Add to Cart
                </Button>
            </div>
        </div>
    );
};