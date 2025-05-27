import React, { useEffect, useState } from 'react';
import { usePizzaStore } from '../store/pizzaStore';
import { useCartStore } from '../store/cartStore';
import { Input } from '../components/ui/Input';
import { PizzaCard } from '../components/pizza/PizzaCard';
import type { Pizza } from '../types';

const MenuPage: React.FC = () => {
    const { pizzas, error, fetchPizzas } = usePizzaStore();
    const addItemToCart = useCartStore((state) => state.addItem);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPizzas, setFilteredPizzas] = useState<Pizza[]>([]);

    useEffect(() => {
        if (!pizzas?.length) {
            fetchPizzas();
        }
    }, [fetchPizzas, pizzas]);

    useEffect(() => {
        const term = searchTerm.trim().toLowerCase();
        if (term.length === 0) {
            setFilteredPizzas(pizzas ?? []);
        } else {
            const filtered = (pizzas ?? []).filter((pizza) =>
                pizza.name.toLowerCase().includes(term)
            );
            setFilteredPizzas(filtered);
        }
    }, [searchTerm, pizzas]);

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
        <div className="container mx-auto p-6 min-h-screen">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 mb-10 px-4">
                <h1 className="text-3xl md:text-5xl font-bold text-red-600 font-display text-center md:text-left tracking-tight drop-shadow-sm">
                    Our Delicious Menu
                </h1>

                <div className="w-full max-w-md relative">
                    <Input
                        type="text"
                        placeholder="Search for pizzas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-red-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
                    />
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-400 text-xl pointer-events-none">
                        🔍
                    </span>
                </div>
            </div>

            {/* Loading */}
            {!pizzas && (
                <p className="text-center text-lg text-gray-700">Loading pizzas...</p>
            )}

            {/* Error */}
            {pizzas && error && (
                <p className="text-red-500 text-center text-lg">{error}</p>
            )}

            {/* No match */}
            {pizzas && !error && filteredPizzas.length === 0 && (
                <p className="text-gray-600 text-center text-lg">No pizzas found. Try a different search!</p>
            )}

            {/* Pizzas Grid */}
            {pizzas && filteredPizzas.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredPizzas.map((pizza) => (
                        <PizzaCard key={pizza.id} pizza={pizza} onAddToCart={handleAddToCart} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MenuPage;
