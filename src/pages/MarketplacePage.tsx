import React, { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, AlertCircle, Database, RefreshCw, X } from 'lucide-react';
import { ProductCard } from '../components/marketplace/ProductCard';
import { FilterSidebar } from '../components/marketplace/FilterSidebar';
import { ConfigNoticeBanner } from '../components/common/ConfigNoticeBanner';
import { productService } from '../services/productService';
import { Product, ProductFilter } from '../types';

export const MarketplacePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDbConfigured, setIsDbConfigured] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [useSamplePreview, setUseSamplePreview] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState<ProductFilter>({
    search: '',
    category: undefined,
    county: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: 'newest',
    onlyOrganic: false,
  });

  const loadProducts = async () => {
    setIsLoading(true);
    setFetchError(null);

    const res = await productService.getProducts(filters);
    setIsDbConfigured(res.isConfigured);

    if (res.error) {
      setFetchError(res.error);
    }

    if (res.isConfigured && res.products.length > 0) {
      setProducts(res.products);
    } else if (useSamplePreview) {
      // Filter client-side sample data according to current filters
      let sampleList = productService.getSamplePreviewProducts();

      if (filters.search) {
        const s = filters.search.toLowerCase();
        sampleList = sampleList.filter(
          (p) =>
            p.title.toLowerCase().includes(s) ||
            p.description.toLowerCase().includes(s) ||
            p.county.toLowerCase().includes(s)
        );
      }
      if (filters.category) {
        sampleList = sampleList.filter((p) => p.category === filters.category);
      }
      if (filters.county) {
        sampleList = sampleList.filter((p) => p.county === filters.county);
      }
      if (filters.onlyOrganic) {
        sampleList = sampleList.filter((p) => p.isOrganic);
      }
      if (filters.maxPrice) {
        sampleList = sampleList.filter((p) => p.priceKes <= (filters.maxPrice as number));
      }

      if (filters.sortBy === 'price_asc') {
        sampleList.sort((a, b) => a.priceKes - b.priceKes);
      } else if (filters.sortBy === 'price_desc') {
        sampleList.sort((a, b) => b.priceKes - a.priceKes);
      }

      setProducts(sampleList);
    } else {
      setProducts([]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, useSamplePreview]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: undefined,
      county: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: 'newest',
      onlyOrganic: false,
    });
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-8">
      <ConfigNoticeBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Direct Kenyan Sourcing
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              Agricultural Produce Marketplace
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Browse farm-fresh crops from registered growers across Kenya.
            </p>
          </div>

          {/* Database configuration status flag */}
          {!isDbConfigured && (
            <div className="flex items-center gap-2 p-2 bg-stone-100 rounded-xl border border-stone-200 text-xs">
              <span className="text-stone-600">Database:</span>
              <button
                type="button"
                onClick={() => setUseSamplePreview(!useSamplePreview)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  useSamplePreview
                    ? 'bg-emerald-800 text-white'
                    : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                }`}
              >
                {useSamplePreview ? 'Demo Mode Active' : 'Real Database Only'}
              </button>
            </div>
          )}
        </div>

        {/* Search & Mobile Filter Trigger Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search produce (e.g. avocado, french beans, potatoes, cabbage)..."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 shadow-xs"
            />
            {filters.search && (
              <button
                onClick={() => setFilters({ ...filters, search: '' })}
                className="absolute right-3 top-3 text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Selector */}
            <select
              value={filters.sortBy || 'newest'}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  sortBy: e.target.value as 'newest' | 'price_asc' | 'price_desc',
                })
              }
              aria-label="Sort produce by"
              className="text-xs px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700 shadow-xs cursor-pointer"
            >
              <option value="newest">Newest Harvests First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-700 text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-emerald-800" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <FilterSidebar
              filters={filters}
              onChange={(newFilters) => setFilters(newFilters)}
              onReset={handleResetFilters}
            />
          </div>

          {/* Mobile Filter Drawer */}
          {mobileFilterOpen && (
            <div className="lg:hidden col-span-1">
              <FilterSidebar
                filters={filters}
                onChange={(newFilters) => setFilters(newFilters)}
                onReset={handleResetFilters}
              />
            </div>
          )}

          {/* Product Feed */}
          <div className="lg:col-span-3 space-y-4">
            {/* Feed Status Summary */}
            <div className="flex items-center justify-between text-xs text-stone-500 px-1">
              <span>
                Showing{' '}
                <strong className="text-stone-900 font-mono tabular-nums">
                  {products.length}
                </strong>{' '}
                {products.length === 1 ? 'produce item' : 'produce items'}
              </span>

              {filters.category && (
                <span className="font-semibold text-emerald-900">
                  Category: {filters.category}
                </span>
              )}
            </div>

            {/* Error State */}
            {fetchError && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Failed to fetch produce from database.</p>
                  <p className="mt-0.5">{fetchError}</p>
                </div>
                <button
                  onClick={loadProducts}
                  className="px-2 py-1 bg-white border border-rose-300 rounded font-medium hover:bg-rose-100 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Retry</span>
                </button>
              </div>
            )}

            {/* Loading State */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div
                    key={idx}
                    className="h-88 bg-white border border-stone-200 rounded-2xl p-4 space-y-4 animate-pulse"
                  >
                    <div className="h-44 bg-stone-200 rounded-xl" />
                    <div className="h-4 bg-stone-200 rounded w-2/3" />
                    <div className="h-3 bg-stone-200 rounded w-full" />
                    <div className="h-3 bg-stone-200 rounded w-4/5" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              /* Empty State */
              <div className="bg-white rounded-2xl border border-stone-200/90 p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto text-2xl">
                  🌾
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    No farm produce found
                  </h3>
                  <p className="text-xs text-stone-500 max-w-md mx-auto mt-1">
                    {!isDbConfigured && !useSamplePreview
                      ? 'Supabase database is currently unconfigured. Add VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY to load live harvest, or toggle Demo Mode above to preview.'
                      : 'No harvest items matched your active search or filters. Try adjusting your county or category selection.'}
                  </p>
                </div>

                {!isDbConfigured && !useSamplePreview ? (
                  <button
                    onClick={() => setUseSamplePreview(true)}
                    className="px-4 py-2 bg-emerald-800 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    Enable Sample Preview
                  </button>
                ) : (
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Reset All Filters
                  </button>
                )}
              </div>
            ) : (
              /* Product Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
