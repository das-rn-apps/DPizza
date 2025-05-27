// src/pages/PizzaDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/ui/Button';
import { fetchPizzaById } from '../api/fakeApi'; // Import the specific fetch function
import type { Pizza } from '../api/types';

const PizzaDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [pizza, setPizza] = useState<Pizza | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const addItemToCart = useCartStore((state) => state.addItem);

    useEffect(() => {
        const getPizza = async () => {
            if (!id) {
                setError('Pizza ID is missing.');
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const fetchedPizza = await fetchPizzaById(id);
                if (fetchedPizza) {
                    setPizza(fetchedPizza);
                    setSelectedSize(fetchedPizza.sizes[0] || 'Medium'); // Default to first size
                } else {
                    setError('Pizza not found.');
                }
            } catch (err) {
                setError('Failed to fetch pizza details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        getPizza();
    }, [id]);

    const handleAddToCart = () => {
        if (!pizza || !selectedSize) return;

        const cartItem = {
            id: `${pizza.id}-${selectedSize}-${Date.now()}`, // Unique ID for cart item
            pizzaId: pizza.id,
            name: pizza.name,
            image: pizza.image,
            price: pizza.price, // You might adjust price based on selected size
            quantity: 1,
            selectedSize,
        };
        addItemToCart(cartItem);
        alert(`${pizza.name} (${selectedSize}) added to cart!`);
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6 h-[calc(100vh-160px)] flex justify-center items-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-6 h-[calc(100vh-160px)] flex justify-center items-center">
                <EmptyState
                    title="Oops!"
                    message={error}
                    buttonText="Back to Menu"
                    buttonLink="/menu"
                    icon="😔"
                />
            </div>
        );
    }

    if (!pizza) {
        return (
            <div className="container mx-auto p-6 h-[calc(100vh-160px)] flex justify-center items-center">
                <EmptyState
                    title="Pizza Not Found"
                    message="The pizza you are looking for does not exist."
                    buttonText="Explore Menu"
                    buttonLink="/menu"
                    icon="🧐"
                />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden md:flex md:items-center p-8">
                <div className="md:w-1/2 flex justify-center items-center p-4">
                    <img
                        src={pizza.image}
                        alt={pizza.name}
                        className="w-full max-w-md h-auto rounded-lg shadow-md object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                </div>
                <div className="md:w-1/2 p-4 md:p-8">
                    <h1 className="text-4xl font-extrabold text-red-700 mb-4 font-display">
                        {pizza.name}
                    </h1>
                    <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                        {pizza.description}
                    </p>
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Category:</h3>
                        <span className="bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-full">
                            {pizza.category}
                        </span>
                    </div>
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Toppings:</h3>
                        <ul className="flex flex-wrap gap-2">
                            {pizza.toppings.map((topping, index) => (
                                <li key={index} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                                    {topping}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex items-center justify-between mb-8">
                        <span className="text-4xl font-extrabold text-red-700">
                            ${pizza.price.toFixed(2)}
                        </span>
                        <div className="flex items-center space-x-2">
                            <label htmlFor="pizza-size" className="font-semibold text-gray-800">Size:</label>
                            <select
                                id="pizza-size"
                                value={selectedSize}
                                onChange={(e) => setSelectedSize(e.target.value)}
                                className="p-3 border border-gray-300 rounded-lg text-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
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
                        onClick={handleAddToCart}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        Add to Cart
                    </Button>
                    <Link to="/menu" className="block text-center mt-4 text-red-600 hover:text-red-800 transition-colors font-medium">
                        &larr; Back to Menu
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PizzaDetailPage;