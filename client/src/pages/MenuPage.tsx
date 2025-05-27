import React, { useEffect, useState } from 'react';
import { usePizzaStore } from '../store/pizzaStore';
import { useCartStore } from '../store/cartStore';
import { Input } from '../components/ui/Input';
import { PizzaCard } from '../components/pizza/PizzaCard';
import type { Pizza } from '../api/types';

const MenuPage: React.FC = () => {
    const { pizzas, error, fetchPizzas } = usePizzaStore();
    const addItemToCart = useCartStore((state) => state.addItem);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!pizzas?.length) {
            fetchPizzas();
        }
    }, [fetchPizzas, pizzas]);

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchPizzas(searchTerm);
        }, 300);

        return () => clearTimeout(handler);
    }, [searchTerm, fetchPizzas]);

    const handleAddToCart = (pizza: Pizza, selectedSize: string) => {
        const priceBySize = pizza.price;
        const cartItem = {
            id: `${pizza.id}-${selectedSize}-${Date.now()}`,
            pizzaId: pizza.id,
            name: pizza.name,
            image: pizza.image,
            price: priceBySize,
            quantity: 1,
            selectedSize,
        };
        addItemToCart(cartItem);
        alert(`${pizza.name} (${selectedSize}) added to cart!`);
    };

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <h1 className="text-2xl md:text-4xl font-extrabold text-red-700 font-display text-center md:text-left">
                    Our Delicious Menu
                </h1>

                <Input
                    type="text"
                    placeholder="Search for pizzas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-md p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
            </div>


            {/* Show loading while pizzas is undefined */}
            {pizzas === undefined && (
                <p className="text-center text-lg text-gray-700">Loading pizzas...</p>
            )}

            {/* Show error only after pizzas is loaded */}
            {pizzas !== undefined && error && (
                <p className="text-red-500 text-center text-lg">{error}</p>
            )}

            {/* Show empty state when no pizzas and no error */}
            {pizzas !== undefined && !error && pizzas.length === 0 && (
                <p className="text-gray-600 text-center text-lg">No pizzas found. Try a different search!</p>
            )}

            {/* Show pizzas if available */}
            {pizzas !== undefined && pizzas.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {pizzas.map((pizza) => (
                        <PizzaCard key={pizza.id} pizza={pizza} onAddToCart={handleAddToCart} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MenuPage;
