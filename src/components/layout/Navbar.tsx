import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, User as UserIcon, LogOut, Sprout } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const { items, openDrawer } = useCart();
  const navigate = useNavigate();

  const totalCartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-stone-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Brand Wordmark (Single element, no adjacent badges) */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-emerald-950 whitespace-nowrap shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-sm"
          >
            <span className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-200 flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-emerald-700 transition-colors">
              <Sprout className="w-5 h-5 text-emerald-100" />
            </span>
            <span>Shamba Link</span>
          </Link>

          {/* Zone 2: 4 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-700">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `whitespace-nowrap shrink-0 transition-colors hover:text-emerald-900 ${
                  isActive ? 'text-emerald-900 font-semibold' : ''
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/marketplace"
              className={({ isActive }) =>
                `whitespace-nowrap shrink-0 transition-colors hover:text-emerald-900 ${
                  isActive ? 'text-emerald-900 font-semibold' : ''
                }`
              }
            >
              Marketplace
            </NavLink>
            <a
              href="/#how-it-works"
              className="whitespace-nowrap shrink-0 transition-colors hover:text-emerald-900"
            >
              How It Works
            </a>
            <a
              href="/#benefits"
              className="whitespace-nowrap shrink-0 transition-colors hover:text-emerald-900"
            >
              Why Shamba Link
            </a>
          </nav>

          {/* Zone 3: Primary Action & Cart Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Cart / Order Inquiry Trigger */}
            <button
              onClick={openDrawer}
              aria-label="View Order Inquiry"
              className="relative p-2 text-stone-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-800 text-white font-mono text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalCartCount > 99 ? '99+' : totalCartCount}
                </span>
              )}
            </button>

            {/* Desktop Auth State / Primary CTA */}
            {user || profile ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-900 bg-emerald-100/70 hover:bg-emerald-200/80 rounded-lg transition-colors whitespace-nowrap"
                >
                  <UserIcon className="w-3.5 h-3.5 text-emerald-800" />
                  <span className="truncate max-w-[120px]">
                    {profile?.fullName ? profile.fullName.split(' ')[0] : 'Dashboard'}
                  </span>
                </Link>
                <button
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-semibold text-stone-700 hover:text-emerald-900 transition-colors whitespace-nowrap"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors whitespace-nowrap"
                >
                  Start Selling
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 text-stone-700 hover:text-emerald-900 hover:bg-stone-100 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-[#FAF9F5] px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-stone-800">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-stone-100 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-stone-100 transition-colors"
            >
              Marketplace
            </Link>
            <a
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-stone-100 transition-colors"
            >
              How It Works
            </a>
            <a
              href="/#benefits"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-stone-100 transition-colors"
            >
              Why Shamba Link
            </a>
          </nav>

          <div className="pt-3 border-t border-stone-200 flex flex-col gap-2">
            {user || profile ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 text-sm font-semibold text-emerald-950 bg-emerald-100 rounded-lg hover:bg-emerald-200 transition-colors"
                >
                  Open Dashboard ({profile?.role === 'farmer' ? 'Farmer' : 'Buyer'})
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-center px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 text-sm font-medium text-stone-700 bg-stone-100 rounded-lg hover:bg-stone-200 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 text-sm font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Join Platform
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
