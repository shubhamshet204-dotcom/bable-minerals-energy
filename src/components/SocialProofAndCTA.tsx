import React, { useState } from 'react';
import {
  Quote,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building,
  ArrowRight,
  PhoneCall,
  FileSpreadsheet
} from 'lucide-react';
import testimonialsData from '../data/testimonials.json';

interface SocialProofAndCTAProps {
  onOpenQuote: () => void;
  onOpenChat: () => void;
  onOpenCommodityDesk?: () => void;
}

export const SocialProofAndCTA: React.FC<SocialProofAndCTAProps> = ({
  onOpenQuote,
  onOpenChat,
  onOpenCommodityDesk,
}) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { testimonials, clientLogos } = testimonialsData;

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const activeReview = testimonials[currentTestimonial];

  return (
    <section className="py-12 sm:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Client Logos / Enterprise Trust Strip */}
        <div className="mb-10 sm:mb-20 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-5 sm:mb-8">
            Trusted By Leading Infrastructure, EPC & Manufacturing Enterprises
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3 sm:gap-4 items-stretch">
            {clientLogos.map((client) => (
              <div
                key={client.name}
                title={`${client.name} — ${client.tag}`}
                className="p-1.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200/90 hover:border-teal-400/80 bg-white hover:bg-teal-50/20 transition-all duration-200 flex flex-col items-center justify-between text-center group shadow-xs hover:shadow-md min-h-[70px] sm:min-h-[124px]"
              >
                <div className="w-full h-8 sm:h-14 flex items-center justify-center mb-1 sm:mb-1.5 px-0.5 overflow-hidden">
                  <img
                    src={client.logoUrl}
                    alt={`${client.name} Logo`}
                    className="max-h-7 sm:max-h-11 max-w-[90%] w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      if (target.parentElement) {
                        target.parentElement.innerHTML = `<span class="text-xs font-black text-blue-800">${client.initials}</span>`;
                      }
                    }}
                  />
                </div>
                <div className="w-full">
                  <span className="text-[9px] sm:text-xs font-bold text-slate-900 truncate block w-full tracking-tight leading-tight" title={client.name}>
                    {client.name}
                  </span>
                  <span className="hidden sm:block text-[10px] text-slate-500 font-semibold truncate block w-full mt-0.5" title={client.tag}>
                    {client.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Slider */}
        <div className="mb-20">
          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 rounded-3xl p-5 sm:p-12 text-white relative shadow-xl overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto">
              {/* Header inside slider */}
              <div className="flex items-center justify-between mb-5 sm:mb-8 pb-4 sm:pb-6 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-teal-400/20 text-teal-300 flex items-center justify-center">
                    <Quote className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                    Client Case Study & Experience
                  </span>
                </div>

                {/* Slider Navigation Arrows */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prevTestimonial}
                    className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-white transition cursor-pointer"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextTestimonial}
                    className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-white transition cursor-pointer"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Quote Body */}
              <div className="min-h-[100px] sm:min-h-[140px] flex flex-col justify-center">
                <blockquote className="text-sm sm:text-2xl lg:text-3xl font-medium leading-relaxed text-slate-100 mb-4 sm:mb-8 italic">
                  "{activeReview.quote}"
                </blockquote>
              </div>

              {/* Author & Attributed Outcome */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-slate-800/80">
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-white">
                    {activeReview.author}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300">
                    {activeReview.role} · <span className="text-teal-300 font-semibold">{activeReview.company}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {activeReview.location}
                  </p>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="bg-slate-800/80 rounded-xl px-3 sm:px-4 py-2 border border-slate-700/80">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Procured</div>
                    <div className="text-xs sm:text-sm font-bold text-teal-300">{activeReview.metric}</div>
                  </div>
                  <div className="bg-slate-800/80 rounded-xl px-3 sm:px-4 py-2 border border-slate-700/80">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Impact</div>
                    <div className="text-xs sm:text-sm font-bold text-emerald-400">{activeReview.saving}</div>
                  </div>
                </div>
              </div>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTestimonial(idx)}
                    className={`h-2 rounded-full transition-all duration-200 cursor-pointer ${currentTestimonial === idx ? 'w-8 bg-teal-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
                      }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="relative rounded-3xl brand-gradient p-6 sm:p-12 text-white shadow-2xl overflow-hidden">
          {/* Background decorative circles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-2xl transform translate-x-32 -translate-y-32 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-2xl transform -translate-x-16 translate-y-16 pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 backdrop-blur-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-200" />
              <span>Direct Mill Allocation & Working Capital</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-3 sm:mb-4">
              Ready to Optimize Your Industrial Raw Material Procurement?
            </h2>

            <p className="text-sm sm:text-lg text-teal-50 font-medium mb-6 sm:mb-8 leading-relaxed max-w-2xl">
              Lock in transparent live spot prices, get up to ₹10 Crore working capital trade lines, and experience guaranteed factory delivery schedules with Bable Minerals.
            </p>

            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={onOpenQuote}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-blue-700 hover:bg-slate-50 font-bold text-sm sm:text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                <span>Get Instant Custom Quote</span>
              </button>

              <button
                type="button"
                onClick={onOpenCommodityDesk || onOpenChat}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-white/15 hover:bg-white/25 text-white font-bold text-sm sm:text-base rounded-full border border-white/30 backdrop-blur-xs transition-all duration-200 cursor-pointer hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-teal-200" />
                <span>Talk to Commodity Desk</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
