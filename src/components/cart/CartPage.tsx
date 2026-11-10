import React, { useState } from 'react';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  FileText,
  BadgePercent,
  CheckCircle2,
  ArrowLeft,
  Building2,
  PhoneCall,
  MapPin,
  Clock,
  Sparkles,
  Package,
  Layers,
  Search,
  UserCheck
} from 'lucide-react';
import { CartItem, ProductItem } from '../../types/product';
import { getStoredLocation, detectLocationFromPincode } from '../../utils/location';
import { useAuth } from '../../context/AuthContext';
import { createOrder } from '../../lib/firestoreService';
import { LocationSelector } from '../LocationSelector';

interface CartPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onNavigateHome: () => void;
  onNavigateProducts: () => void;
  onOpenQuote: (category?: string, product?: string) => void;
  onOpenLogin: () => void;
  onOpenAdmin: () => void;
  catalogProducts: ProductItem[];
  onAddToCart: (product: ProductItem) => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onNavigateHome,
  onNavigateProducts,
  onOpenQuote,
  onOpenLogin,
  onOpenAdmin,
  catalogProducts,
  onAddToCart,
}) => {
  const { user, userProfile } = useAuth();
  const initialLoc = getStoredLocation();
  // RFQ Submission Form state inside the cart page
  const [companyName, setCompanyName] = useState(userProfile?.companyName || '');
  const [gstin, setGstin] = useState(userProfile?.gstin || '');
  const [contactPerson, setContactPerson] = useState(userProfile?.displayName || user?.displayName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [city, setCity] = useState(initialLoc.formatted || 'Belagavi, Karnataka (590001)');
  const [pincodeInput, setPincodeInput] = useState(initialLoc.pincode || '590001');
  const [isDetectingPin, setIsDetectingPin] = useState(false);
  const [paymentTerms, setPaymentTerms] = useState('Trade Credit Line (30 Days)');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Suggested location hubs
  const locations = [
    'Belagavi, Karnataka (590001) - Main HQ',
    'Bengaluru, Karnataka (560001)',
    'Mumbai, Maharashtra (400001)',
    'Delhi NCR (110001)',
    'Ahmedabad, Gujarat (380001)',
    'Chennai, Tamil Nadu (600001)',
    'Kolkata, West Bengal (700001)',
    'Hyderabad, Telangana (500001)',
    'Pune, Maharashtra (411001)',
    'Surat, Gujarat (395003)',
    'Raipur, Chhattisgarh (492001)',
    'Mandi Gobindgarh, Punjab (147301)'
  ];

  const totalVolumeMT = cartItems.reduce((acc, item) => acc + item.quantityMT, 0);
  const subtotalINR = cartItems.reduce(
    (acc, item) => acc + item.product.numericPrice * item.quantityMT,
    0
  );
  const gstINR = Math.round(subtotalINR * 0.18);
  const grandTotalINR = subtotalINR + gstINR;

  const handleRfqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactPerson.trim() || !phone.trim()) {
      alert('Please enter your contact person name and 10-digit mobile number.');
      return;
    }
    setIsSubmitting(true);

    try {
      if (user) {
        await createOrder({
          userId: user.uid,
          companyName: companyName || 'Enterprise Buyer',
          contactPhone: phone,
          items: cartItems.map((ci) => ({
            id: ci.product.id,
            name: ci.product.name,
            category: ci.product.category,
            price: ci.product.numericPrice,
            quantity: ci.quantityMT,
            unit: ci.product.unit || 'MT',
          })),
          totalAmount: grandTotalINR,
          deliveryAddress: `${city} (${pincodeInput})`,
          pincode: pincodeInput,
          status: 'pending',
          paymentMethod: paymentTerms,
        });
      }
    } catch (err) {
      console.error('Failed to create order record in Firestore:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  // Recommended related items from catalog not yet in cart
  const recommendedProducts = catalogProducts
    .filter((p) => !cartItems.some((ci) => ci.product.id === p.id))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      
      {/* 1. TOP HEADER BAR - Constant with Homepage */}
      <header className="brand-gradient text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex items-center justify-between gap-4">
            
            {/* Left: Brand Logo & Location Selector (Constant as Homepage) */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <button
                onClick={onNavigateHome}
                className="flex items-center gap-1.5 sm:gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-lg"
                aria-label="Return to Homepage"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 xl:w-10 xl:h-10 rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-200 shrink-0 flex items-center justify-center">
                  <img
                    src="/logo.png"
                    alt="Bable Logo"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      if (target.parentElement) {
                        target.parentElement.innerHTML = '<span class="text-xs font-black text-blue-700 tracking-tighter">BABLE</span>';
                      }
                    }}
                  />
                </div>
                <div className="flex flex-col text-left shrink-0">
                  <div className="flex items-center gap-1">
                    <span className="text-base sm:text-lg xl:text-xl font-black tracking-tight leading-none text-white font-sans">
                      bable
                    </span>
                    <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-400"></span>
                  </div>
                  <span className="text-[8px] sm:text-[9px] xl:text-[10px] font-semibold tracking-wider text-teal-100 uppercase leading-tight">
                    Minerals & Energy
                  </span>
                </div>
              </button>

              {/* Location Selector (Constant with Homepage) */}
              <div className="hidden sm:block shrink-0">
                <LocationSelector variant="navbar" />
              </div>

              <div className="h-6 w-px bg-white/20 hidden sm:block" />

              <button
                type="button"
                onClick={onNavigateProducts}
                className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-white hover:text-amber-200 bg-white/15 hover:bg-white/25 border border-white/25 px-3 py-1.5 rounded-full transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Continue Shopping</span>
              </button>
            </div>

            {/* Center Title */}
            <div className="hidden md:flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/20 text-white flex items-center justify-center">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <span className="text-sm font-black text-white">
                Enterprise Procurement Cart
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 text-xs font-mono font-bold">
                {cartItems.length} items
              </span>
            </div>

            {/* Right: User Actions */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onOpenLogin}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold text-xs rounded-full shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* 2. BREADCRUMBS */}
      <div className="bg-white border-b border-slate-200 py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <button onClick={onNavigateHome} className="hover:text-blue-600 transition">
              Home
            </button>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <button onClick={onNavigateProducts} className="hover:text-blue-600 transition">
              Products Catalog
            </button>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-900 font-bold">Procurement Cart & RFQ</span>
          </nav>
        </div>
      </div>

      {/* 3. MAIN CONTENT CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        
        {/* Page Title & Overview Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Direct Mill Procurement Workflow</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Commercial Order Cart & Quotation
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              Review selected materials, adjust volume (MT), and submit a unified RFQ for instant spot rate locking.
            </p>
          </div>

          {cartItems.length > 0 && (
            <button
              type="button"
              onClick={onClearCart}
              className="self-start sm:self-auto text-xs font-bold text-rose-600 hover:text-rose-800 hover:underline flex items-center gap-1 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Cart</span>
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          /* EMPTY CART VIEW */
          <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center max-w-2xl mx-auto shadow-sm space-y-6 my-8">
            <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center shadow-inner">
              <ShoppingCart className="w-10 h-10 stroke-[1.5]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">Your Cart is Currently Empty</h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                You haven't added any raw materials or industrial commodities to your cart yet. Explore our 30 client categories across Steel, Chemicals, Energy, and Agri.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={onNavigateProducts}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full brand-gradient text-white font-bold text-sm shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2"
              >
                <Package className="w-4 h-4" />
                <span>Browse Products Catalog</span>
              </button>
              <button
                type="button"
                onClick={onNavigateHome}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition"
              >
                Back to Homepage
              </button>
            </div>
          </div>
        ) : (
          /* ACTIVE CART VIEW: 2 COLUMNS */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: ITEM LIST (8 COLS) */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-4">
              
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span>Selected Line Items ({cartItems.length})</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold font-mono">
                    Total Volume: {totalVolumeMT} MT
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="p-4 sm:p-6 space-y-4 hover:bg-slate-50/50 transition">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        
                        {/* Left: Thumbnail & Details */}
                        <div className="flex gap-4 items-start flex-1">
                          <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 p-2 shrink-0 flex items-center justify-center shadow-2xs">
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>

                          <div className="space-y-1 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                {item.product.categoryLabel}
                              </span>
                              <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                                Brand: {item.product.brand}
                              </span>
                            </div>

                            <h4 className="font-bold text-base text-slate-900 leading-snug">
                              {item.product.name}
                            </h4>

                            <div className="text-xs text-slate-500">
                              Grade / Standard: <strong className="text-slate-800 font-semibold">{item.product.grade}</strong>
                            </div>

                            {/* Specs grid */}
                            <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                              {Object.entries(item.product.specs).map(([k, v]) => (
                                <div key={k} className="p-1.5 rounded-lg bg-slate-100/70 border border-slate-200/50">
                                  <span className="text-[10px] text-slate-400 font-bold uppercase block">{k}</span>
                                  <span className="font-semibold text-slate-800 font-mono text-[11px]">{v}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Right: Line item price & remove */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                          <div className="text-right">
                            <span className="text-xs text-slate-400 block font-bold uppercase">Rate</span>
                            <span className="text-base font-black text-slate-900 font-mono">
                              {item.product.price}
                            </span>
                            <span className="text-xs text-slate-500 ml-0.5">{item.product.unit}</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-xs font-bold text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition flex items-center gap-1"
                            title="Remove from cart"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        </div>

                      </div>

                      {/* Quantity Selector & Location row */}
                      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50/80 p-3 rounded-xl border border-slate-200/60">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-700 uppercase">Quantity (MT):</span>
                          <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg p-1 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantityMT - 5))}
                              className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantityMT}
                              onChange={(e) => onUpdateQuantity(item.product.id, Math.max(1, Number(e.target.value)))}
                              className="w-16 text-center font-black text-sm font-mono text-blue-700 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.product.id, item.quantityMT + 5)}
                              className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Line subtotal */}
                        <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
                          <span className="text-slate-500 font-medium">Estimated Line Value:</span>
                          <span className="text-base font-black text-blue-700 font-mono">
                            ₹{(item.product.numericPrice * item.quantityMT).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* Quality & SLA Guarantee Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 to-slate-900 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-400/20 border border-teal-400/30 flex items-center justify-center text-teal-300 shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Guaranteed Quality Assurance</h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Includes Original Mill Test Certificates (MTC), NABL Chemical Analysis & Weighbridge Slips.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-300 bg-white/10 px-3 py-1.5 rounded-full border border-white/10 shrink-0">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Pan-India Port Logistics</span>
                </div>
              </div>

              {/* Recommended Add-ons */}
              {recommendedProducts.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4 shadow-2xs">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Frequently Procured Together</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {recommendedProducts.map((prod) => (
                      <div key={prod.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-2">
                        <div>
                          <span className="text-[9px] font-bold text-blue-600 bg-blue-100/60 px-1.5 py-0.5 rounded">
                            {prod.brand}
                          </span>
                          <h5 className="font-bold text-xs text-slate-900 mt-1 line-clamp-1">{prod.name}</h5>
                          <div className="text-xs font-mono font-bold text-blue-700 mt-1">
                            {prod.price} <span className="text-[10px] text-slate-500 font-normal">{prod.unit}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onAddToCart(prod)}
                          className="w-full py-1.5 px-3 rounded-lg bg-white border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold text-xs transition flex items-center justify-center gap-1 shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN: SUMMARY & RFQ SUBMISSION FORM (4 or 5 COLS) */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-6">
              
              {/* Order Cost Summary Box */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 space-y-5">
                <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
                  <span>Procurement Summary</span>
                  <span className="text-xs font-mono font-normal text-slate-500">Bable Spot Rate</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Total Consignment Weight</span>
                    <span className="font-bold text-slate-900 font-mono">{totalVolumeMT} MT</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Base Material Estimate</span>
                    <span className="font-semibold text-slate-900 font-mono">
                      ₹{subtotalINR.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span className="flex items-center gap-1">
                      <span>GST @ 18% (Industrial)</span>
                      <BadgePercent className="w-3.5 h-3.5 text-slate-400" />
                    </span>
                    <span className="font-semibold text-slate-900 font-mono">
                      ₹{gstINR.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Loading & Insurance</span>
                    <span className="font-semibold text-emerald-600 uppercase font-mono">INCLUDED</span>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                    <span className="text-sm font-black text-slate-900">Grand Total Estimate</span>
                    <span className="text-xl font-black text-blue-700 font-mono">
                      ₹{grandTotalINR.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Spot rates locked for <strong>24 hours</strong> upon RFQ submission.</span>
                </div>
              </div>

              {/* Direct Multi-Product RFQ Submission Form */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Submit Quotation Request</span>
                  </h3>
                  <p className="text-xs text-slate-500">Get an official commercial quote with GST invoice & payment terms</p>
                </div>

                {submitted ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in zoom-in-95 duration-200">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h4 className="font-bold text-base text-emerald-900">RFQ Successfully Submitted!</h4>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      Thank you, <strong>{contactPerson}</strong>! Our enterprise procurement team will review your {totalVolumeMT} MT order and send a formal commercial quotation to your mobile number within 2 hours.
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setSubmitted(false)}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline"
                      >
                        Submit another RFQ
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleRfqSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Company / Firm Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Apex Engineering Pvt Ltd"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                          Contact Person *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Full Name"
                          value={contactPerson}
                          onChange={(e) => setContactPerson(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="10-digit number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                          GSTIN (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="22AAAAA0000A1Z5"
                          value={gstin}
                          onChange={(e) => setGstin(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                          Destination Hub / PIN Code
                        </label>
                        <select
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-medium"
                        >
                          {locations.map((loc) => (
                            <option key={loc} value={loc}>
                              {loc}
                            </option>
                          ))}
                        </select>
                        
                        <div className="mt-1 flex items-center gap-1.5">
                          <input
                            type="text"
                            placeholder="PIN Code (e.g. 590001)"
                            value={pincodeInput}
                            onChange={async (e) => {
                              const val = e.target.value;
                              setPincodeInput(val);
                              if (val.length === 6) {
                                setIsDetectingPin(true);
                                const res = await detectLocationFromPincode(val);
                                if (res) {
                                  setCity(res.location.formatted);
                                }
                                setIsDetectingPin(false);
                              }
                            }}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-[11px] text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                          />
                        </div>
                        {isDetectingPin && (
                          <span className="text-[10px] text-blue-600 font-bold block animate-pulse">Detecting PIN...</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Preferred Credit / Payment Terms
                      </label>
                      <select
                        value={paymentTerms}
                        onChange={(e) => setPaymentTerms(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-medium"
                      >
                        <option value="Trade Credit Line (30 Days)">30-Day Bable Trade Credit Line</option>
                        <option value="Letter of Credit (LC)">Letter of Credit (LC at Sight)</option>
                        <option value="100% Advance Payment">Advance Payment (Cash Discount Eligible)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Additional Delivery Notes
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Mention specific length tolerances, unloading facilities, or target delivery date..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-4 rounded-xl brand-gradient hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition cursor-pointer disabled:opacity-50"
                    >
                      <FileText className="w-4 h-4" />
                      <span>{isSubmitting ? 'Submitting RFQ...' : 'Submit Commercial RFQ Now'}</span>
                    </button>
                  </form>
                )}
              </div>

            </div>

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="Bable" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-white">Bable Minerals and Energy Pvt Ltd</span>
            <span>© 2026</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onNavigateHome} className="hover:text-white transition">Home</button>
            <button onClick={onNavigateProducts} className="hover:text-white transition">Catalog</button>
          </div>
        </div>
      </footer>

    </div>
  );
};
