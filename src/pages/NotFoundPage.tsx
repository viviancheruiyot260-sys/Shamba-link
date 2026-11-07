import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Store, Sprout } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-[#FAF9F5]">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/90 shadow-xs">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto text-2xl">
          🌾
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-emerald-800 tracking-wider uppercase">
            Page Not Found · 404
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            This field has no harvest
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            The page or produce listing you are looking for may have moved, been harvested, or never existed in this season.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/marketplace"
            className="w-full sm:w-auto px-5 py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <Store className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
