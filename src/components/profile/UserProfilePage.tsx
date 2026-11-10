import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Building2,
  FileSpreadsheet,
  Package,
  LogOut,
  MapPin,
  ShieldCheck,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Save,
  Check,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LocationSelector } from '../LocationSelector';
import {
  getUserProfile,
  saveUserProfile,
  fetchUserQuotes,
  fetchUserOrders,
  UserProfile,
  QuoteRequest,
  OrderRecord
} from '../../lib/firestoreService';

interface UserProfilePageProps {
  onNavigateHome: () => void;
  onNavigateProducts: () => void;
  onOpenQuote: () => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  onNavigateHome,
  onNavigateProducts,
  onOpenQuote,
}) => {
  const { user, userProfile, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'details' | 'quotes' | 'orders' | 'addresses'>('details');

  // Profile form state
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [companyName, setCompanyName] = useState('');
  const [gstin, setGstin] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Belagavi');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('590001');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Loaded quotes and orders
  const [userQuotes, setUserQuotes] = useState<QuoteRequest[]>([]);
  const [userOrders, setUserOrders] = useState<OrderRecord[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Sync profile details when loaded or available
  useEffect(() => {
    if (userProfile) {
      if (userProfile.displayName) setDisplayName(userProfile.displayName);
      if (userProfile.companyName) setCompanyName(userProfile.companyName);
      if (userProfile.gstin) setGstin(userProfile.gstin);
      if (userProfile.phone) setPhone(userProfile.phone);
      if (userProfile.city) setCity(userProfile.city);
      if (userProfile.state) setState(userProfile.state);
      if (userProfile.pincode) setPincode(userProfile.pincode);
    }
  }, [userProfile]);

  // Fetch Quotes & Orders for current user
  useEffect(() => {
    if (!user) return;
    const currentUid = user.uid;
    let isMounted = true;

    async function loadData() {
      setLoadingData(true);
      try {
        const [quotesData, ordersData] = await Promise.all([
          fetchUserQuotes(currentUid),
          fetchUserOrders(currentUid),
        ]);
        if (isMounted) {
          setUserQuotes(quotesData || []);
          setUserOrders(ordersData || []);
        }
      } catch (err) {
        console.error('Error loading profile data:', err);
      } finally {
        if (isMounted) setLoadingData(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError('');

    try {
      const updatedProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: displayName.trim() || user.displayName || 'Enterprise Member',
        companyName: companyName.trim(),
        gstin: gstin.trim(),
        phone: phone.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        role: userProfile?.role || 'buyer',
      };

      await saveUserProfile(updatedProfile);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setSaveError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    onNavigateHome();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center max-w-md w-full space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto font-bold">
            <UserIcon className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Sign In Required</h2>
          <p className="text-xs text-slate-600">Please sign in to access your Bable Enterprise Profile, orders, and contract quotes.</p>
          <button
            onClick={onNavigateHome}
            className="w-full py-3 brand-gradient text-white font-bold text-xs rounded-full shadow hover:opacity-95 transition"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Top Header Navigation Bar - Constant with Homepage */}
      <header className="brand-gradient text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
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
              onClick={onNavigateHome}
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-white hover:text-amber-200 bg-white/15 hover:bg-white/25 border border-white/25 px-3 py-1.5 rounded-full transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-teal-100 hidden sm:inline">
              Authenticated Session
            </span>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-500/20 hover:bg-red-500/30 text-white font-bold text-xs border border-red-400/40 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Profile Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative">
          <div className="h-32 brand-gradient relative p-6 flex items-end">
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-extrabold uppercase tracking-wider border border-white/30">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-200" />
              <span>Verified B2B Account</span>
            </div>
          </div>

          <div className="px-6 sm:px-8 pb-6 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12">
            <div className="flex items-end gap-4">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User Profile'}
                  className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg object-cover bg-white"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg bg-teal-600 text-white flex items-center justify-center font-black text-3xl">
                  {(user.displayName || user.email || 'B')[0].toUpperCase()}
                </div>
              )}

              <div className="space-y-1 mb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    {displayName || user.displayName || 'Enterprise Member'}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-extrabold text-[10px] uppercase">
                    {userProfile?.role || 'Buyer'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {user.email}
                  </span>
                  {phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <button
                onClick={onOpenQuote}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 font-bold text-xs border border-teal-200 transition flex items-center justify-center gap-1.5"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>New Quote Request</span>
              </button>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="border-t border-slate-100 bg-slate-50/50 px-6 sm:px-8 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Quotes Requested</p>
                <p className="text-lg font-black text-slate-900">{userQuotes.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Placed Orders</p>
                <p className="text-lg font-black text-slate-900">{userOrders.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Primary Location</p>
                <p className="text-sm font-bold text-slate-900 truncate">{city}, {pincode}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Credit Rating</p>
                <p className="text-sm font-bold text-slate-900">AAA Verified</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'details'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Profile & Business Details</span>
          </button>

          <button
            onClick={() => setActiveTab('quotes')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'quotes'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>My Quotes ({userQuotes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History ({userOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'addresses'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Delivery Hubs</span>
          </button>
        </div>

        {/* Tab 1: Profile & Business Details Form */}
        {activeTab === 'details' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Business & Billing Profile
                </h3>
                <p className="text-xs text-slate-500">
                  Manage your company details, GSTIN, and contact information for automated quotes and invoicing.
                </p>
              </div>
              <Building2 className="w-6 h-6 text-slate-400" />
            </div>

            {saveSuccess && (
              <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-200 flex items-center gap-3 text-xs font-bold animate-in fade-in">
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Profile details saved successfully to Firebase!</span>
              </div>
            )}

            {saveError && (
              <div className="bg-red-50 text-red-800 p-4 rounded-2xl border border-red-200 flex items-center gap-3 text-xs font-bold">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span>{saveError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Rajesh Patil"
                    className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Account Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email || ''}
                    className="w-full text-sm bg-slate-100 border border-slate-200 text-slate-500 rounded-xl px-4 py-3 font-medium cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Registered Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Belagavi Alloys & Steels Pvt Ltd"
                    className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    GSTIN Registration Number
                  </label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    placeholder="29AAAAA0000A1Z5"
                    className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Primary Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98450 12345"
                    className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Primary City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Belagavi"
                    className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    State / Region
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Karnataka"
                    className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="590001"
                    className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  User UID: <span className="font-mono text-slate-600">{user.uid}</span>
                </p>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3 brand-gradient text-white font-bold text-xs rounded-full shadow-md hover:opacity-95 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: User Quotes */}
        {activeTab === 'quotes' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  My Quotation Requests
                </h3>
                <p className="text-xs text-slate-500">
                  Track custom pricing, mill quotes, and dispatch availability.
                </p>
              </div>
              <button
                onClick={onOpenQuote}
                className="px-4 py-2 rounded-full brand-gradient text-white font-bold text-xs shadow hover:opacity-95 transition"
              >
                + Request New Quote
              </button>
            </div>

            {loadingData ? (
              <div className="py-12 text-center text-slate-400 text-xs font-bold">
                Loading quotation requests from database...
              </div>
            ) : userQuotes.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">No quotes requested yet</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Submit a custom requirement for Long Steel, Bitumen, Coal, or Agri inputs to get direct mill prices.
                </p>
                <button
                  onClick={onOpenQuote}
                  className="mt-2 px-5 py-2.5 rounded-full bg-blue-600 text-white font-bold text-xs shadow hover:bg-blue-700 transition"
                >
                  Get Instant Quotation
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {userQuotes.map((q) => (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">{q.productName}</span>
                        <span className="text-xs text-slate-500">({q.category})</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Quantity: <strong className="text-slate-900">{q.quantity} {q.unit || 'MT'}</strong> | Delivery: <strong className="text-slate-900">{q.deliveryLocation}</strong>
                      </p>
                      {q.companyName && (
                        <p className="text-[11px] text-slate-400">
                          Company: {q.companyName} ({q.contactName})
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      {q.quotedPrice ? (
                        <div className="text-right">
                          <p className="text-[10px] uppercase font-bold text-slate-400">Quoted Rate</p>
                          <p className="text-sm font-black text-emerald-600">₹{q.quotedPrice.toLocaleString('en-IN')}/{q.unit || 'MT'}</p>
                        </div>
                      ) : null}

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                          q.status === 'quoted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : q.status === 'accepted'
                            ? 'bg-blue-100 text-blue-800'
                            : q.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {q.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: User Orders */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Order History & Dispatches
                </h3>
                <p className="text-xs text-slate-500">
                  Review direct purchases, truck dispatch tracking, and mill invoices.
                </p>
              </div>
              <button
                onClick={onNavigateProducts}
                className="px-4 py-2 rounded-full brand-gradient text-white font-bold text-xs shadow hover:opacity-95 transition"
              >
                Browse Catalog
              </button>
            </div>

            {loadingData ? (
              <div className="py-12 text-center text-slate-400 text-xs font-bold">
                Loading order records from database...
              </div>
            ) : userOrders.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <Package className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">No orders placed yet</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Explore our materials catalog with transparent live prices to place your first order.
                </p>
                <button
                  onClick={onNavigateProducts}
                  className="mt-2 px-5 py-2.5 rounded-full bg-blue-600 text-white font-bold text-xs shadow hover:bg-blue-700 transition"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {userOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                      <div>
                        <span className="text-xs font-mono font-bold text-slate-400">Order ID: #{ord.id?.slice(0, 8)}</span>
                        <h4 className="text-sm font-extrabold text-slate-900">{ord.companyName || 'Enterprise Order'}</h4>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-blue-700">
                          ₹{ord.totalAmount?.toLocaleString('en-IN') || 'N/A'}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                            ord.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.status === 'shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : ord.status === 'processing'
                              ? 'bg-teal-100 text-teal-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600">
                      <p className="font-bold text-slate-800">Items:</p>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-1">
                        {ord.items?.map((it, idx) => (
                          <li key={idx}>
                            {it.name} — {it.quantity} {it.unit || 'MT'} @ ₹{it.price?.toLocaleString('en-IN')}
                          </li>
                        ))}
                      </ul>
                      <p className="pt-2 text-[11px] text-slate-500">
                        Delivery Address: {ord.deliveryAddress} ({ord.pincode})
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Saved Delivery Hubs */}
        {activeTab === 'addresses' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Saved Procurement Hubs & Warehouses
                </h3>
                <p className="text-xs text-slate-500">
                  Primary delivery locations for automated dispatch and freight calculations.
                </p>
              </div>
              <MapPin className="w-6 h-6 text-slate-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border-2 border-teal-500 bg-teal-50/20 relative space-y-2">
                <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-teal-600 text-white font-extrabold text-[10px] uppercase">
                  Primary Hub
                </span>
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <MapPin className="w-4 h-4 text-teal-600" />
                  <span>Belagavi Warehouse Hub</span>
                </div>
                <p className="text-xs text-slate-600">
                  {city || 'Belagavi'}, Karnataka — {pincode || '590001'}
                </p>
                <p className="text-[11px] text-slate-400">
                  Nearest Rail Siding: Desur / Belagavi Industrial Estate
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 relative space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>Secondary Plant Location</span>
                </div>
                <p className="text-xs text-slate-600">
                  Hubli-Dharwad Industrial Zone, Karnataka — 580020
                </p>
                <p className="text-[11px] text-slate-400">
                  Available for direct truck dispatches
                </p>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
