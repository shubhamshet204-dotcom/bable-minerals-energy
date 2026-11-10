import React from 'react';
import {
  X,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  ArrowRight,
  FileText,
  BadgePercent
} from 'lucide-react';
import { CartItem } from '../../types/product';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: (items: CartItem[]) => void;
  onBrowseMore: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onBrowseMore,
}) => {
  if (!isOpen) return null;

  const totalMT = cartItems.reduce((acc, item) => acc + item.quantityMT, 0);
  const subtotalINR = cartItems.reduce(
    (acc, item) => acc + item.product.numericPrice * item.quantityMT,
    0
  );
  // Standard 18% GST for industrial metals & minerals
  const gstINR = Math.round(subtotalINR * 0.18);
  const grandTotalINR = subtotalINR + gstINR;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-blue-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600/40 border border-blue-400/30 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-teal-300" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <span>Procurement Cart</span>
                  <span className="px-2 py-0.5 rounded-full bg-teal-400 text-slate-900 text-xs font-black">
                    {cartItems.length}
                  </span>
                </h3>
                <p className="text-xs text-slate-300">Commercial B2B Order Quotation</p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <ShoppingCart className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h4 className="text-base font-bold text-slate-800 mb-1">Your cart is empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6">
                  Browse products across Mild Steel, Chemicals, Energy, or Agri and add materials to request a direct wholesale quote.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onBrowseMore();
                  }}
                  className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
                >
                  Explore Product Catalog
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="border border-slate-200 rounded-xl p-3 bg-white shadow-2xs hover:shadow-xs transition"
                    >
                      <div className="flex gap-3">
                        {/* Thumbnail */}
                        <div className="w-16 h-16 rounded-lg bg-slate-50 border border-slate-100 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        {/* Title & Brand */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                              Brand: {item.product.brand}
                            </span>
                            <button
                              type="button"
                              onClick={() => onRemoveItem(item.product.id)}
                              className="text-slate-400 hover:text-red-500 transition p-0.5"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          
                          <h5 className="font-bold text-xs text-slate-900 mt-1 line-clamp-2">
                            {item.product.name}
                          </h5>

                          <div className="mt-1 text-[11px] text-slate-500">
                            Grade: <span className="font-semibold text-slate-700">{item.product.grade}</span>
                          </div>
                        </div>
                      </div>

                      {/* Specs snippet */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 grid grid-cols-2 gap-1 text-[10px] text-slate-500">
                        {Object.entries(item.product.specs).slice(0, 2).map(([k, v]) => (
                          <div key={k} className="truncate">
                            <span className="text-slate-400">{k}:</span> <span className="font-medium text-slate-700">{v}</span>
                          </div>
                        ))}
                      </div>

                      {/* Quantity & Unit Price */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase font-bold">Wholesale Price</div>
                          <div className="text-xs font-black text-blue-700">
                            {item.product.price} <span className="text-[10px] font-medium text-slate-500">{item.product.unit}</span>
                          </div>
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantityMT - 1))}
                            className="w-6 h-6 rounded bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 transition"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-slate-900 px-1.5 min-w-[32px] text-center">
                            {item.quantityMT} MT
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, item.quantityMT + 1)}
                            className="w-6 h-6 rounded bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 transition"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal for line item */}
                      <div className="mt-2 flex items-center justify-between text-[11px] bg-slate-50 px-2 py-1 rounded">
                        <span className="text-slate-500">Line Est:</span>
                        <span className="font-bold text-slate-800">
                          ₹{(item.product.numericPrice * item.quantityMT).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery & Dispatch Note */}
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 flex items-start gap-2.5">
                  <Truck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Consolidated Dispatch Available</div>
                    <div className="text-[11px] text-blue-800/80">
                      Materials will be dispatched directly from authorized primary mills (TATA, JSW, AMNS) with Mill Test Certificates (MTC).
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer with Summary & Checkout */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Total Volume</span>
                  <span className="font-bold text-slate-900">{totalMT} MT</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimated Material Value</span>
                  <span className="font-medium text-slate-800">₹{subtotalINR.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="flex items-center gap-1">
                    <span>Applicable GST (18%)</span>
                    <BadgePercent className="w-3.5 h-3.5 text-slate-400" />
                  </span>
                  <span className="font-medium text-slate-800">₹{gstINR.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                  <span>Total Quotation Estimate</span>
                  <span className="text-blue-700">₹{grandTotalINR.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onCheckout(cartItems);
                }}
                className="w-full py-3 px-4 rounded-xl brand-gradient hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Submit Multi-Product RFQ</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onBrowseMore();
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                >
                  + Add more products from catalog
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
