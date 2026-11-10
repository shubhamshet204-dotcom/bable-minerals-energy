import React, { useState, useEffect } from 'react';
import {
  X,
  FileSpreadsheet,
  CheckCircle2,
  Building,
  MapPin,
  Truck,
  ShieldCheck,
  Coins,
  ArrowRight
} from 'lucide-react';
import categoriesData from '../data/categories.json';
import livePricesData from '../data/livePrices.json';
import { getStoredLocation, detectLocationFromPincode } from '../utils/location';
import { useAuth } from '../context/AuthContext';
import { createQuote } from '../lib/firestoreService';

interface GetQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: string;
  defaultProduct?: string;
}

export const GetQuoteModal: React.FC<GetQuoteModalProps> = ({
  isOpen,
  onClose,
  defaultCategory,
  defaultProduct,
}) => {
  const { user, userProfile } = useAuth();
  const initialLoc = getStoredLocation();
  const [category, setCategory] = useState<string>(defaultCategory || 'Metals');
  const [product, setProduct] = useState<string>(defaultProduct || 'Long Steel');
  const [quantity, setQuantity] = useState<number>(50);
  const [deliveryCity, setDeliveryCity] = useState<string>(initialLoc.formatted || 'Belagavi, Karnataka (590001)');
  const [pinCode, setPinCode] = useState<string>(initialLoc.pincode || '590001');
  const [isDetectingPin, setIsDetectingPin] = useState<boolean>(false);
  const [paymentMode, setPaymentMode] = useState<'cash' | 'credit'>('credit');
  const [companyName, setCompanyName] = useState<string>(userProfile?.companyName || '');
  const [contactName, setContactName] = useState<string>(userProfile?.displayName || user?.displayName || '');
  const [phoneNumber, setPhoneNumber] = useState<string>(userProfile?.phone || '');
  const [email, setEmail] = useState<string>(userProfile?.email || user?.email || '');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [quoteRefId, setQuoteRefId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (defaultCategory) setCategory(defaultCategory);
    if (defaultProduct) setProduct(defaultProduct);
    if (userProfile || user) {
      if (userProfile?.companyName) setCompanyName(userProfile.companyName);
      if (userProfile?.displayName || user?.displayName) setContactName(userProfile?.displayName || user?.displayName || '');
      if (userProfile?.phone) setPhoneNumber(userProfile.phone);
      if (userProfile?.email || user?.email) setEmail(userProfile?.email || user?.email || '');
    }
  }, [defaultCategory, defaultProduct, userProfile, user]);

  if (!isOpen) return null;

  // Selected category items
  const currentCategoryData = categoriesData.find(
    (c) => c.name.toLowerCase() === category.toLowerCase() || c.id === category.toLowerCase()
  ) || categoriesData[0];

  // Base price lookup estimation
  const benchmarkItem = livePricesData.prices.find(
    (p) => p.category.toLowerCase().includes(category.toLowerCase()) || p.name.toLowerCase().includes(product.toLowerCase())
  ) || livePricesData.prices[0];

  const estimatedUnitRate = benchmarkItem ? benchmarkItem.numericPrice : 55000;
  const estimatedMaterialTotal = estimatedUnitRate * quantity;
  const estimatedFreight = Math.round(quantity * 850);
  const estimatedTotal = estimatedMaterialTotal + estimatedFreight;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newRefId = `BME-RFQ-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Save to Firestore backend if user is logged in
    try {
      if (user) {
        await createQuote({
          userId: user.uid,
          companyName: companyName || 'Enterprise Buyer',
          contactName: contactName || 'Buyer',
          email: email || user.email || '',
          phone: phoneNumber || '',
          category,
          productName: product,
          quantity,
          unit: 'MT',
          deliveryLocation: `${deliveryCity} (${pinCode})`,
          notes: `Payment Mode: ${paymentMode.toUpperCase()}`,
          status: 'pending',
          quotedPrice: estimatedTotal,
        });
      }
    } catch (err) {
      console.error('Failed to persist quote to Firestore backend:', err);
    } finally {
      setIsSubmitting(false);
    }

    setQuoteRefId(newRefId);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-8">
        
        {/* Header */}
        <div className="brand-gradient text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">Request Instant RFQ / Wholesale Quote</h3>
              <p className="text-xs text-teal-100">Live mill gate rates & door-delivery estimation</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          /* Confirmation Screen */
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="max-w-md mx-auto">
              <h4 className="text-2xl font-black text-slate-900 mb-2">
                Quotation Request Submitted!
              </h4>
              <p className="text-sm text-slate-600 mb-4">
                Thank you, <strong className="text-slate-800">{contactName || 'Valued Buyer'}</strong>. Your RFQ has been logged with reference number:
              </p>
              <div className="inline-block bg-slate-100 px-4 py-2 rounded-xl font-mono text-base font-bold text-blue-700 border border-slate-200">
                {quoteRefId}
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 max-w-md mx-auto text-left text-xs text-slate-700 space-y-2 border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Commodity:</span>
                <span className="font-bold">{product} ({category})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Order Quantity:</span>
                <span className="font-bold">{quantity} MT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Destination:</span>
                <span className="font-bold">{deliveryCity} (PIN: {pinCode})</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-blue-700">
                <span>Indicative Total:</span>
                <span>₹{estimatedTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Our commodity desk in Belagavi is reviewing mill inventory. A formal stamp-signed proforma invoice will be sent to <strong>{email || 'your email'}</strong> within 30 minutes.
            </p>

            <button
              type="button"
              onClick={handleReset}
              className="brand-gradient text-white font-bold text-sm px-8 py-3 rounded-full shadow-md hover:opacity-95 transition"
            >
              Done & Return to Catalog
            </button>
          </div>
        ) : (
          /* Form Screen */
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            
            {/* Step 1: Category & Material Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                1. Select Category & Material
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {categoriesData.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setCategory(cat.name);
                      setProduct(cat.items[0].name);
                    }}
                    className={`px-3 py-2 text-xs font-bold rounded-xl border transition cursor-pointer text-center ${
                      category.toLowerCase() === cat.name.toLowerCase()
                        ? 'bg-blue-50 border-blue-600 text-blue-700'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Sub product dropdown */}
              <select
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                {currentCategoryData.items.map((it) => (
                  <option key={it.id} value={it.name}>
                    {it.name} - {it.spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Quantity & Logistics Destination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Volume Required (Metric Tons / MT)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="50000"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                    className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-xs font-bold text-slate-500 shrink-0">MT</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Delivery Destination / PIN Code
                </label>
                <div className="space-y-2">
                  <select
                    value={deliveryCity}
                    onChange={(e) => {
                      setDeliveryCity(e.target.value);
                    }}
                    className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="Belagavi, Karnataka (590001)">Belagavi, Karnataka (590001) - Main HQ</option>
                    {livePricesData.cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter 6-digit PIN (e.g. 590001)"
                      value={pinCode}
                      onChange={async (e) => {
                        const val = e.target.value;
                        setPinCode(val);
                        if (val.length === 6) {
                          setIsDetectingPin(true);
                          const res = await detectLocationFromPincode(val);
                          if (res) {
                            setDeliveryCity(res.location.formatted);
                          }
                          setIsDetectingPin(false);
                        }
                      }}
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {isDetectingPin && (
                    <span className="text-[11px] text-blue-600 font-semibold block animate-pulse">
                      Detecting location for PIN {pinCode}...
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Step 3: Payment Preference */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Payment & Financing Preference
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMode('credit')}
                  className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 cursor-pointer ${
                    paymentMode === 'credit'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-1 ring-blue-500'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Coins className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold">Bable Trade Credit</div>
                    <div className="text-[11px] text-slate-500">30 - 90 Days tenor, 0% advance</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMode('cash')}
                  className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 cursor-pointer ${
                    paymentMode === 'cash'
                      ? 'border-teal-600 bg-teal-50/70 text-teal-900 ring-1 ring-teal-500'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold">Direct RTGS / Escrow</div>
                    <div className="text-[11px] text-slate-500">Special 1.5% upfront cash rebate</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Real-time estimation box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Indicative Mill Rate ({benchmarkItem.unit}):</span>
                <span className="font-bold">₹{estimatedUnitRate.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Multimodal Freight to {deliveryCity}:</span>
                <span className="font-bold">₹{estimatedFreight.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
                <span>Estimated Landed Consignment Total:</span>
                <span className="text-blue-700 font-extrabold text-base">₹{estimatedTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Step 4: Company & Contact details */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Buyer Contact Details
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Company / Entity Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="text"
                  required
                  placeholder="Procurement Officer Name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="tel"
                  required
                  placeholder="Official Mobile (for OTP & Dispatch)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="email"
                  required
                  placeholder="Corporate Work Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full brand-gradient text-white font-bold text-base py-3.5 rounded-full shadow-lg hover:opacity-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Submitting to Backend...' : 'Generate Official Firm Quotation'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-center text-slate-400 mt-2">
                100% price lock guaranteed for 24 hours upon issuance.
              </p>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
