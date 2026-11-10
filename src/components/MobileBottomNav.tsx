import React from 'react';
import { Home, Package, ShoppingCart, User, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface MobileBottomNavProps {
  currentPage: string;
  onNavigateHome: () => void;
  onNavigateProducts: () => void;
  onNavigateCart: () => void;
  onNavigateProfile: () => void;
  onOpenLogin: () => void;
  onOpenQuote: () => void;
  cartCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPage,
  onNavigateHome,
  onNavigateProducts,
  onNavigateCart,
  onNavigateProfile,
  onOpenLogin,
  onOpenQuote,
  cartCount,
}) => {
  const { user } = useAuth();

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 pb-safe"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        
        {/* 1. Home */}
        <button
          type="button"
          onClick={onNavigateHome}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 text-center transition-colors ${
            currentPage === 'home' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
          aria-label="Home"
        >
          <Home className={`w-5 h-5 transition-transform ${currentPage === 'home' ? 'scale-110 text-blue-600 stroke-[2.2]' : 'stroke-[1.7]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
        </button>

        {/* 2. Products / Catalog */}
        <button
          type="button"
          onClick={onNavigateProducts}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 text-center transition-colors ${
            currentPage === 'products' || currentPage === 'category' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
          aria-label="Products Catalog"
        >
          <Package className={`w-5 h-5 transition-transform ${currentPage === 'products' || currentPage === 'category' ? 'scale-110 text-blue-600 stroke-[2.2]' : 'stroke-[1.7]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Catalog</span>
        </button>

        {/* 3. Center Highlight: Instant Quote / RFQ */}
        <button
          type="button"
          onClick={onOpenQuote}
          className="flex flex-col items-center justify-center -mt-4 group focus:outline-none"
          aria-label="Request Instant Quote"
        >
          <div className="w-12 h-12 rounded-full brand-gradient text-white flex items-center justify-center shadow-lg shadow-teal-500/30 ring-4 ring-white group-hover:scale-105 active:scale-95 transition-transform">
            <FileText className="w-5 h-5 text-white stroke-[2.2]" />
          </div>
          <span className="text-[10px] mt-0.5 font-bold text-slate-800 tracking-tight">RFQ Quote</span>
        </button>

        {/* 4. Cart */}
        <button
          type="button"
          onClick={onNavigateCart}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 text-center transition-colors relative ${
            currentPage === 'cart' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
          aria-label="View Cart"
        >
          <div className="relative">
            <ShoppingCart className={`w-5 h-5 transition-transform ${currentPage === 'cart' ? 'scale-110 text-blue-600 stroke-[2.2]' : 'stroke-[1.7]'}`} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Cart</span>
        </button>

        {/* 5. Account / Profile */}
        <button
          type="button"
          onClick={user ? onNavigateProfile : onOpenLogin}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 text-center transition-colors ${
            currentPage === 'profile' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
          aria-label={user ? 'My Profile' : 'Sign In'}
        >
          <User className={`w-5 h-5 transition-transform ${currentPage === 'profile' ? 'scale-110 text-blue-600 stroke-[2.2]' : 'stroke-[1.7]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">{user ? 'Account' : 'Login'}</span>
        </button>

      </div>
    </nav>
  );
};
