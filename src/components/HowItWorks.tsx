import React from 'react';
import companyData from '../data/companyData.json';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface HowItWorksProps {
  onOpenQuote: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenQuote }) => {
  return (
    <section id="how-it-works" className="py-20 bg-slate-50 border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            Streamlined Fulfillment Engine
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 mb-4">
            How Procurement Works on{' '}
            <span className="italic font-serif brand-gradient-text">Bable</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            From requisition to factory gate weighing: simple, transparent, and technology-supervised at every stage.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {companyData.howItWorks.map((item, idx) => (
            <div
              key={item.step}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative flex flex-col justify-between"
            >
              <div>
                {/* Step indicator */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-black font-sans text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600">
                    {item.step}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2.5">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Connecting badge or bottom pill */}
              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                <span>Phase 0{idx + 1}</span>
                {idx < 3 ? (
                  <span className="text-blue-500 flex items-center gap-0.5">
                    Next <ArrowRight className="w-3 h-3" />
                  </span>
                ) : (
                  <span className="text-teal-600 font-bold">Dispatched</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA prompt below steps */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={onOpenQuote}
            className="brand-gradient hover:opacity-95 text-white font-bold text-sm sm:text-base px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5 inline-flex items-center gap-2"
          >
            <span>Start Your Order Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
