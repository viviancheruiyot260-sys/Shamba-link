import React, { useState } from 'react';
import { X, Trash2, ArrowRight, CheckCircle2, Phone, MapPin } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { KENYAN_COUNTIES } from '../../services/productService';

export const InquiryDrawer: React.FC = () => {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalKes,
  } = useCart();

  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [deliveryCounty, setDeliveryCounty] = useState('Nairobi');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<{
    referenceId: string;
    totalKes: number;
    phone: string;
    itemsCount: number;
  } | null>(null);

  if (!isDrawerOpen) return null;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim() || !buyerPhone.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const ref = `SL-KE-${Math.floor(100000 + Math.random() * 900000)}`;
      setConfirmedOrder({
        referenceId: ref,
        totalKes,
        phone: buyerPhone,
        itemsCount: items.length,
      });
      clearCart();
      setIsSubmitting(false);
    }, 700);
  };

  const handleReset = () => {
    setConfirmedOrder(null);
    closeDrawer();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F5] shadow-2xl flex flex-col border-l border-stone-200">
          {/* Header */}
          <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-white">
            <div>
              <h2 className="text-lg font-bold text-stone-900">
                Produce Order Inquiry
              </h2>
              <p className="text-xs text-stone-500">
                Direct farm gate sourcing · Transparent pricing
              </p>
            </div>
            <button
              onClick={closeDrawer}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {confirmedOrder ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-stone-900">
                  Inquiry Dispatched!
                </h3>
                <div className="bg-white p-4 rounded-xl border border-stone-200 text-left space-y-2 text-sm">
                  <div className="flex justify-between text-stone-500">
                    <span>Reference ID</span>
                    <span className="font-mono font-bold text-stone-900">
                      {confirmedOrder.referenceId}
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-500">
                    <span>Total Estimated Value</span>
                    <span className="font-bold text-emerald-900 tabular-nums">
                      KES {confirmedOrder.totalKes.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-500">
                    <span>Contact Number</span>
                    <span className="font-mono text-stone-800">
                      {confirmedOrder.phone}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  The respective farmers and our logistics aggregation hub have received your request. You will receive an SMS and a representative will call to coordinate harvest timing and vehicle dispatch.
                </p>
                <button
                  onClick={handleReset}
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold rounded-lg text-sm shadow-sm transition-colors"
                >
                  Done & Continue Browsing
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl">🧺</span>
                </div>
                <h3 className="text-base font-semibold text-stone-900">
                  Your inquiry list is empty
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Browse the marketplace to add avocados, french beans, potatoes, grains, and other farm produce directly from verified farmers.
                </p>
                <button
                  onClick={closeDrawer}
                  className="mt-2 px-4 py-2 text-xs font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors"
                >
                  Explore Produce
                </button>
              </div>
            ) : (
              <>
                {/* Itemized List */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Selected Harvest ({items.length} {items.length === 1 ? 'item' : 'items'})
                  </h3>
                  <div className="divide-y divide-stone-200 bg-white rounded-xl border border-stone-200 overflow-hidden">
                    {items.map(({ product, quantity }) => (
                      <div key={product.id} className="p-3.5 flex gap-3 items-center">
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-16 h-16 object-cover rounded-lg bg-stone-100 shrink-0"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-stone-900 truncate">
                            {product.title}
                          </h4>
                          <div className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
                            <MapPin className="w-3 h-3 text-emerald-700" />
                            <span>{product.county}</span>
                            <span>·</span>
                            <span className="font-semibold text-stone-800 tabular-nums">
                              KES {product.priceKes}/{product.unit}
                            </span>
                          </div>
                          {/* Quantity control */}
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center border border-stone-300 rounded-md bg-stone-50 text-xs">
                              <button
                                type="button"
                                onClick={() => updateQuantity(product.id, quantity - 1)}
                                className="px-2 py-1 hover:bg-stone-200 font-bold"
                              >
                                -
                              </button>
                              <span className="px-2.5 py-1 font-mono font-semibold tabular-nums">
                                {quantity} {product.unit}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(product.id, quantity + 1)}
                                className="px-2 py-1 hover:bg-stone-200 font-bold"
                              >
                                +
                              </button>
                            </div>
                            <span className="text-xs font-semibold text-emerald-950 tabular-nums ml-auto">
                              KES {(product.priceKes * quantity).toLocaleString()}
                            </span>
                            <button
                              onClick={() => removeFromCart(product.id)}
                              className="text-stone-400 hover:text-rose-600 p-1"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subtotal Calculation */}
                <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100 space-y-1.5 text-sm">
                  <div className="flex justify-between text-stone-600">
                    <span>Farm Produce Subtotal</span>
                    <span className="font-semibold text-stone-900 tabular-nums">
                      KES {totalKes.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-500 text-xs">
                    <span>Logistics / Aggregation</span>
                    <span>Calculated based on delivery county</span>
                  </div>
                  <div className="pt-2 border-t border-emerald-200/60 flex justify-between font-bold text-emerald-950 text-base">
                    <span>Estimated Total</span>
                    <span className="tabular-nums">KES {totalKes.toLocaleString()}</span>
                  </div>
                </div>

                {/* Contact & Destination Form */}
                <form onSubmit={handleSubmitOrder} className="space-y-3.5 pt-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Buyer & Delivery Information
                  </h3>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Full Name or Business Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="e.g. John Karanja / Mama Rocks Diner"
                      className="w-full text-sm px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Phone Number (M-Pesa registered) *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        required
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                        placeholder="0712 345 678"
                        className="w-full text-sm pl-9 pr-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Destination County *
                    </label>
                    <select
                      value={deliveryCounty}
                      onChange={(e) => setDeliveryCounty(e.target.value)}
                      className="w-full text-sm px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    >
                      {KENYAN_COUNTIES.map((c) => (
                        <option key={c} value={c}>
                          {c} County
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Special Handling or Quality Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Needs delivery by Thursday morning at Marikiti or direct to Westlands depot."
                      className="w-full text-sm px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-lg text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      'Dispatching Inquiry...'
                    ) : (
                      <>
                        <span>Submit Direct Produce Inquiry</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
