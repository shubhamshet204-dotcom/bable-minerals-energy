import React, { useState, useRef, useEffect } from 'react';
import { LocationSelector } from './LocationSelector';
import {
  ChevronDown,
  Layers,
  FlaskConical,
  Flame,
  Wheat,
  Building2,
  ShieldCheck,
  Cpu,
  PhoneCall,
  Menu,
  X,
  UserCheck,
  User as UserIcon,
  LogOut,
  TrendingUp,
  FileSpreadsheet,
  ShoppingCart,
  Package
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenLogin: () => void;
  onOpenQuote: (defaultCategory?: string, defaultProduct?: string) => void;
  onOpenUnits: () => void;
  onOpenAdmin?: () => void;
  onOpenProfile?: () => void;
  onNavigateCategory?: (category: string, subCategory?: string) => void;
  onOpenProducts?: () => void;
  onOpenCart?: () => void;
  cartCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenLogin,
  onOpenQuote,
  onOpenUnits,
  onOpenAdmin,
  onOpenProfile,
  onNavigateCategory,
  onOpenProducts,
  onOpenCart,
  cartCount = 0,
}) => {
  const { user, logout } = useAuth();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const categoriesRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target as Node)) {
        setCategoriesOpen(false);
      }
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) {
        setAboutOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setCategoriesOpen(false);
    setAboutOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full max-w-full overflow-x-clip transition-all duration-300">
      {/* Main Gradient Bar */}
      <div className={`brand-gradient text-white shadow-md transition-all duration-200 ${isScrolled ? 'py-1.5 shadow-lg' : 'py-2.5'}`}>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 w-full">
          <div className="flex items-center justify-between gap-1.5 sm:gap-2 lg:gap-2.5 xl:gap-4">
            {/* Left: Brand Logo & Wordmark */}
            <a
              href="#"
              className="flex items-center gap-1.5 sm:gap-2 shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-lg"
              aria-label="Bable Minerals and Energy Pvt Ltd"
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
              <div className="flex flex-col shrink-0">
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
            </a>

            {/* Location Selector (Single Location Selector on Homepage) */}
            <div className="hidden sm:block shrink-0">
              <LocationSelector variant="navbar" />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink-0">
              {/* Categories Dropdown */}
              <div className="relative" ref={categoriesRef}>
                <button
                  type="button"
                  onClick={() => {
                    setCategoriesOpen(!categoriesOpen);
                    setAboutOpen(false);
                  }}
                  className={`h-8 xl:h-9 inline-flex items-center gap-1 px-2.5 xl:px-3.5 rounded-full text-xs xl:text-sm font-medium transition-colors whitespace-nowrap ${
                    categoriesOpen ? 'bg-white/20 text-white' : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                  aria-expanded={categoriesOpen}
                >
                  <span>Categories</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`} />
                </button>

                {categoriesOpen && (
                  <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 text-slate-800 animate-in fade-in zoom-in-95 duration-150 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Procurement Verticals</p>
                      {onOpenProducts && (
                        <button
                          onClick={() => {
                            setCategoriesOpen(false);
                            onOpenProducts();
                          }}
                          className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          All Products →
                        </button>
                      )}
                    </div>
                    <div className="p-2 space-y-1">
                      <button
                        onClick={() => {
                          setCategoriesOpen(false);
                          if (onNavigateCategory) {
                            onNavigateCategory('metals');
                          } else {
                            scrollToSection('category-metals');
                          }
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-xl hover:bg-slate-50 transition text-sm font-medium text-slate-700 hover:text-blue-600"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">Metals & Steel</div>
                          <div className="text-xs text-slate-500">CR/HR Sheets, Coils, TMT, Beams</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setCategoriesOpen(false);
                          if (onNavigateCategory) {
                            onNavigateCategory('chemicals');
                          } else {
                            scrollToSection('category-chemicals');
                          }
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-xl hover:bg-slate-50 transition text-sm font-medium text-slate-700 hover:text-teal-600"
                      >
                        <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                          <FlaskConical className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">Chemicals & Bitumen</div>
                          <div className="text-xs text-slate-500">Solvents, VG-30 Bitumen, Polymers</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setCategoriesOpen(false);
                          if (onNavigateCategory) {
                            onNavigateCategory('energy-minerals');
                          } else {
                            scrollToSection('category-energy-minerals');
                          }
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-xl hover:bg-slate-50 transition text-sm font-medium text-slate-700 hover:text-amber-600"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                          <Flame className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">Energy & Minerals</div>
                          <div className="text-xs text-slate-500">Imported Coal, Petcoke, Limestone</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setCategoriesOpen(false);
                          if (onNavigateCategory) {
                            onNavigateCategory('agri');
                          } else {
                            scrollToSection('category-agri');
                          }
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-xl hover:bg-slate-50 transition text-sm font-medium text-slate-700 hover:text-emerald-600"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <Wheat className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">Agri Commodities & Inputs</div>
                          <div className="text-xs text-slate-500">Grains, Rice, Cotton, Fertilizers</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setCategoriesOpen(false);
                          if (onNavigateCategory) {
                            onNavigateCategory('industrial-materials');
                          } else {
                            scrollToSection('category-industrial-materials');
                          }
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-xl hover:bg-slate-50 transition text-sm font-medium text-slate-700 hover:text-indigo-600"
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">Industrial & Engineering</div>
                          <div className="text-xs text-slate-500">Construction, Machinery, Safety</div>
                        </div>
                      </button>
                    </div>

                    <div className="px-3 pt-2 pb-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setCategoriesOpen(false);
                          if (onOpenProducts) onOpenProducts();
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <span>View Product Catalog (MSME Format)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* About Us Dropdown */}
              <div className="relative" ref={aboutRef}>
                <button
                  type="button"
                  onClick={() => {
                    setAboutOpen(!aboutOpen);
                    setCategoriesOpen(false);
                  }}
                  className={`h-8 xl:h-9 inline-flex items-center gap-1 px-2.5 xl:px-3.5 rounded-full text-xs xl:text-sm font-medium transition-colors whitespace-nowrap ${
                    aboutOpen ? 'bg-white/20 text-white' : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                  aria-expanded={aboutOpen}
                >
                  <span>About Us</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${aboutOpen ? 'rotate-180' : ''}`} />
                </button>

                {aboutOpen && (
                  <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 text-slate-800 animate-in fade-in zoom-in-95 duration-150 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Enterprise Overview</p>
                    </div>
                    <div className="p-2 space-y-1">
                      <button
                        onClick={() => scrollToSection('why-choose-us')}
                        className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-xl hover:bg-slate-50 text-sm font-medium text-slate-700 hover:text-blue-600"
                      >
                        <ShieldCheck className="w-4 h-4 text-blue-500" />
                        <span>Why Bable Platform</span>
                      </button>
                      <button
                        onClick={() => {
                          setAboutOpen(false);
                          onOpenUnits();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-xl hover:bg-slate-50 text-sm font-medium text-slate-700 hover:text-blue-600"
                      >
                        <Building2 className="w-4 h-4 text-blue-500" />
                        <span>Manufacturing Units & Hubs</span>
                      </button>
                      <button
                        onClick={() => scrollToSection('how-it-works')}
                        className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-xl hover:bg-slate-50 text-sm font-medium text-slate-700 hover:text-blue-600"
                      >
                        <Cpu className="w-4 h-4 text-blue-500" />
                        <span>In-House Tech & Process</span>
                      </button>
                      <button
                        onClick={() => scrollToSection('footer')}
                        className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-xl hover:bg-slate-50 text-sm font-medium text-slate-700 hover:text-blue-600"
                      >
                        <PhoneCall className="w-4 h-4 text-blue-500" />
                        <span>Corporate Offices & Contact</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Link: Products Catalog */}
              {onOpenProducts && (
                <button
                  type="button"
                  onClick={onOpenProducts}
                  className="h-8 xl:h-9 inline-flex items-center gap-1 px-2 xl:px-3 rounded-full text-xs xl:text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition whitespace-nowrap"
                >
                  <Package className="w-3.5 h-3.5 text-teal-300" />
                  <span>Products</span>
                </button>
              )}

              {/* Direct Link: Live Prices */}
              <button
                type="button"
                onClick={() => scrollToSection('live-prices-section')}
                className="h-8 xl:h-9 hidden xl:inline-flex items-center gap-1 px-2 xl:px-3 rounded-full text-xs xl:text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition whitespace-nowrap"
              >
                <TrendingUp className="w-3.5 h-3.5 text-teal-200" />
                <span>Live Prices</span>
              </button>

              {/* Direct Link: Smart Financing */}
              <button
                type="button"
                onClick={() => scrollToSection('smart-financing-card')}
                className="h-8 xl:h-9 hidden 2xl:inline-flex items-center gap-1 px-2 xl:px-3 rounded-full text-xs xl:text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition whitespace-nowrap"
              >
                <span>Financing</span>
              </button>
            </nav>

            {/* Right: Actions */}
            <div className="hidden md:flex items-center gap-1 xl:gap-2 shrink-0">
              {/* Cart Button */}
              {onOpenCart && (
                <button
                  type="button"
                  onClick={onOpenCart}
                  className="h-8 xl:h-8.5 relative inline-flex items-center gap-1 px-2 xl:px-3 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition border border-white/20 whitespace-nowrap leading-none shrink-0"
                  aria-label="View Procurement Cart"
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-teal-300" />
                  <span>Cart</span>
                  {cartCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black inline-flex items-center justify-center leading-none">
                      {cartCount}
                    </span>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={() => onOpenQuote()}
                className="h-8 xl:h-8.5 inline-flex items-center gap-1 px-2.5 xl:px-3.5 text-[10px] xl:text-[11px] font-bold uppercase tracking-wider text-teal-950 bg-teal-200 hover:bg-teal-100 rounded-full transition shadow-xs hover:shadow whitespace-nowrap leading-none shrink-0"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Get Instant Quote</span>
                <span className="inline sm:hidden">Quote</span>
              </button>

              {user ? (
                <button
                  type="button"
                  onClick={onOpenProfile}
                  className="h-8 xl:h-8.5 inline-flex items-center gap-1.5 px-3 xl:px-4 bg-white text-blue-800 hover:bg-slate-50 font-bold text-xs xl:text-sm rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap leading-none shrink-0 border border-blue-100"
                >
                  <div className="w-5 h-5 rounded-full bg-teal-600 text-white font-black text-[10px] flex items-center justify-center uppercase shrink-0">
                    {(user.displayName || user.email || 'U')[0]}
                  </div>
                  <span>Profile</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="h-8 xl:h-8.5 inline-flex items-center gap-1 px-2.5 sm:px-3 xl:px-4 bg-white text-blue-700 hover:bg-slate-50 font-bold text-xs xl:text-sm rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap leading-none shrink-0"
                >
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Login</span>
                </button>
              )}
            </div>

            {/* Mobile Hamburger Button & Cart */}
            <div className="flex md:hidden items-center gap-1.5">
              {onOpenCart && (
                <button
                  type="button"
                  onClick={onOpenCart}
                  className="relative min-w-[42px] min-h-[42px] p-2 bg-white/20 text-white rounded-full border border-white/30 flex items-center justify-center cursor-pointer"
                  aria-label="View Cart"
                >
                  <ShoppingCart className="w-4 h-4 text-teal-300" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-900 text-[9px] font-black flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              )}
              {user ? (
                <button
                  type="button"
                  onClick={onOpenProfile}
                  className="min-h-[40px] px-3.5 py-1.5 bg-white text-blue-800 font-bold text-xs rounded-full shadow-sm flex items-center gap-1 cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5 text-teal-600" />
                  <span>Profile</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="min-h-[40px] px-3.5 py-1.5 bg-white text-blue-700 font-bold text-xs rounded-full shadow-sm cursor-pointer"
                >
                  Login
                </button>
              )}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="min-w-[42px] min-h-[42px] p-2 rounded-lg text-white hover:bg-white/10 flex items-center justify-center focus:outline-none cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Location Quick-Strip (Always Visible on Smartphones) */}
      <div className="sm:hidden bg-[#07172C] text-white px-3.5 py-1.5 flex items-center justify-between text-xs border-t border-white/10 shadow-inner">
        <LocationSelector variant="navbar" />
        <div className="flex items-center gap-1.5 text-[11px] text-teal-300 font-medium shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Live Mill Dispatch</span>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white text-slate-800 border-b border-slate-200 px-4 py-4 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
          {/* Location Selector Mobile Header */}
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Delivery Location:</span>
            <LocationSelector variant="compact" />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 py-1">Procurement Categories</p>
            <button
              onClick={() => scrollToSection('category-metals')}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-blue-600" /> Metals & Steel
            </button>
            <button
              onClick={() => scrollToSection('category-chemicals')}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg flex items-center gap-2"
            >
              <FlaskConical className="w-4 h-4 text-teal-600" /> Chemicals & Polymers
            </button>
            <button
              onClick={() => scrollToSection('category-energy-minerals')}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg flex items-center gap-2"
            >
              <Flame className="w-4 h-4 text-amber-600" /> Energy & Minerals (Coal/Petcoke)
            </button>
            <button
              onClick={() => scrollToSection('category-agri')}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg flex items-center gap-2"
            >
              <Wheat className="w-4 h-4 text-emerald-600" /> Agri & Commodities
            </button>
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 py-1">Quick Actions</p>
            {user && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenProfile) onOpenProfile();
                }}
                className="w-full text-left px-3 py-2 text-sm font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg flex items-center gap-2"
              >
                <UserIcon className="w-4 h-4 text-teal-600" />
                <span>My Profile & Quotes</span>
              </button>
            )}
            {onOpenProducts && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenProducts();
                }}
                className="w-full text-left px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 rounded-lg flex items-center gap-2"
              >
                <Package className="w-4 h-4 text-blue-600" />
                <span>Browse Products Catalog</span>
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuote();
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              Request Custom Quotation
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenUnits();
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              View 5 Manufacturing Units
            </button>
            <button
              onClick={() => scrollToSection('live-prices-section')}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              Today's Live Mandi Ticker
            </button>
          </div>

          <div className="pt-2 space-y-2">
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full py-2.5 text-center text-sm font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-full flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuote();
                }}
                className="w-full py-2.5 text-center text-sm font-bold text-white brand-gradient rounded-full shadow-md"
              >
                Get Instant Quote
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
