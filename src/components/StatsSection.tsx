import React, { useEffect, useState, useRef } from 'react';
import companyData from '../data/companyData.json';

export const StatsSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-10 sm:py-14 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {companyData.stats.map((stat, idx) => (
            <div
              key={stat.id}
              className="relative p-4 sm:p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 font-sans tabular-nums mb-2 flex items-baseline">
                {stat.prefix && <span className="text-teal-600 mr-0.5">{stat.prefix}</span>}
                <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700 bg-clip-text text-transparent">
                  {isVisible ? stat.value : '0'}
                </span>
                <span className="text-base sm:text-xl font-bold text-blue-600 ml-1">
                  {stat.suffix}
                </span>
              </div>
              
              <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-1">
                {stat.label}
              </h3>
              
              <p className="text-xs text-slate-500 leading-relaxed">
                {stat.description}
              </p>

              {/* Accent hairline bar */}
              <div
                className={`absolute bottom-0 left-6 right-6 h-1 rounded-t-full transition-all duration-300 ${
                  idx % 2 === 0 ? 'bg-teal-400 group-hover:h-1.5' : 'bg-blue-500 group-hover:h-1.5'
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
