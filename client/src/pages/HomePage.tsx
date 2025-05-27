// src/pages/HomePage.tsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { usePizzaStore } from '../store/pizzaStore';
import { PizzaCard } from '../components/pizza/PizzaCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useCartStore } from '../store/cartStore';
import type { Pizza } from '../api/types';

const HomePage: React.FC = () => {
    const { pizzas, loading, error, fetchPizzas } = usePizzaStore();
    const addItemToCart = useCartStore((state) => state.addItem);

    useEffect(() => {
        if (!pizzas || pizzas.length === 0) {
            fetchPizzas(); // Fetch only if pizzas array is empty or undefined
        }
    }, [fetchPizzas, pizzas]);


    const handleAddToCart = (pizza: Pizza, selectedSize: string) => {
        const cartItem = {
            id: `${pizza.id}-${selectedSize}-${Date.now()}`,
            pizzaId: pizza.id,
            name: pizza.name,
            image: pizza.image,
            price: pizza.price,
            quantity: 1,
            selectedSize,
        };
        addItemToCart(cartItem);
        alert(`${pizza.name} (${selectedSize}) added to cart!`);
    };

    const featuredPizzas = pizzas.slice(0, 4); // Display up to 4 featured pizzas

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-cover bg-center h-[500px] flex items-center justify-center text-white"
                style={{ backgroundImage: 'url(/images/hero-pizza.jpg)' }}> {/* Add a hero image */}
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative text-center z-10 p-4">
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-4 animate-fade-in-down font-display">
                        Taste the Tradition
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-fade-in-up">
                        Freshly baked pizzas, delivered hot and delicious to your door.
                    </p>
                    <Link to="/menu">
                        <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white shadow-xl animate-fade-in-up">
                            Order Now
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Featured Pizzas Section */}
            <section className="container mx-auto py-16 px-6">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-12 font-heading">
                    Our Best Sellers
                </h2>
                {loading && <LoadingSpinner />}
                {error && <p className="text-red-500 text-center text-lg">{error}</p>}
                {featuredPizzas.length === 0 && !loading && !error && (
                    <p className="text-gray-600 text-center text-lg">No featured pizzas available at the moment.</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredPizzas.map((pizza) => (
                        <PizzaCard key={pizza.id} pizza={pizza} onAddToCart={handleAddToCart} />
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Link to="/menu">
                        <Button variant="outline" size="lg" className="border-red-600 text-red-600 hover:bg-red-50">
                            View All Pizzas
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Call to Action Section (Optional) */}
            <section className="bg-red-700 text-white py-16 text-center">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold mb-4 font-heading">Craving Pizza?</h2>
                    <p className="text-xl mb-8">
                        Sign up for our newsletter to get exclusive deals and updates!
                    </p>
                    <div className="flex justify-center">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="p-3 rounded-l-lg outline-none text-gray-900 w-full max-w-sm"
                        />
                        <Button className="bg-red-900 hover:bg-red-800 rounded-l-none text-white px-6">
                            Subscribe
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;