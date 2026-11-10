import React from 'react';
import { Scale, ShieldCheck, Coins, Boxes, ArrowRight } from 'lucide-react';
import companyData from '../data/companyData.json';

interface WhyChooseUsProps {
  onOpenQuote: () => void;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ onOpenQuote }) => {
  const iconMap: Record<string, React.ReactNode> = {
    Scale: <Scale className="w-6 h-6 text-teal-600" />,
    ShieldCheck: <ShieldCheck className="w-6 h-6 text-blue-600" />,
    Coins: <Coins className="w-6 h-6 text-amber-600" />,
    Boxes: <Boxes className="w-6 h-6 text-emerald-600" />,
  };

  return (
    <section id="why-choose-us" className="py-12 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-3">
            Enterprise Value Proposition
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 mb-4">
            Why India's Manufacturers Choose{' '}
            <span className="italic font-serif brand-gradient-text">Bable</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            We eliminate multiple middlemen layers, speculative hoarding, and delivery uncertainties through vertically integrated supply pipelines and real-time tech.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {companyData.whyChooseUs.map((item, idx) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Top Accent Gradient Border */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Icon & Tag */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-13 h-13 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-2xs">
                    {iconMap[item.icon]}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-700 transition">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2.5 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Action trigger */}
              <button
                type="button"
                onClick={onOpenQuote}
                className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:text-teal-600 transition-colors"
              >
                <span>Request Procurement Terms</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
