import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ArrowRight,
  Truck,
  Wallet,
  TrendingUp,
  Cpu,
  Flame,
  Layers,
  FlaskConical,
  Sparkles,
  Mountain,
  CircleDot,
  Clock,
  X,
  Trash2
} from 'lucide-react';
import companyData from '../data/companyData.json';

interface HeroProps {
  onSearch: (query: string) => void;
  onSelectActionCard: (cardId: string) => void;
}

const STORAGE_KEY = 'bable_recent_searches';
const DEFAULT_RECENT = ['TMT Bars Fe 550D', 'Caustic Soda Lye', 'Indonesian Coal 5000 GAR', 'VG-30 Bitumen'];

export const Hero: React.FC<HeroProps> = ({ onSearch, onSelectActionCard }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [activeCardId, setActiveCardId] = useState<string>('procurement');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);
  const placeholders = companyData.search.cyclingPlaceholders;

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentSearches(parsed);
          return;
        }
      }
      // Fallback default suggestions
      setRecentSearches(DEFAULT_RECENT);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_RECENT));
    } catch {
      setRecentSearches(DEFAULT_RECENT);
    }
  }, []);

  // Cycling placeholder timer
  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [placeholders.length]);

  // Outside click listener to dismiss search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveSearchTerm = (term: string) => {
    const cleaned = term.trim();
    if (!cleaned) return;
    const filtered = recentSearches.filter(
      (item) => item.toLowerCase() !== cleaned.toLowerCase()
    );
    const updated = [cleaned, ...filtered].slice(0, 7);
    setRecentSearches(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving search history:', e);
    }
  };

  const removeSearchTerm = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter((item) => item !== term);
    setRecentSearches(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error removing search history:', e);
    }
  };

  const clearAllSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Error clearing search history:', e);
    }
  };

  const executeSearch = (term: string) => {
    const cleaned = term.trim();
    if (cleaned) {
      saveSearchTerm(cleaned);
      setSearchQuery(cleaned);
      setIsSearchFocused(false);
      onSearch(cleaned);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchQuery);
  };

  const handleChipClick = (label: string, categoryId: string) => {
    saveSearchTerm(label);
    setSearchQuery(label);
    setIsSearchFocused(false);
    const target = document.getElementById(`category-${categoryId}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      onSearch(label);
    }
  };

  const chipIcons: Record<string, React.ReactNode> = {
    coal: <Flame className="w-3.5 h-3.5 text-amber-600" />,
    petcoke: <Layers className="w-3.5 h-3.5 text-slate-700" />,
    limestone: <Mountain className="w-3.5 h-3.5 text-teal-600" />,
    'iron-ore': <CircleDot className="w-3.5 h-3.5 text-rose-600" />,
    methanol: <FlaskConical className="w-3.5 h-3.5 text-sky-600" />,
    pvc: <Cpu className="w-3.5 h-3.5 text-blue-600" />,
    ingots: <Sparkles className="w-3.5 h-3.5 text-emerald-600" />,
    bitumen: <Truck className="w-3.5 h-3.5 text-zinc-700" />,
  };

  return (
    <section className="relative overflow-visible bg-white min-h-[580px] lg:min-h-[640px] flex flex-col justify-between pt-6 sm:pt-10 pb-12">
      {/* Background Warehouse Image with Clean Left Fade */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/src/assets/images/hero_industrial_warehouse_1793479824050.webp"
          alt="Modern Industrial Logistics Warehouse"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover object-right-top opacity-90"
        />
        {/* Horizontal White Fade Mask */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 sm:via-white/70 to-transparent" />
        {/* Soft bottom wash into content */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Main Content Container (z-30 so search dropdown floats over action cards below) */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl lg:max-w-3xl pt-2 sm:pt-6">
          
          {/* Badge: "Powered by In-House Technology" */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-blue-200/80 shadow-xs mb-4 text-xs font-semibold text-blue-800 backdrop-blur-xs">
            <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse"></span>
            <span>{companyData.company.badgeText}</span>
          </div>

          {/* Heading: India's Leading (blue italic) + B2B Commerce Platform (teal gradient) */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-4 sm:mb-6 font-heading">
            <span className="block text-[#0B6FE8] font-black tracking-tight">
              {companyData.company.headlinePrefix}
            </span>
            <span className="block bg-gradient-to-r from-[#00C9B1] via-[#02b39d] to-[#0B6FE8] bg-clip-text text-transparent font-black tracking-tight">
              {companyData.company.headlineHighlight}
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-700 font-medium max-w-xl mb-5 sm:mb-7 leading-relaxed drop-shadow-2xs">
            {companyData.company.subheadline}
          </p>

          {/* Large Rounded Search Bar with Floating Recent Searches Dropdown */}
          <form
            ref={formRef}
            onSubmit={handleSearchSubmit}
            className="relative z-40 max-w-xl bg-white rounded-full p-1 sm:p-2 shadow-xl hover:shadow-2xl border border-slate-200/90 hover:border-teal-400 focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-100 transition-all duration-200 mb-4 sm:mb-5"
          >
            <div className="flex items-center">
              <div className="pl-3 sm:pl-4 pr-1 sm:pr-2 text-slate-400 shrink-0">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onClick={() => setIsSearchFocused(true)}
                placeholder={placeholders[placeholderIndex]}
                className="w-full bg-transparent py-2 sm:py-2.5 text-xs sm:text-base text-slate-800 placeholder-slate-400 font-medium focus:outline-none transition-all duration-300 min-w-0"
              />

              <button
                type="submit"
                className="shrink-0 brand-gradient hover:opacity-95 text-white font-bold text-xs sm:text-base px-4 sm:px-8 py-2 sm:py-3 rounded-full shadow-md transition-all duration-150 cursor-pointer active:scale-95 min-h-[38px] flex items-center justify-center"
              >
                Search
              </button>
            </div>

            {/* FLOATING RECENT SEARCHES DROPDOWN */}
            {isSearchFocused && recentSearches.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl ring-1 ring-slate-900/5 border border-slate-200/90 py-3 px-2 z-[999] animate-in fade-in zoom-in-95 duration-150">
                {/* Dropdown Header */}
                <div className="px-3 py-1.5 flex items-center justify-between border-b border-slate-100 mb-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    <span>Recent Searches</span>
                  </div>
                  <button
                    type="button"
                    onClick={clearAllSearches}
                    className="text-[11px] font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear history</span>
                  </button>
                </div>

                {/* List of Recent Items */}
                <div className="space-y-0.5">
                  {recentSearches.map((term, index) => (
                    <div
                      key={`${term}-${index}`}
                      onClick={() => executeSearch(term)}
                      className="group flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition text-xs font-semibold text-slate-700 hover:text-blue-600"
                    >
                      <div className="flex items-center gap-2.5 truncate pr-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 shrink-0" />
                        <span className="truncate">{term}</span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => removeSearchTerm(e, term)}
                        className="p-1 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition shrink-0"
                        title="Remove from history"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>

          {/* Quick Chips (Coal, Petcoke, Limestone, Iron Ore, Methanol, PVC...) - Touch scrollable on mobile */}
          <div className="relative z-20 flex items-center gap-2 max-w-full overflow-x-auto no-scrollbar pb-1 sm:flex-wrap">
            <span className="text-xs font-bold text-slate-600 mr-1 shrink-0">Trending:</span>
            {companyData.search.quickChips.map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => handleChipClick(chip.label, chip.category)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 hover:bg-white border border-slate-200 hover:border-blue-400 rounded-full text-xs font-semibold text-slate-700 shadow-2xs hover:shadow-xs transition duration-150 cursor-pointer backdrop-blur-xs min-h-[34px]"
              >
                {chipIcons[chip.id] || <Sparkles className="w-3.5 h-3.5 text-blue-500" />}
                <span>{chip.label}</span>
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Bottom Hero Action Cards (Procurement, Financing, Revenue Generation) - z-10 so top container z-30 dropdown always renders above */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {companyData.heroActionCards.map((card) => {
            const isActive = activeCardId === card.id;
            return (
              <div
                key={card.id}
                onClick={() => {
                  setActiveCardId(card.id);
                  onSelectActionCard(card.id);
                }}
                className={`group relative rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500/90 to-blue-600 text-white ring-2 ring-blue-400'
                    : 'bg-white/95 text-slate-800 border border-slate-200/90 hover:border-blue-300 backdrop-blur-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  {/* Left: Icon + Titles */}
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-teal-50 text-teal-600 border border-teal-100'
                      }`}
                    >
                      {card.id === 'procurement' && <Truck className="w-6 h-6" />}
                      {card.id === 'financing' && <Wallet className="w-6 h-6" />}
                      {card.id === 'revenue' && <TrendingUp className="w-6 h-6" />}
                    </div>
                    <div>
                      <h2
                        className={`text-base sm:text-lg font-bold leading-tight ${
                          isActive ? 'text-white' : 'text-slate-900 group-hover:text-blue-600'
                        }`}
                      >
                        {card.title}
                      </h2>
                      <p
                        className={`text-xs font-semibold ${
                          isActive ? 'text-teal-100 italic' : 'text-slate-500 italic'
                        }`}
                      >
                        {card.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Right: Round arrow button */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:translate-x-1 ${
                      isActive
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                    }`}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                <p
                  className={`mt-2.5 text-xs line-clamp-2 ${
                    isActive ? 'text-blue-50/90' : 'text-slate-600'
                  }`}
                >
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
