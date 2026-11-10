import React from 'react';
import { ChevronRight, Factory, Truck } from 'lucide-react';
import categoriesData from '../data/categories.json';
import { Category, CategorySubItem } from '../types';

interface CategoriesWeServeProps {
  onSelectProduct: (categoryName: string, item: CategorySubItem) => void;
  onOpenUnits: () => void;
  customCategories?: Category[];
  onNavigateCategory?: (category: string, subCategory?: string) => void;
}

export const CategoriesWeServe: React.FC<CategoriesWeServeProps> = ({
  onSelectProduct,
  onOpenUnits,
  customCategories,
  onNavigateCategory,
}) => {
  const categoriesList =
    customCategories && customCategories.length > 0
      ? customCategories
      : (categoriesData as Category[]);

  return (
    <section id="categories-section" className="py-8 sm:py-12 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 mb-2 font-heading">
            <span className="brand-gradient-text mr-2">Categories</span>
            <span className="text-[#0B6FE8]">We Serve</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            Explore raw materials and products across India's key industries.
          </p>
        </div>

        {/* Category Blocks */}
        <div className="space-y-8">
          {categoriesList.map((category, categoryIndex) => (
            <div
              key={category.id}
              id={`category-${category.id}`}
              className="bg-white rounded-3xl shadow-2xs border border-slate-200/90 overflow-hidden hover:shadow-md transition-all duration-200"
            >
              {/* Upper Section: Dark Left Card + Right 6-Tile Grid */}
              <div className="flex flex-col lg:flex-row">

                {/* Left: Dark Image Card with Title & Subtitle */}
                <div
                  onClick={() => onNavigateCategory?.(category.id)}
                  className="lg:w-64 xl:w-72 shrink-0 relative overflow-hidden bg-slate-950 min-h-[140px] sm:min-h-[200px] lg:min-h-[220px] p-4 sm:p-6 flex flex-col justify-start text-white group cursor-pointer"
                >
                  {/* Background Image */}
                  <img
                    src={category.bgImage}
                    alt={category.name}
                    loading={categoryIndex === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover opacity-65 group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/70" />

                  {/* Category Title & Subtitle */}
                  <div className="relative z-10 pt-2">
                    <h3 className="text-2xl sm:text-3xl sm:text-4xl font-black tracking-tight text-white mb-1.5 drop-shadow-xs">
                      {category.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-slate-200/95 leading-snug drop-shadow-2xs">
                      {category.subtitle}
                    </p>
                  </div>
                </div>

                {/* Right: Grid of Sub-Category Image Tiles (6 Items Max Per Row to avoid awkward whitespace) */}
                <div className="flex-1 p-3 sm:p-5 bg-white flex items-center">
                  <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3.5 w-full">
                    {category.items.slice(0, 6).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          if (onNavigateCategory) {
                            onNavigateCategory(category.id, item.id);
                          } else {
                            onSelectProduct(category.name, item);
                          }
                        }}
                        className="group flex flex-col items-center text-center cursor-pointer focus:outline-none"
                      >
                        {/* Tile Image Box */}
                        <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-2xs group-hover:shadow-md transition-all duration-200 mb-2 relative">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          {/* CSS fallback container */}
                          <div
                            className={`hidden absolute inset-0 bg-gradient-to-br ${item.fallbackBg || 'from-slate-700 to-slate-900'} items-center justify-center p-2 text-white text-center`}
                          >
                            <span className="text-xs font-bold leading-tight">{item.name}</span>
                          </div>
                        </div>

                        {/* Centered Tile Label */}
                        <span className="text-[10px] sm:text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 leading-tight text-center w-full px-0.5">
                          {item.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Bottom Light-Blue Strip (Matches Screenshot Exactly) */}
              <div className="bg-[#F0F9FF] border-t border-sky-100 px-5 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-800 font-semibold">

                {/* Left Side Counts */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                    <Truck className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>{category.supplierCount}</span>
                  </div>

                  <span className="hidden sm:inline-block w-px h-4 bg-slate-200"></span>

                  <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                    <Factory className="w-4 h-4 text-slate-600 shrink-0" />
                    <span>{category.manufacturingCount}</span>
                  </div>
                </div>

                {/* Right Side Link */}
                <button
                  type="button"
                  onClick={onOpenUnits}
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800 transition cursor-pointer self-start sm:self-auto"
                >
                  <span>{category.manufacturingLinkText}</span>
                  <ChevronRight className="w-4 h-4 text-blue-600" />
                </button>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
