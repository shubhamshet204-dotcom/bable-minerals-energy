import React from 'react';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import livePricesData from '../data/livePrices.json';
import { LivePriceItem } from '../types';

interface LivePricesTickerProps {
  onSelectItem: (item: LivePriceItem) => void;
  customPrices?: LivePriceItem[];
}

export const LivePricesTicker: React.FC<LivePricesTickerProps> = ({ onSelectItem, customPrices }) => {
  const priceSource = customPrices && customPrices.length > 0 ? customPrices : livePricesData.prices;

  const filteredPrices = priceSource.map((p) => ({
    ...p,
    displayPrice: p.price,
    displayLocation: p.location,
  }));

  // Duplicate list for infinite smooth marquee loop
  const marqueeItems = [...filteredPrices, ...filteredPrices];

  return (
    <div id="live-prices-section" className="bg-slate-50 border-b border-slate-200 text-xs text-slate-700 overflow-hidden relative shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left: Green Pulsing Dot + LIVE PRICES Badge */}
        <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-white border-r border-slate-200 shrink-0 z-10 shadow-xs">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-extrabold tracking-wider text-slate-900 uppercase flex items-center gap-1 text-[11px] sm:text-xs">
            LIVE PRICES <ArrowRight className="w-3 h-3 text-blue-600 inline" />
          </span>
        </div>

        {/* Center: Marquee Scrolling Stream */}
        <div className="flex-1 overflow-hidden relative py-2">
          {/* Subtle fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-50 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-50 to-transparent z-10" />

          <div className="animate-ticker flex items-center gap-3 select-none">
            {marqueeItems.map((item, idx) => (
              <button
                key={`${item.id}-${idx}`}
                onClick={() => onSelectItem(item)}
                className="flex items-center gap-2 px-3 py-1 bg-white hover:bg-blue-50/70 border border-slate-200/80 rounded-lg whitespace-nowrap transition-all duration-150 text-left hover:border-blue-300 shadow-2xs group cursor-pointer"
                title="Click to request instant quote for this material"
              >
                <span className="font-semibold text-slate-800 text-xs group-hover:text-blue-600">
                  {item.shortName}:
                </span>
                <span className="font-bold text-slate-900 text-xs">
                  {item.displayPrice}
                  <span className="text-[10px] text-slate-500 font-normal ml-0.5">{item.unit}</span>
                </span>
                
                {/* Change percent */}
                <span
                  className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    item.isPositive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : 'bg-rose-50 text-rose-700 border border-rose-100'
                  }`}
                >
                  {item.isPositive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                  {item.changePercent}
                </span>

                <span className="text-[10px] text-slate-400 font-medium">
                  {item.displayLocation}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Live Market Status Badge (Single Location Selector kept in Header) */}
        <div className="hidden sm:flex items-center gap-1.5 shrink-0 bg-white border-l border-slate-200 px-3 py-2.5 text-xs text-slate-600 font-semibold z-10">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Spot Rates Updated</span>
        </div>

      </div>
    </div>
  );
};
