import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sprout,
  Plus,
  Package,
  TrendingUp,
  MapPin,
  Calendar,
  LogOut,
  AlertCircle,
  CheckCircle,
  FileText,
  ShoppingBag,
  Building2,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { productService, PRODUCE_CATEGORIES, KENYAN_COUNTIES } from '../services/productService';
import { ProduceCategory, ProduceUnit } from '../types';
import { ConfigNoticeBanner } from '../components/common/ConfigNoticeBanner';

export const DashboardPage: React.FC = () => {
  const { user, profile, signOut, demoRole, setDemoRole, isConfigured } = useAuth();
  const navigate = useNavigate();

  // New Listing Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ProduceCategory>('Vegetables');
  const [newPrice, setNewPrice] = useState<number>(150);
  const [newQuantity, setNewQuantity] = useState<number>(100);
  const [newUnit, setNewUnit] = useState<ProduceUnit>('kg');
  const [newCounty, setNewCounty] = useState(profile?.county || 'Nakuru');
  const [newSubCounty, setNewSubCounty] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newIsOrganic, setNewIsOrganic] = useState(false);

  // Unauthenticated State (Offer login or demo role preview)
  if (!user && !profile) {
    return (
      <div className="min-h-[calc(100vh-72px)] flex items-center justify-center p-6 bg-[#FAF9F5]">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-stone-200/90 shadow-sm text-center space-y-5">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto">
            <Sprout className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900">Protected Dashboard</h2>
            <p className="text-xs text-stone-500 mt-1">
              Please log in to your account to access your farmer listings or buyer order portal.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Link
              to="/login"
              className="py-2.5 bg-emerald-800 text-white font-semibold rounded-xl text-xs hover:bg-emerald-700 transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="py-2.5 bg-stone-100 text-stone-800 font-semibold rounded-xl text-xs hover:bg-stone-200 transition-colors"
            >
              Register
            </Link>
          </div>

          <div className="pt-4 border-t border-stone-200 space-y-2">
            <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
              Quick Role Preview
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDemoRole('farmer')}
                className="py-2 bg-stone-50 hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 border border-stone-200 rounded-lg text-xs font-medium transition-colors"
              >
                Enter as Farmer
              </button>
              <button
                onClick={() => setDemoRole('buyer')}
                className="py-2 bg-stone-50 hover:bg-amber-50 text-stone-700 hover:text-amber-900 border border-stone-200 rounded-lg text-xs font-medium transition-colors"
              >
                Enter as Buyer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isFarmer = profile?.role === 'farmer';

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedbackMsg(null);

    const res = await productService.createProduct({
      title: newTitle,
      category: newCategory,
      priceKes: Number(newPrice),
      quantityAvailable: Number(newQuantity),
      unit: newUnit,
      county: newCounty,
      subCounty: newSubCounty,
      description: newDescription,
      isOrganic: newIsOrganic,
      farmerId: profile?.id || 'demo-farmer',
      farmerName: profile?.fullName || 'Registered Farmer',
      farmerPhone: profile?.phone || '+254 700 000 000',
      imageUrl: '/src/assets/images/produce_french_beans_1792156700988.jpg',
      harvestDate: new Date().toISOString().split('T')[0],
      minimumOrderQuantity: 5,
    });

    setIsSubmitting(false);

    if (res.success) {
      setFeedbackMsg({ text: 'Harvest listing published to marketplace!', type: 'success' });
      setShowAddModal(false);
      // Reset form
      setNewTitle('');
      setNewDescription('');
    } else {
      setFeedbackMsg({
        text: res.error || 'Failed to publish listing.',
        type: 'error',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] py-8">
      <ConfigNoticeBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Profile Bar */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
              isFarmer ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
            }`}>
              {isFarmer ? '🌾' : '🏢'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
                  {profile?.fullName}
                </h1>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-md ${
                  isFarmer ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                }`}>
                  {isFarmer ? 'Farmer Account' : 'Commercial Buyer'}
                </span>
                {demoRole && (
                  <span className="px-2 py-0.5 text-[11px] bg-stone-100 text-stone-600 rounded">
                    Demo Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 mt-1 flex items-center gap-2">
                <span>{profile?.email}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-stone-400" />
                  {profile?.county ? `${profile.county} County` : 'Kenya'}
                </span>
                {profile?.organizationName && (
                  <>
                    <span>·</span>
                    <span className="font-medium text-stone-700">{profile.organizationName}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {isFarmer ? (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>List New Harvest Produce</span>
              </button>
            ) : (
              <Link
                to="/marketplace"
                className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Order Farm Produce</span>
              </Link>
            )}

            <button
              onClick={() => {
                signOut();
                navigate('/');
              }}
              className="px-3 py-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Global Feedback message */}
        {feedbackMsg && (
          <div className={`p-4 rounded-xl text-xs flex items-start gap-2 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}>
            {feedbackMsg.type === 'success' ? (
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-700" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-700" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* Role Content: FARMER VIEW */}
        {isFarmer ? (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-1">
                <span className="text-xs text-stone-500 font-medium">Active Harvest Listings</span>
                <div className="text-2xl font-bold text-stone-900 font-mono tabular-nums">4</div>
                <span className="text-[11px] text-emerald-800 font-medium">Ready for buyer dispatch</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-1">
                <span className="text-xs text-stone-500 font-medium">Pending Buyer Inquiries</span>
                <div className="text-2xl font-bold text-stone-900 font-mono tabular-nums">3</div>
                <span className="text-[11px] text-stone-500">From Nairobi & Nakuru buyers</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-1">
                <span className="text-xs text-stone-500 font-medium">Estimated Inventory Value</span>
                <div className="text-2xl font-bold text-emerald-950 font-mono tabular-nums">KES 245,000</div>
                <span className="text-[11px] text-stone-500">Calculated at current farm gate price</span>
              </div>
            </div>

            {/* Farmer's Listings Table */}
            <div className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs">
              <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Your Current Farm Harvest</h3>
                  <p className="text-xs text-stone-500">Live produce visible to verified buyers</p>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Produce</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200">
                    <tr>
                      <th className="py-3 px-6">Produce Item</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Farm Gate Price</th>
                      <th className="py-3 px-4">Available Qty</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    <tr>
                      <td className="py-3 px-6 font-semibold text-stone-900">Hass Avocados (Export Grade)</td>
                      <td className="py-3 px-4">Fruits</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-950 tabular-nums">KES 180 / kg</td>
                      <td className="py-3 px-4 font-mono tabular-nums">450 kg</td>
                      <td className="py-3 px-4">Murang'a (Kandara)</td>
                      <td className="py-3 px-4">
                        <span className="text-emerald-800 font-semibold">Live in Market</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-6 font-semibold text-stone-900">French Beans (Haricots Verts)</td>
                      <td className="py-3 px-4">Vegetables</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-950 tabular-nums">KES 140 / kg</td>
                      <td className="py-3 px-4 font-mono tabular-nums">800 kg</td>
                      <td className="py-3 px-4">Nyandarua (Ol Kalou)</td>
                      <td className="py-3 px-4">
                        <span className="text-emerald-800 font-semibold">Live in Market</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-6 font-semibold text-stone-900">Sweet Bell Peppers</td>
                      <td className="py-3 px-4">Vegetables</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-950 tabular-nums">KES 220 / kg</td>
                      <td className="py-3 px-4 font-mono tabular-nums">350 kg</td>
                      <td className="py-3 px-4">Nakuru (Naivasha)</td>
                      <td className="py-3 px-4">
                        <span className="text-emerald-800 font-semibold">Live in Market</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Role Content: BUYER VIEW */
          <div className="space-y-6">
            {/* Buyer KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-1">
                <span className="text-xs text-stone-500 font-medium">Submitted Inquiries</span>
                <div className="text-2xl font-bold text-stone-900 font-mono tabular-nums">2</div>
                <span className="text-[11px] text-stone-500">Coordinating farm dispatch</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-1">
                <span className="text-xs text-stone-500 font-medium">Estimated Direct Sourcing Savings</span>
                <div className="text-2xl font-bold text-emerald-900 font-mono tabular-nums">~28%</div>
                <span className="text-[11px] text-emerald-800 font-medium">Compared to city terminal market markups</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-1">
                <span className="text-xs text-stone-500 font-medium">Verified Partner Farms</span>
                <div className="text-2xl font-bold text-stone-900 font-mono tabular-nums">8</div>
                <span className="text-[11px] text-stone-500">Across Central & Rift Valley hubs</span>
              </div>
            </div>

            {/* Buyer Active Inquiries */}
            <div className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs">
              <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Your Recent Produce Inquiries</h3>
                  <p className="text-xs text-stone-500">Real-time status of wholesale batch requests</p>
                </div>
                <Link
                  to="/marketplace"
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                >
                  <span>Explore Catalog</span>
                  <Plus className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="p-6 space-y-4">
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <span className="font-mono font-bold text-stone-900">Reference: SL-KE-482019</span>
                    <span className="text-amber-800 font-semibold bg-amber-100 px-2 py-0.5 rounded">
                      In Coordination with Hub
                    </span>
                  </div>
                  <p className="text-xs text-stone-600">
                    250 kg French beans (Nyandarua) + 100 kg Hass avocados (Murang'a) · Destination: Westlands, Nairobi
                  </p>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-200">
                    <span className="text-stone-500">Estimated value: <strong className="text-stone-900 font-mono">KES 53,000</strong></span>
                    <span className="text-stone-500">Scheduled arrival: Thursday morning</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Add New Harvest Produce (Farmer only) */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-stone-900">List New Harvest Produce</h3>
                  <p className="text-xs text-stone-500">
                    Publish your available crop batch to the nationwide marketplace.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateListing} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Produce Crop Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Fresh Red Onions, Grade 1 Cabbages..."
                    className="w-full text-xs sm:text-sm px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as ProduceCategory)}
                      className="w-full text-xs sm:text-sm px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    >
                      {PRODUCE_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Unit Measurement *
                    </label>
                    <select
                      value={newUnit}
                      onChange={(e) => setNewUnit(e.target.value as ProduceUnit)}
                      className="w-full text-xs sm:text-sm px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    >
                      <option value="kg">Per Kilogram (kg)</option>
                      <option value="crate (50kg)">Per Crate (50kg)</option>
                      <option value="bag (90kg)">Per Bag (90kg)</option>
                      <option value="bunch">Per Bunch</option>
                      <option value="piece">Per Piece</option>
                      <option value="ton">Per Ton</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Farm Gate Price (KES per unit) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-full text-xs sm:text-sm px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Quantity Available *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={newQuantity}
                      onChange={(e) => setNewQuantity(Number(e.target.value))}
                      className="w-full text-xs sm:text-sm px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Farm Origin County *
                    </label>
                    <select
                      value={newCounty}
                      onChange={(e) => setNewCounty(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    >
                      {KENYAN_COUNTIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Sub-County / Area
                    </label>
                    <input
                      type="text"
                      value={newSubCounty}
                      onChange={(e) => setNewSubCounty(e.target.value)}
                      placeholder="e.g. Naivasha, Molo, Kandara"
                      className="w-full text-xs sm:text-sm px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Description & Harvest Details
                  </label>
                  <textarea
                    rows={2}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Describe crop quality, harvest date, grading, packing..."
                    className="w-full text-xs sm:text-sm px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 resize-none"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
                    <input
                      type="checkbox"
                      checked={newIsOrganic}
                      onChange={(e) => setNewIsOrganic(e.target.checked)}
                      className="w-4 h-4 text-emerald-800 rounded border-stone-300 accent-emerald-800"
                    />
                    <span>Organic certified produce</span>
                  </label>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 text-xs font-medium text-stone-600 hover:text-stone-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold rounded-xl text-xs transition-colors"
                  >
                    {isSubmitting ? 'Publishing...' : 'Publish Produce Listing'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
