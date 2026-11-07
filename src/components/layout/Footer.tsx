import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 text-white font-bold text-xl">
              <span className="w-8 h-8 rounded-lg bg-emerald-700 text-emerald-100 flex items-center justify-center">
                <Sprout className="w-5 h-5" />
              </span>
              <span>Shamba Link</span>
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed">
              Empowering Kenyan agriculture by removing predatory cartels, giving smallholders fair prices, and delivering harvest-fresh produce directly to businesses and homes.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Direct farmer payouts via M-Pesa & Bank</span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <Link to="/marketplace" className="hover:text-emerald-400 transition-colors">
                  All Harvest Produce
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Vegetables" className="hover:text-emerald-400 transition-colors">
                  Fresh Vegetables
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Fruits" className="hover:text-emerald-400 transition-colors">
                  Export & Local Fruits
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Grains+%26+Cereals" className="hover:text-emerald-400 transition-colors">
                  Grains & Cereals
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Tubers+%26+Roots" className="hover:text-emerald-400 transition-colors">
                  Tubers & Roots
                </Link>
              </li>
            </ul>
          </div>

          {/* For Farmers & Buyers */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Community
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <Link to="/register" className="hover:text-emerald-400 transition-colors">
                  List Your Shamba Harvest
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-emerald-400 transition-colors">
                  Restaurant & Supermarket Supply
                </Link>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">
                  Fair Price Guarantee
                </a>
              </li>
              <li>
                <a href="#benefits" className="hover:text-emerald-400 transition-colors">
                  Cold-Chain & Delivery Network
                </a>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">
                  Farmer & Buyer Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Regional Hubs & Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Kenyan Hubs
            </h4>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Nairobi HQ, Westlands · Nakuru Hub · Eldoret Depot</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+254 700 123 456 / +254 722 000 111</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>habari@shambalink.co.ke</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Shamba Link Kenya Ltd. Built for Kenyan food security and farmer prosperity.</p>
          <div className="flex items-center gap-6">
            <span>M-Pesa Verified</span>
            <span aria-hidden="true">·</span>
            <span>NAFIS Aligned</span>
            <span aria-hidden="true">·</span>
            <span>Zero Brokerage Exploitation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
