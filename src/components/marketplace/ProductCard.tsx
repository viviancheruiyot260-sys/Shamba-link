import React, { useState } from 'react';
import { MapPin, ShoppingBag, Check, ShieldCheck } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAdd = () => {
    addToCart(product, product.minimumOrderQuantity || 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      {/* 65%-75% Height Ratio Image Container with Scrim */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
        {!imgError && product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400 p-4 text-center">
            <span className="text-3xl mb-1">🌱</span>
            <span className="text-xs font-medium text-stone-500">Kenyan Farm Harvest</span>
          </div>
        )}

        {/* Quiet Organic / Certified indicator (unboxed text badge with backdrop blur) */}
        {product.isOrganic && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-emerald-900 text-[11px] font-semibold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-700" />
            <span>Organic Certified</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Unboxed Metadata with Typographic Separators */}
        <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1.5">
          <span className="uppercase tracking-wider font-medium text-emerald-800">
            {product.category}
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1 truncate">
            <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
            {product.county}{product.subCounty ? `, ${product.subCounty}` : ''}
          </span>
        </div>

        {/* Product Title */}
        <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-950 transition-colors line-clamp-1">
          {product.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-stone-600 line-clamp-2 mt-1 mb-3.5 leading-relaxed">
          {product.description}
        </p>

        {/* Farmer Attribution */}
        <div className="text-[11px] text-stone-500 mb-3.5 flex items-center gap-1 truncate">
          <span>By</span>
          <span className="font-medium text-stone-700 truncate">{product.farmerName}</span>
        </div>

        {/* Pricing & Order Action Bar */}
        <div className="mt-auto pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] text-stone-400 font-medium">Farm gate price</div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-emerald-950 font-mono tabular-nums">
                KES {product.priceKes.toLocaleString()}
              </span>
              <span className="text-xs text-stone-500 font-normal">/{product.unit}</span>
            </div>
            {product.minimumOrderQuantity && product.minimumOrderQuantity > 1 && (
              <div className="text-[10px] text-stone-400 font-mono">
                Min. order: {product.minimumOrderQuantity} {product.unit}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 ${
              justAdded
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Inquire</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
