import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  TrendingUp,
  Truck,
  CheckCircle,
  Sparkles,
  Store,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { ProductCard } from '../components/marketplace/ProductCard';
import { ConfigNoticeBanner } from '../components/common/ConfigNoticeBanner';
import { productService } from '../services/productService';
import { Product } from '../types';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDbConfigured, setIsDbConfigured] = useState(true);
  const [showDemoPreview, setShowDemoPreview] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadFeatured = async () => {
      setIsLoading(true);
      const res = await productService.getProducts({ sortBy: 'newest' });
      if (!mounted) return;

      setIsDbConfigured(res.isConfigured);
      if (res.products && res.products.length > 0) {
        setFeaturedProducts(res.products.slice(0, 3));
      } else {
        // Fallback to sample preview when DB is not yet populated
        setFeaturedProducts(productService.getSamplePreviewProducts().slice(0, 3));
      }
      setIsLoading(false);
    };

    loadFeatured();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col">
      <ConfigNoticeBanner />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-stone-900 text-white min-h-[580px] lg:min-h-[640px] flex items-center">
        {/* Cinematic Background Image with Measured Contrast Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_kenyan_farm_1792156699205.jpg"
            alt="Lush green agricultural terraced farmland in Kenyan highlands"
            className="w-full h-full object-cover opacity-45 brightness-90 filter"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-stone-950/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-semibold rounded-full backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kenyan Agriculture, Straight from the Soil</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight text-balance">
              Connecting Kenyan Farmers Directly to Markets.
            </h1>

            <p className="text-base sm:text-lg text-stone-200/90 leading-relaxed max-w-xl">
              Eliminate predatory intermediaries. Shamba Link connects vegetable, fruit, grain, and tuber growers across Kenya with consumers, restaurants, supermarkets, and wholesale buyers.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                to="/marketplace"
                className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 text-center"
              >
                <span>Explore Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register?role=farmer"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold rounded-xl text-sm backdrop-blur-xs transition-all flex items-center justify-center text-center"
              >
                Start Selling Your Harvest
              </Link>
            </div>

            {/* Quiet Trust Proof Bar */}
            <div className="pt-6 border-t border-stone-800/80 grid grid-cols-3 gap-4 text-xs text-stone-300">
              <div>
                <div className="text-xl font-bold text-white font-mono tabular-nums">47</div>
                <div className="text-stone-400">Counties Supported</div>
              </div>
              <div>
                <div className="text-xl font-bold text-emerald-400 font-mono tabular-nums">+35%</div>
                <div className="text-stone-400">Higher Farmer Margin</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white font-mono tabular-nums">24h</div>
                <div className="text-stone-400">Harvest to Delivery</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition / Dual Benefits */}
      <section id="benefits" className="py-20 bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Direct Agricultural Network
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-2 text-balance">
              Fair Returns for Growers. Premium Freshness for Buyers.
            </h2>
            <p className="text-sm text-stone-600 mt-3 leading-relaxed">
              Traditional farm supply chains in Kenya involve up to four layers of middlemen, slashing farmer earnings and multiplying consumer costs. Shamba Link fixes this.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* For Farmers Card */}
            <div className="bg-white rounded-3xl border border-stone-200/90 p-8 shadow-xs flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Store className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-emerald-800 font-mono">FOR GROWERS & COOPERATIVES</span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-stone-900">
                    Take Control of Your Farm's Earnings
                  </h3>
                  <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                    Set your own farm-gate prices and access bulk buyers across Nairobi, Mombasa, Kisumu, and beyond without distress sales.
                  </p>
                </div>

                <ul className="space-y-3 text-sm text-stone-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span><strong>Transparent Prices:</strong> No hidden deductions or arbitrary broker grading.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span><strong>Direct Mobile Payments:</strong> Secure M-Pesa or bank settlements right upon dispatch.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span><strong>Pre-Harvest Demand:</strong> Match standing seasonal orders before crops mature.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8 mt-6 border-t border-stone-100">
                <Link
                  to="/register?role=farmer"
                  className="text-xs font-bold text-emerald-900 hover:text-emerald-700 flex items-center gap-1.5 transition-colors"
                >
                  <span>List your farm harvest on Shamba Link</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* For Buyers Card */}
            <div className="bg-white rounded-3xl border border-stone-200/90 p-8 shadow-xs flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center">
                    <Truck className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-amber-900 font-mono">FOR BUYERS & BUSINESSES</span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-stone-900">
                    Source Verified Harvest Directly from the Source
                  </h3>
                  <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                    Designed for hotel chefs, supermarket procurements, food processors, schools, and families seeking reliable, traceable fresh produce.
                  </p>
                </div>

                <ul className="space-y-3 text-sm text-stone-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span><strong>Traceable Origins:</strong> Know the specific county, sub-county, and farmer who cultivated your food.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span><strong>Wholesale Savings:</strong> Cut retail markups by up to 30% through direct aggregation.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span><strong>Consistency & Grade Quality:</strong> Standardized grading from export-grade avocados to washed tubers.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8 mt-6 border-t border-stone-100">
                <Link
                  to="/marketplace"
                  className="text-xs font-bold text-emerald-900 hover:text-emerald-700 flex items-center gap-1.5 transition-colors"
                >
                  <span>Browse produce catalog & submit order inquiry</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-stone-100/60 border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Simple & Transparent
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-2">
              How Shamba Link Works
            </h2>
            <p className="text-sm text-stone-600 mt-2">
              Three streamlined steps from field harvest to kitchen delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-900 text-white font-mono font-bold flex items-center justify-center text-sm">
                01
              </div>
              <h3 className="text-base font-bold text-stone-900">
                Farmers List Live Harvest
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Registered farmers post their crop type, harvested volume, price per kg or bag, and location in Murang'a, Nakuru, Nyandarua, Meru, or any Kenyan county.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-900 text-white font-mono font-bold flex items-center justify-center text-sm">
                02
              </div>
              <h3 className="text-base font-bold text-stone-900">
                Buyers Inquire & Order
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Browse real-time listings, compare unit prices in KES, select batch quantities, and submit transparent inquiries directly to the farmer.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-900 text-white font-mono font-bold flex items-center justify-center text-sm">
                03
              </div>
              <h3 className="text-base font-bold text-stone-900">
                Coordinated Dispatch & Payout
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Produce is inspected and routed from county aggregation centers to destination doorsteps. Payments are disbursed securely via M-Pesa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Produce Showcase */}
      <section className="py-20 bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Harvest Spotlight
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                Featured Farm Produce
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                {isDbConfigured
                  ? 'Active listings currently available directly from Kenyan growers.'
                  : 'Sample demonstration harvest items. Connect Supabase to pull real-time database rows.'}
              </p>
            </div>

            <Link
              to="/marketplace"
              className="text-xs font-bold text-emerald-900 hover:text-emerald-700 flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <span>View all produce in marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-stone-200/60 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Community Spotlight (Highland Farmer & Urban Chef) */}
      <section className="py-20 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Field to Fork
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Real Impact for Kenyan Agri-Entrepreneurs
            </h2>
            <p className="text-sm text-stone-400 mt-2">
              Transforming how food moves from the fertile highlands of Nyandarua and Naivasha into Nairobi's vibrant dining tables.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Farmer Profile */}
            <div className="bg-stone-800/80 rounded-3xl border border-stone-700/80 p-6 sm:p-8 flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <img
                  src="/src/assets/images/farmer_portrait_kenya_1792156701502.jpg"
                  alt="Kenyan greenhouse farmer"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shrink-0 border border-stone-700"
                />
                <div className="space-y-2">
                  <div className="text-xs text-emerald-400 font-semibold font-mono">
                    FARMER SPOTLIGHT · NAIVASHA
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    Sarah Achieng, Sweet Pepper Grower
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    "Before Shamba Link, middle-tier brokers took 40% of our harvest price while our peppers sat in the sun. Now we receive scheduled orders from Nairobi restaurants 2 days ahead of harvest."
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-700/60 text-xs text-stone-400 flex items-center justify-between">
                <span>Direct M-Pesa settlements</span>
                <span className="font-semibold text-emerald-400">100% verified grower</span>
              </div>
            </div>

            {/* Buyer Profile */}
            <div className="bg-stone-800/80 rounded-3xl border border-stone-700/80 p-6 sm:p-8 flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <img
                  src="/src/assets/images/buyer_chef_restaurant_1792156701956.jpg"
                  alt="Nairobi restaurant chef inspecting produce"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shrink-0 border border-stone-700"
                />
                <div className="space-y-2">
                  <div className="text-xs text-amber-400 font-semibold font-mono">
                    COMMERCIAL BUYER · NAIROBI
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    Chef Amani Mworia, Restaurant Group
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    "We need 500kg of French beans and Hass avocados every week. Shamba Link gives us direct traceability back to the specific farm in Nyandarua with reliable morning delivery."
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-700/60 text-xs text-stone-400 flex items-center justify-between">
                <span>Wholesale volume quotes</span>
                <span className="font-semibold text-amber-400">Guaranteed cold-chain delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-emerald-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-balance">
            Ready to Build a Fairer Kenyan Food System?
          </h2>
          <p className="text-sm sm:text-base text-emerald-100 max-w-xl mx-auto">
            Whether you cultivate an acre in Kiambu or source for a supermarket chain, join the direct agricultural marketplace today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/marketplace"
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-stone-100 text-emerald-950 font-bold rounded-xl text-xs transition-colors shadow-sm"
            >
              Browse All Produce
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white border border-emerald-600 font-bold rounded-xl text-xs transition-colors"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
