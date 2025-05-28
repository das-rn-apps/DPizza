// src/components/layout/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-8 shadow-inner">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* About Us */}
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">Pizza Palace</h3>
                    <p className="text-sm leading-relaxed">
                        Your go-to destination for the freshest, most delicious pizzas in town.
                        Crafted with passion and the finest ingredients to bring you an unforgettable taste experience.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                        <li>
                            <Link to="/menu" className="hover:text-red-500 transition-colors text-sm">
                                Our Menu
                            </Link>
                        </li>
                        <li>
                            <Link to="/cart" className="hover:text-red-500 transition-colors text-sm">
                                Cart
                            </Link>
                        </li>
                        <li>
                            <Link to="/login" className="hover:text-red-500 transition-colors text-sm">
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link to="/register" className="hover:text-red-500 transition-colors text-sm">
                                Register
                            </Link>
                        </li>
                        <li>
                            <Link to="/privacy-policy" className="hover:text-red-500 transition-colors text-sm">
                                Privacy Policy
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
                    <p className="text-sm">
                        123 Pizza Lane, Food City, 12345<br />
                        Email: <a href="mailto:info@pizzapalace.com" className="hover:text-red-500">info@pizzapalace.com</a><br />
                        Phone: <a href="tel:+1234567890" className="hover:text-red-500">+1 (234) 567-890</a>
                    </p>
                    <div className="flex space-x-4 mt-4">
                        {/* Social Media Icons - Placeholder */}
                        <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                            <i className="fab fa-facebook-f text-lg"></i> {/* Requires FontAwesome */}
                        </a>
                        <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                            <i className="fab fa-instagram text-lg"></i>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                            <i className="fab fa-twitter text-lg"></i>
                        </a>
                    </div>
                </div>
            </div>
            <div className="text-center text-gray-500 text-sm mt-8 border-t border-gray-700 pt-4">
                &copy; {new Date().getFullYear()} Pizza Palace. All rights reserved.
            </div>
        </footer>
    );
};