import React, { useState, useMemo } from 'react';
import {
  Search,
  ShoppingCart,
  ChevronDown,
  ChevronRight,
  Filter,
  Truck,
  ArrowLeft,
  X,
  SlidersHorizontal,
  Check,
  Building,
  ShieldCheck,
  Package,
  Layers,
  HelpCircle,
  PhoneCall,
  UserCheck
} from 'lucide-react';
import { ProductItem, FilterState } from '../../types/product';
import { Category, CategorySubItem } from '../../types';
import { LocationSelector } from '../LocationSelector';

interface ProductListingPageProps {
  products: ProductItem[];
  selectedCategory: string; // e.g. 'metals', 'chemicals', 'energy-minerals', 'agri' or 'all'
  selectedSubCategory?: string;
  onNavigateHome: () => void;
  onSelectCategory: (category: string, subCategory?: string) => void;
  onOpenQuote: (category?: string, product?: string) => void;
  onOpenLogin: () => void;
  onOpenAdmin: () => void;
  onAddToCart?: (product: ProductItem) => void;
  cartCount?: number;
  onOpenCart?: () => void;
  customCategories?: Category[];
  onOpenCommodityDesk?: () => void;
}

const isProductInSubCategory = (p: ProductItem, subCatId: string, subCatName?: string) => {
  if (!subCatId) return true;
  const sId = subCatId.toLowerCase();
  const sLabel = (subCatName || '').toLowerCase();

  const pSub = (p.subCategory || '').toLowerCase();
  const pSubLabel = (p.subCategoryLabel || '').toLowerCase();
  const pName = (p.name || '').toLowerCase();
  const pBrand = (p.brand || '').toLowerCase();
  const pGrade = (p.grade || '').toLowerCase();

  if (pSub === sId || pSubLabel === sLabel) return true;
  if (sId && pSub.includes(sId)) return true;
  if (sLabel && pSubLabel.includes(sLabel)) return true;

  // Keyword check: e.g. "long", "flat", "stainless", "steel", "aluminium", "copper", "zinc", "bitumen", "coal"
  const keywords = [...sLabel.split(/\s+/), ...sId.split(/[-_\s]+/)]
    .map((k) => k.trim().toLowerCase())
    .filter((k) => k.length > 2);

  if (keywords.length > 0) {
    const combined = `${pSub} ${pSubLabel} ${pName} ${pBrand} ${pGrade}`;
    if (keywords.some((k) => combined.includes(k))) {
      return true;
    }
  }
  return false;
};

export const ProductListingPage: React.FC<ProductListingPageProps> = ({
  products,
  selectedCategory,
  selectedSubCategory,
  onNavigateHome,
  onSelectCategory,
  onOpenQuote,
  onOpenLogin,
  onOpenAdmin,
  onAddToCart,
  cartCount = 0,
  onOpenCart,
  customCategories,
  onOpenCommodityDesk,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Sub-header dropdown state ('mild-steel' | 'structural-steel' | 'tmt-rebars' | 'help' | null)
  const [activeNavDropdown, setActiveNavDropdown] = useState<'mild-steel' | 'structural-steel' | 'tmt-rebars' | 'help' | null>(null);

  // Accordion toggle states
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [gradeOpen, setGradeOpen] = useState(true);
  const [brandOpen, setBrandOpen] = useState(true);

  // Filter selections
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
    selectedSubCategory ? [selectedSubCategory] : []
  );
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  // Selected product detail modal
  const [inspectProduct, setInspectProduct] = useState<ProductItem | null>(null);

  // Dynamic filter lists from current products
  const categoryProducts = useMemo(() => {
    if (selectedCategory === 'all') return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  const availableSubCategories = useMemo(() => {
    // 1. Get items from customCategories if available
    const catObj = customCategories?.find((c: Category) => c.id === selectedCategory);
    if (catObj && catObj.items && catObj.items.length > 0) {
      return catObj.items.map((it: CategorySubItem) => {
        const count = categoryProducts.filter((p) => isProductInSubCategory(p, it.id, it.name)).length;
        return { id: it.id, label: it.name, count };
      });
    }

    // 2. Otherwise fall back to grouping products
    const map = new Map<string, { label: string; count: number }>();
    categoryProducts.forEach((p) => {
      const existing = map.get(p.subCategory) || { label: p.subCategoryLabel || p.subCategory, count: 0 };
      existing.count += 1;
      map.set(p.subCategory, existing);
    });
    return Array.from(map.entries()).map(([id, val]) => ({ id, ...val }));
  }, [categoryProducts, customCategories, selectedCategory]);

  const availableGrades = useMemo(() => {
    const set = new Set<string>();
    categoryProducts.forEach((p) => {
      if (p.grade) set.add(p.grade);
    });
    return Array.from(set);
  }, [categoryProducts]);

  const availableBrands = useMemo(() => {
    const set = new Set<string>();
    categoryProducts.forEach((p) => {
      if (p.brand) set.add(p.brand);
    });
    return Array.from(set);
  }, [categoryProducts]);

  // Filter logic
  const filteredProducts = useMemo(() => {
    return categoryProducts.filter((p) => {
      // Subcategory filter
      if (selectedSubCategories.length > 0) {
        const match = selectedSubCategories.some((subId) => {
          const subName = availableSubCategories.find((s: { id: string; label: string; count: number }) => s.id === subId)?.label;
          return isProductInSubCategory(p, subId, subName);
        });
        if (!match) return false;
      }
      // Grade filter
      if (selectedGrades.length > 0 && !selectedGrades.includes(p.grade)) {
        return false;
      }
      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(query);
        const matchBrand = p.brand.toLowerCase().includes(query);
        const matchGrade = p.grade.toLowerCase().includes(query);
        const matchSub = p.subCategoryLabel.toLowerCase().includes(query);
        return matchName || matchBrand || matchGrade || matchSub;
      }
      return true;
    });
  }, [categoryProducts, selectedSubCategories, availableSubCategories, selectedGrades, selectedBrands, searchQuery]);

  const clearAllFilters = () => {
    setSelectedSubCategories([]);
    setSelectedGrades([]);
    setSelectedBrands([]);
    setSearchQuery('');
  };

  const toggleSubCategory = (subCatId: string) => {
    setSelectedSubCategories((prev) =>
      prev.includes(subCatId) ? prev.filter((id) => id !== subCatId) : [...prev, subCatId]
    );
  };

  const toggleGrade = (grade: string) => {
    setSelectedGrades((prev) =>
      prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Category labels for titles and breadcrumbs
  const categoryTitles: Record<string, string> = {
    metals: 'Metals & Metallurgy',
    chemicals: 'Industrial & Specialty Chemicals',
    'energy-minerals': 'Energy, Coal & Minerals',
    agri: 'Agri & Agricultural Commodities',
    'industrial-materials': 'Industrial & Manufacturing Goods',
    all: 'All Industrial Products',
  };

  const activeCategoryTitle = categoryTitles[selectedCategory] || 'MS Cold rolled';
  const activeSubTitle =
    selectedSubCategories.length === 1
      ? availableSubCategories.find((s) => s.id === selectedSubCategories[0])?.label || activeCategoryTitle
      : activeCategoryTitle;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      
      {/* 1. TOP HEADER BAR - Constant with Homepage */}
      <header className="brand-gradient text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            
            {/* Left: Brand Logo & Location Selector (Constant as Homepage) */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <button
                onClick={onNavigateHome}
                className="flex items-center gap-1.5 sm:gap-2 shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-lg"
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
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder='Search "TATA Cold Rolled Sheets", "Fe 550D TMT", "VG-30 Bitumen"...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white text-slate-800 placeholder-slate-400 rounded-lg pl-10 pr-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm transition"
                />
              </div>
            </div>

            {/* Right: Cart & Login Actions */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={onOpenCart}
                className="flex items-center gap-1.5 px-3 py-2 text-white hover:text-amber-300 text-xs font-bold rounded-lg hover:bg-white/10 transition relative cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-900 font-mono text-[10px] flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={onOpenLogin}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold text-xs sm:text-sm rounded-lg shadow-sm transition cursor-pointer"
              >
                Login
              </button>
            </div>

          </div>
        </div>

        {/* Secondary Category Navigation Strip with Interactive Dropdowns */}
        <div className="border-t border-slate-100 bg-white relative z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6 py-2 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-1">
              
              {/* 1. Mild Steel Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setActiveNavDropdown((prev) => (prev === 'mild-steel' ? null : 'mild-steel'))
                  }
                  className={`flex items-center gap-1 hover:text-blue-600 transition cursor-pointer py-1 ${
                    activeNavDropdown === 'mild-steel' ? 'text-blue-600 font-bold' : ''
                  }`}
                >
                  <span>Mild Steel</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      activeNavDropdown === 'mild-steel' ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>

                {activeNavDropdown === 'mild-steel' && (
                  <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 text-slate-800 animate-in fade-in zoom-in-95 duration-150 z-50">
                    <div className="px-3 py-1.5 border-b border-slate-100 font-bold text-[10px] uppercase text-slate-400">
                      Mild Steel (MS) Products
                    </div>
                    <div className="space-y-0.5 pt-1">
                      <button
                        onClick={() => {
                          onSelectCategory('metals', 'flat-steel');
                          setSelectedSubCategories(['flat-steel']);
                          setActiveNavDropdown(null);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 transition text-xs font-semibold text-slate-800 hover:text-blue-600 flex justify-between items-center"
                      >
                        <span>HR Coils & Sheets (Hot Rolled)</span>
                        <span className="text-[10px] text-slate-400">IS 2062</span>
                      </button>
                      <button
                        onClick={() => {
                          onSelectCategory('metals', 'flat-steel');
                          setSelectedSubCategories(['flat-steel']);
                          setActiveNavDropdown(null);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 transition text-xs font-semibold text-slate-800 hover:text-blue-600 flex justify-between items-center"
                      >
                        <span>CR Coils & Sheets (Cold Rolled)</span>
                        <span className="text-[10px] text-slate-400">IS 513</span>
                      </button>
                      <button
                        onClick={() => {
                          onSelectCategory('metals', 'flat-steel');
                          setSelectedSubCategories(['flat-steel']);
                          setActiveNavDropdown(null);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 transition text-xs font-semibold text-slate-800 hover:text-blue-600 flex justify-between items-center"
                      >
                        <span>Chequered Plates (Anti-Skid)</span>
                        <span className="text-[10px] text-slate-400">3mm - 12mm</span>
                      </button>
                      <button
                        onClick={() => {
                          onSelectCategory('metals', 'flat-steel');
                          setSelectedSubCategories(['flat-steel']);
                          setActiveNavDropdown(null);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 transition text-xs font-semibold text-slate-800 hover:text-blue-600 flex justify-between items-center"
                      >
                        <span>Galvanized Plain & Corrugated (GP/GI)</span>
                        <span className="text-[10px] text-slate-400">Zinc Z120</span>
                      </button>
                      <button
                        onClick={() => {
                          onSelectCategory('metals', 'long-steel');
                          setSelectedSubCategories(['long-steel']);
                          setActiveNavDropdown(null);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 transition text-xs font-semibold text-slate-800 hover:text-blue-600 flex justify-between items-center"
                      >
                        <span>MS Wire Rods & Bright Bars</span>
                        <span className="text-[10px] text-slate-400">5.5mm - 16mm</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Structural Steel Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setActiveNavDropdown((prev) =>
                      prev === 'structural-steel' ? null : 'structural-steel'
                    )
                  }
                  className={`flex items-center gap-1 hover:text-blue-600 transition cursor-pointer py-1 ${
                    activeNavDropdown === 'structural-steel' ? 'text-blue-600 font-bold' : ''
                  }`}
                >
                  <span>Structural Steel</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      activeNavDropdown === 'structural-steel' ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>

                {activeNavDropdown === 'structural-steel' && (
                  <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 text-slate-800 animate-in fade-in zoom-in-95 duration-150 z-50">
                    <div className="px-3 py-1.5 border-b border-slate-100 font-bold text-[10px] uppercase text-slate-400">
                      Heavy Structural Steel
                    </div>
                    <div className="space-y-0.5 pt-1">
                      <button
                        onClick={() => {
                          onSelectCategory('metals', 'long-steel');
                          setSelectedSubCategories(['long-steel']);
                          setActiveNavDropdown(null);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 transition text-xs font-semibold text-slate-800 hover:text-blue-600 flex justify-between items-center"
                      >
                        <span>MS Beams (ISMB / NPB / WPB)</span>
                        <span className="text-[10px] text-slate-400">100 - 600mm</span>
                      </button>
                      <button
                        onClick={() => {
                          onSelectCategory('metals', 'long-steel');
                          setSelectedSubCategories(['long-steel']);
                          setActiveNavDropdown(null);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 transition text-xs font-semibold text-slate-800 hover:text-blue-600 flex justify-between items-center"
                      >
                        <span>MS Channels (ISMC)</span>
                        <span className="text-[10px] text-slate-400">75 - 400mm</span>
                      </button>
                      <button
                        onClick={() => {
                          onSelectCategory('metals', 'long-steel');
                          setSelectedSubCategories(['long-steel']);
                          setActiveNavDropdown(null);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 transition text-xs font-semibold text-slate-800 hover:text-blue-600 flex justify-between items-center"
                      >
                        <span>MS Angles (ISA Equal & Unequal)</span>
                        <span className="text-[10px] text-slate-400">25x25 - 200x200</span>
                      </button>
                      <button
                        onClick={() => {
                          onSelectCategory('metals', 'flat-steel');
                          setSelectedSubCategories(['flat-steel']);
                          setActiveNavDropdown(null);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 transition text-xs font-semibold text-slate-800 hover:text-blue-600 flex justify-between items-center"
                      >
                        <span>Heavy Structural Plates</span>
                        <span className="text-[10px] text-slate-400">12mm - 63mm</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. TMT Rebars Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setActiveNavDropdown((prev) => (prev === 'tmt-rebars' ? null : 'tmt-rebars'))
                  }
                  className={`flex items-center gap-1 hover:text-blue-600 transition cursor-pointer py-1 ${
                    activeNavDropdown === 'tmt-rebars' ? 'text-blue-600 font-bold' : ''
                  }`}
                >
                  <span>TMT Rebars</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      activeNavDropdown === 'tmt-rebars' ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>

                {activeNavDropdown === 'tmt-rebars' && (
                  <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 text-slate-800 animate-in fade-in zoom-in-95 duration-150 z-50">
                    <div className="px-3 py-1.5 border-b border-slate-100 font-bold text-[10px] uppercase text-slate-400">
                      TMT Construction Rebars
                    </div>
                    <div className="space-y-0.5 pt-1">
                      <button
                        onClick={() => {
                          onSelectCategory('metals', 'long-steel');
                          setSelectedSubCategories(['long-steel']);
                          setActiveNavDropdown(null);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 transition text-xs font-semibold text-slate-800 hover:text-blue-600 flex justify-between items-center"
                      >
                        <span>TMT Fe 550D High-Ductility Rebars</span>
                        <span className="text-[10px] text-teal-600 font-bold">Seismic Grade</span>
                      </button>
                      <button
                        onClick={() => {
                          onSelectCategory('metals', 'long-steel');
                          setSelectedSubCategories(['long-steel']);
                          setActiveNavDropdown(null);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 transition text-xs font-semibold text-slate-800 hover:text-blue-600 flex justify-between items-center"
                      >
                        <span>TMT Fe 500D Construction Rebars</span>
                        <span className="text-[10px] text-slate-400">8mm - 32mm</span>
                      </button>
                      <button
                        onClick={() => {
                          onSelectCategory('metals', 'long-steel');
                          setSelectedSubCategories(['long-steel']);
                          setActiveNavDropdown(null);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 transition text-xs font-semibold text-slate-800 hover:text-blue-600 flex justify-between items-center"
                      >
                        <span>Primary Brands (JSW, TATA, Jindal)</span>
                        <span className="text-[10px] text-blue-600 font-bold">Mill Certified</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Category Links */}
              <button
                onClick={() => {
                  onSelectCategory('energy-minerals', 'limestone');
                  setActiveNavDropdown(null);
                }}
                className="hover:text-blue-600 transition cursor-pointer"
              >
                Cement & Minerals
              </button>

              <button
                onClick={() => {
                  onSelectCategory('chemicals');
                  setActiveNavDropdown(null);
                }}
                className="hover:text-blue-600 transition cursor-pointer"
              >
                Chemicals & Bitumen
              </button>

              <button
                onClick={() => {
                  onSelectCategory('energy-minerals');
                  setActiveNavDropdown(null);
                }}
                className="hover:text-blue-600 transition cursor-pointer"
              >
                Energy & Fuels
              </button>

              <button
                onClick={() => {
                  onSelectCategory('agri');
                  setActiveNavDropdown(null);
                }}
                className="hover:text-blue-600 transition cursor-pointer"
              >
                Agri Commodities
              </button>
            </div>

            {/* 4. Help & Support Dropdown */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() =>
                  setActiveNavDropdown((prev) => (prev === 'help' ? null : 'help'))
                }
                className="flex items-center gap-1 text-slate-500 hover:text-blue-600 transition cursor-pointer py-1"
              >
                <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                <span>Help & support</span>
                <ChevronDown
                  className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
                    activeNavDropdown === 'help' ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>

              {activeNavDropdown === 'help' && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 text-slate-800 animate-in fade-in zoom-in-95 duration-150 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-100 font-bold text-[10px] uppercase text-slate-400">
                    Bable Assistance & Desk
                  </div>
                  <div className="space-y-1 pt-1">
                    <button
                      onClick={() => {
                        setActiveNavDropdown(null);
                        if (onOpenCommodityDesk) onOpenCommodityDesk();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 transition text-xs font-semibold text-slate-900 hover:text-blue-600 flex items-center gap-2"
                    >
                      <PhoneCall className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <div className="font-bold">Commodity Desk Direct</div>
                        <div className="text-[10px] text-slate-500">+91 87920 87909 (Call & WhatsApp)</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setActiveNavDropdown(null);
                        onOpenQuote('General Inquiry');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 transition text-xs font-semibold text-slate-900 hover:text-blue-600 flex items-center gap-2"
                    >
                      <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-[10px]">
                        RFQ
                      </span>
                      <div>
                        <div className="font-bold">Request Bulk Quote</div>
                        <div className="text-[10px] text-slate-500">Get proforma invoice in 30 mins</div>
                      </div>
                    </button>

                    <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-100 text-[11px] text-sky-900 font-medium">
                      📍 <strong>Belagavi Office:</strong> Karnataka, India
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* 2. BREADCRUMBS & BANNERS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 w-full">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto whitespace-nowrap">
          <button onClick={onNavigateHome} className="hover:text-blue-600 transition">
            Home
          </button>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <button
            onClick={() => {
              clearAllFilters();
              onSelectCategory('all');
            }}
            className="hover:text-blue-600 transition"
          >
            All products
          </button>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <button
            onClick={() => onSelectCategory(selectedCategory)}
            className="hover:text-blue-600 transition capitalize font-semibold text-slate-700"
          >
            {categoryTitles[selectedCategory] || 'Metals'}
          </button>
          {selectedSubCategories.length === 1 && (
            <>
              <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="text-slate-900 font-bold">
                {availableSubCategories.find((s) => s.id === selectedSubCategories[0])?.label || 'Products'}
              </span>
            </>
          )}
        </nav>
      </div>

      {/* 3. MAIN CONTENT: SIDEBAR + PRODUCT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full flex-1">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* LEFT SIDEBAR: FILTERS ACCORDION (Matches Screenshot) */}
          <aside className="w-full lg:w-64 shrink-0 space-y-4">
            
            {/* Filter Header Box */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-slate-700" />
                <h3 className="text-base font-bold text-slate-900">Filter</h3>
              </div>
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline transition cursor-pointer"
              >
                Clear filters
              </button>
            </div>

            {/* Accordion 1: Category */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <button
                type="button"
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="w-full p-3.5 flex items-center justify-between font-bold text-xs text-slate-900 hover:bg-slate-50 transition"
              >
                <span>Category</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${categoryOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {categoryOpen && (
                <div className="p-3.5 pt-0 space-y-2 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    {categoryTitles[selectedCategory]}
                  </div>
                  {availableSubCategories.map((sub) => {
                    const isChecked = selectedSubCategories.includes(sub.id);
                    return (
                      <label
                        key={sub.id}
                        className="flex items-center gap-2.5 text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSubCategory(sub.id)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                        />
                        <span className="flex-1 font-medium">{sub.label}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({sub.count})</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Accordion 2: Grade */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <button
                type="button"
                onClick={() => setGradeOpen(!gradeOpen)}
                className="w-full p-3.5 flex items-center justify-between font-bold text-xs text-slate-900 hover:bg-slate-50 transition"
              >
                <span>Grade</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${gradeOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {gradeOpen && (
                <div className="p-3.5 pt-0 space-y-2 border-t border-slate-100 max-h-48 overflow-y-auto">
                  {availableGrades.map((grade) => {
                    const isChecked = selectedGrades.includes(grade);
                    return (
                      <label
                        key={grade}
                        className="flex items-center gap-2.5 text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleGrade(grade)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                        />
                        <span className="font-medium text-xs truncate">{grade}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Accordion 3: Brand */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <button
                type="button"
                onClick={() => setBrandOpen(!brandOpen)}
                className="w-full p-3.5 flex items-center justify-between font-bold text-xs text-slate-900 hover:bg-slate-50 transition"
              >
                <span>Brand</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${brandOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {brandOpen && (
                <div className="p-3.5 pt-0 space-y-2 border-t border-slate-100 max-h-48 overflow-y-auto">
                  {availableBrands.map((brand) => {
                    const isChecked = selectedBrands.includes(brand);
                    return (
                      <label
                        key={brand}
                        className="flex items-center gap-2.5 text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleBrand(brand)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                        />
                        <span className="font-medium text-xs">{brand}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quality & SLA Guarantee Box */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-teal-50 border border-blue-200/70 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-blue-900">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Verified Mill Quality</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                All consignments dispatched with NABL laboratory test certificates & weighbridge weight slips.
              </p>
            </div>

          </aside>

          {/* RIGHT PRODUCT GRID (Matches Screenshot Format) */}
          <main className="flex-1">
            
            {/* Header: Title + Results count */}
            <div className="flex items-baseline gap-2 mb-6">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                {activeSubTitle}
              </h1>
              <span className="text-xs sm:text-sm text-slate-500 font-medium">
                Found <strong className="text-slate-900 font-bold">{filteredProducts.length}</strong> results
              </span>
            </div>

            {/* Empty state */}
            {filteredProducts.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No products match your filters</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try unchecking specific brands or grades, or clearing your search term to see more items.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-5 py-2 text-xs font-bold text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Product Cards Grid (3 Columns on Desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Image Box on Pure White Background */}
                    <div
                      onClick={() => setInspectProduct(product)}
                      className="aspect-4/3 p-4 flex items-center justify-center bg-white cursor-pointer relative overflow-hidden border-b border-slate-100"
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                        }}
                      />

                      {/* Stock indicator badge */}
                      <div className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                        In Stock
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-4 sm:p-5 space-y-3">
                      
                      {/* Product Title */}
                      <h3
                        onClick={() => setInspectProduct(product)}
                        className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 hover:text-blue-600 cursor-pointer"
                        title={product.name}
                      >
                        {product.name}
                      </h3>

                      {/* Brand Line: Brand: [Brand Name] */}
                      <div className="text-xs text-slate-500">
                        Brand: <span className="font-bold text-slate-800">{product.brand}</span>
                      </div>

                      {/* Specifications List (Matches Screenshot) */}
                      <div className="space-y-1.5 pt-1 text-xs">
                        {Object.entries(product.specs).map(([key, val]) => (
                          <div key={key} className="flex justify-between items-baseline text-slate-600">
                            <span className="text-slate-500">{key}</span>
                            <span className="font-semibold text-slate-900 font-mono text-[11px] text-right">
                              {val}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Price row */}
                      <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                        <div>
                          <span className="text-base font-black text-slate-900 font-mono">
                            {product.price}
                          </span>
                          <span className="text-xs text-slate-500 font-normal ml-0.5">
                            {product.unit}
                          </span>
                        </div>
                        {product.minOrderMT && (
                          <span className="text-[10px] text-slate-400">
                            Min: {product.minOrderMT} MT
                          </span>
                        )}
                      </div>

                      {/* Purchase Now Link (Matches Screenshot format) */}
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => onOpenQuote(product.categoryLabel, product.name)}
                          className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline transition cursor-pointer flex items-center gap-1"
                        >
                          <span>Purchase now</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  </div>

                  {/* Bottom Strip: Delivery Time with Truck Icon (Matches Screenshot) */}
                  <div className="bg-slate-50 border-t border-slate-100 px-4 py-2.5 flex items-center justify-between text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 font-medium text-slate-600">
                      <Truck className="w-3.5 h-3.5 text-slate-500" />
                      <span>{product.deliveryTime}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onAddToCart?.(product)}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-800"
                    >
                      + Cart
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </main>

        </div>
      </div>

      {/* 4. PRODUCT QUICK INSPECT MODAL */}
      {inspectProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto space-y-6">
            
            <button
              onClick={() => setInspectProduct(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <div className="w-48 h-48 rounded-2xl bg-slate-50 p-4 border border-slate-100 flex items-center justify-center shrink-0">
                <img src={inspectProduct.imageUrl} alt={inspectProduct.name} className="max-h-full max-w-full object-contain" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {inspectProduct.categoryLabel} · {inspectProduct.brand}
                </span>
                <h3 className="text-xl font-black text-slate-900 leading-tight">
                  {inspectProduct.name}
                </h3>
                <div className="text-2xl font-black text-blue-700 font-mono">
                  {inspectProduct.price} <span className="text-sm font-normal text-slate-500">{inspectProduct.unit}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                  <Truck className="w-4 h-4" />
                  <span>{inspectProduct.deliveryTime} guaranteed dispatch</span>
                </div>
              </div>
            </div>

            {/* Technical Specifications Sheet */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Certified Mill Parameters & Chemical Tolerances
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {Object.entries(inspectProduct.specs).map(([k, v]) => (
                  <div key={k} className="p-2.5 rounded-xl bg-white border border-slate-200/60">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">{k}</div>
                    <div className="font-bold text-slate-900 font-mono text-xs">{v}</div>
                  </div>
                ))}
                <div className="p-2.5 rounded-xl bg-white border border-slate-200/60">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Standard / Norm</div>
                  <div className="font-bold text-slate-900 font-mono text-xs">{inspectProduct.grade}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200/60">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Min Consignment</div>
                  <div className="font-bold text-slate-900 font-mono text-xs">{inspectProduct.minOrderMT || 10} MT</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onOpenQuote(inspectProduct.categoryLabel, inspectProduct.name);
                  setInspectProduct(null);
                }}
                className="flex-1 brand-gradient text-white font-bold text-sm py-3 rounded-full shadow-md hover:opacity-95 transition"
              >
                Purchase Now / Lock In Spot Rate
              </button>

              <button
                type="button"
                onClick={() => {
                  onAddToCart?.(inspectProduct);
                  setInspectProduct(null);
                }}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-full transition"
              >
                Add to Cart
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
