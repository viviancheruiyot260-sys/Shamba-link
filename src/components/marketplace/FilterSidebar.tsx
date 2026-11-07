import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { ProductFilter, ProduceCategory } from '../../types';
import { PRODUCE_CATEGORIES, KENYAN_COUNTIES } from '../../services/productService';

interface FilterSidebarProps {
  filters: ProductFilter;
  onChange: (newFilters: ProductFilter) => void;
  onReset: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onChange,
  onReset,
}) => {
  return (
    <aside className="bg-white rounded-2xl border border-stone-200/90 p-5 space-y-6 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
          <Filter className="w-4 h-4 text-emerald-800" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-stone-500 hover:text-emerald-900 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
          Produce Category
        </label>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onChange({ ...filters, category: undefined })}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              !filters.category
                ? 'bg-emerald-800 text-white font-semibold'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            All Produce Categories
          </button>
          {PRODUCE_CATEGORIES.map((cat: ProduceCategory) => (
            <button
              key={cat}
              type="button"
              onClick={() => onChange({ ...filters, category: cat })}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filters.category === cat
                  ? 'bg-emerald-800 text-white font-semibold'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Kenyan County Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
          Origin County
        </label>
        <select
          value={filters.county || ''}
          onChange={(e) => onChange({ ...filters, county: e.target.value || undefined })}
          className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
        >
          <option value="">All Kenyan Counties</option>
          {KENYAN_COUNTIES.map((county) => (
            <option key={county} value={county}>
              {county} County
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
          Max Price (KES)
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min="50"
            max="5000"
            step="50"
            value={filters.maxPrice || 5000}
            onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
            className="w-full accent-emerald-800 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-stone-500 font-mono">
            <span>KES 50</span>
            <span className="font-semibold text-emerald-950">
              Up to KES {(filters.maxPrice || 5000).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Organic Checkbox */}
      <div className="pt-2 border-t border-stone-100">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700 select-none">
          <input
            type="checkbox"
            checked={Boolean(filters.onlyOrganic)}
            onChange={(e) => onChange({ ...filters, onlyOrganic: e.target.checked })}
            className="w-4 h-4 text-emerald-800 rounded border-stone-300 focus:ring-emerald-700 accent-emerald-800"
          />
          <span>Organic Certified only</span>
        </label>
      </div>
    </aside>
  );
};
