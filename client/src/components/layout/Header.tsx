import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPizzaSlice,
    faShoppingCart,
    faUser,
    faBoxOpen,
    faSignOutAlt,
    faSignInAlt,
    faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
    const location = useLocation();

    return (
        <header className="bg-red-800 text-white shadow-md sticky top-0 z-50 w-full overflow-x-auto">
            <div className="w-full max-w-screen-xl mx-auto px-4 py-0 flex items-center justify-between whitespace-nowrap">
                <Brand />
                <nav className="flex items-center gap-2 sm:gap-4 lg:gap-6 overflow-x-auto p-3">
                    <NavLinks location={location} />
                    <AuthLinks />
                </nav>
            </div>
        </header>
    );
};

const Brand = () => (
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
);

const NavLinks = ({ location }: { location: any }) => {
    const totalItems = useCartStore((state) => state.totalItems);
    const { isAuthenticated } = useAuthStore();

    const navLinkClass = (path: string) =>
        `relative transition-colors text-lg flex items-center space-x-2 px-2 py-1 rounded-md ${location.pathname === path
            ? 'text-yellow-400 decoration-yellow-400'
            : 'text-white hover:text-yellow-400'
        }`;

    return (
        <>
            <Link to="/menu" className={navLinkClass('/menu')}>
                <FontAwesomeIcon icon={faPizzaSlice} />
            </Link>

            <Link to="/cart" className={navLinkClass('/cart')}>
                <FontAwesomeIcon icon={faShoppingCart} />
                {totalItems > 0 && <CartBadge count={totalItems} />}
            </Link>
            {isAuthenticated && (
                <Link to="/orders" className={navLinkClass('/orders')}>
                    <FontAwesomeIcon icon={faBoxOpen} />
                </Link>
            )}
        </>
    );
};

const CartBadge = ({ count }: { count: number }) => (
    <span className="absolute -top-2 -right-0 bg-yellow-400 text-red-800 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
        {count}
    </span>
);

const AuthLinks = () => {
    const { isAuthenticated, user, logout } = useAuthStore();

    if (isAuthenticated) {
        return (
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                <span className="text-yellow-300 text-sm hidden sm:inline">
                    Hi, {user?.name?.split(' ')[0] || 'User'}
                </span>
                <FontAwesomeIcon icon={faUser} className="text-yellow-400" />
                <Button
                    onClick={() => logout()}
                    variant="secondary"
                    size="sm"
                    className="
            border-2 border-yellow-400
            bg-yellow-400 hover:bg-yellow-300
            text-red-800 font-semibold
            rounded-full px-4 py-2
            flex items-center space-x-2
            focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1
          "
                >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                </Button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            <Link to="/login">
                <Button
                    variant="secondary"
                    size="sm"
                    className="
            border-2 border-yellow-400
            bg-yellow-400 hover:bg-yellow-300
            text-red-800
            rounded-full px-4 py-2
            flex items-center space-x-2
            focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1
          "
                >
                    <FontAwesomeIcon icon={faSignInAlt} />
                </Button>
            </Link>
            <Link to="/register">
                <Button
                    variant="outline"
                    size="sm"
                    className="
            border-2 border-yellow-400
            text-yellow-400
            hover:bg-yellow-400 hover:text-red-800
            rounded-full px-4 py-2
            flex items-center space-x-2
            focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1
          "
                >
                    <FontAwesomeIcon icon={faUserPlus} />
                </Button>
            </Link>
        </div>
    );
};
