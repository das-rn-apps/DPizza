import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPizzaSlice,
    faShoppingCart,
    faUser,
    faBoxOpen,
    faSignInAlt,
    faUserPlus,
    faSignOutAlt,
    faBars,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';

export const Header: React.FC = () => {
    const location = useLocation();
    const totalCartItems = useCartStore((state) => state.totalItems);
    const { isAuthenticated, user, logout } = useAuthStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinkClass = (path: string) =>
        `relative transition-colors text-lg flex items-center space-x-2 px-2 py-1 rounded-md ${location.pathname === path
            ? 'text-yellow-400  decoration-yellow-400'
            : 'text-white hover:text-yellow-400'
        }`;

    return (
        <header className="bg-red-800 text-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Brand */}
                <Link
                    to="/"
                    className="text-3xl font-extrabold tracking-tight font-heading flex items-center space-x-2 transition-transform duration-200 hover:scale-105 group"
                >
                    <FontAwesomeIcon
                        icon={faPizzaSlice}
                        className="text-yellow-400 drop-shadow-md transition-transform duration-300 group-hover:rotate-12"
                    />
                    <span className="text-yellow-400 drop-shadow-lg decoration-yellow-300 underline-offset-4">
                        DPizza
                    </span>
                </Link>

                {/* Hamburger Button */}
                <button
                    className="md:hidden text-white focus:outline-none"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBars} size="lg" />
                </button>

                {/* Nav Links */}
                <nav
                    className={`flex-col md:flex-row md:flex items-center md:space-x-6 absolute md:static top-full left-0 w-full md:w-auto bg-red-800 md:bg-transparent z-40 transition-all duration-300 ease-in-out ${isMenuOpen ? 'flex' : 'hidden md:flex'
                        }`}
                >
                    <Link to="/menu" className={navLinkClass('/menu')} onClick={() => setIsMenuOpen(false)}>
                        <FontAwesomeIcon icon={faPizzaSlice} />
                        <span className="md:hidden">Menu</span>
                    </Link>

                    <Link to="/cart" className={navLinkClass('/cart')} onClick={() => setIsMenuOpen(false)}>
                        <FontAwesomeIcon icon={faShoppingCart} />
                        {totalCartItems > 0 && (
                            <span className="absolute -top-2 -right-3 bg-blue-600 text-red-800 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {totalCartItems}
                            </span>
                        )}
                        <span className="md:hidden">Cart</span>
                    </Link>

                    {isAuthenticated ? (
                        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0 mt-2 md:mt-0">
                            <span className="text-yellow-300 text-sm hidden md:inline">
                                Hi, {user?.name?.split(' ')[0] || 'User'}
                            </span>
                            <FontAwesomeIcon icon={faUser} className="text-yellow-400 hidden sm:inline-block" />

                            <Link to="/orders" className={navLinkClass('/orders')} onClick={() => setIsMenuOpen(false)}>
                                <FontAwesomeIcon icon={faBoxOpen} />
                                <span className="md:hidden">Orders</span>
                            </Link>

                            <Button
                                onClick={() => {
                                    logout();
                                    setIsMenuOpen(false);
                                }}
                                variant="secondary"
                                size="sm"
                                className="bg-yellow-400 hover:bg-yellow-300 text-red-800 font-semibold rounded-full px-4 py-2 flex items-center space-x-2"
                            >
                                <FontAwesomeIcon icon={faSignOutAlt} />
                                <span>Logout</span>
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col md:flex-row md:items-center md:space-x-3 space-y-2 md:space-y-0 mt-2 md:mt-0">
                            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="bg-yellow-400 hover:bg-yellow-300 text-red-800 rounded-full px-4 py-2 flex items-center space-x-2 w-full md:w-auto"
                                >
                                    <FontAwesomeIcon icon={faSignInAlt} />
                                    <span>Login</span>
                                </Button>
                            </Link>

                            <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-red-800 rounded-full px-4 py-2 flex items-center space-x-2 w-full md:w-auto"
                                >
                                    <FontAwesomeIcon icon={faUserPlus} />
                                    <span>Register</span>
                                </Button>
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};
