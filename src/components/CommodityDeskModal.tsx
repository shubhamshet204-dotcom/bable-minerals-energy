import React, { useState } from 'react';
import {
  X,
  Phone,
  Mail,
  Copy,
  Check,
  MapPin,
  ExternalLink
} from 'lucide-react';
import companyData from '../data/companyData.json';

interface CommodityDeskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuote?: () => void;
}

export const CommodityDeskModal: React.FC<CommodityDeskModalProps> = ({
  isOpen,
  onClose,
  onOpenQuote,
}) => {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  const rawPhone = companyData.company.phone; // "+91 87920 87909"
  const cleanPhoneDigits = rawPhone.replace(/[^0-9]/g, ''); // "918792087909"
  const email = companyData.company.email; // "bableminerals.sales@gmail.com"
  const location = "Belagavi Office";

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(rawPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const whatsappUrl = `https://wa.me/${cleanPhoneDigits}?text=${encodeURIComponent(
    'Hello, I want to inquire about raw material procurement at Bable Minerals.'
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-md transition-all duration-300 animate-in fade-in ease-out"
      onClick={onClose}
    >
      {/* Compact, Sleek Card Container with Smooth Zoom & Slide Animation */}
      <div
        className="relative w-full max-w-sm bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden text-slate-900 p-5 space-y-4 transition-all duration-300 ease-out animate-in fade-in zoom-in-95 slide-in-from-bottom-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Title + Close Button */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black tracking-tight text-slate-900">
                Commodity Desk
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                <MapPin className="w-3 h-3 text-sky-600" />
                {location}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Bable Minerals & Energy</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Compact Contact Rows */}
        <div className="space-y-3">
          
          {/* Phone & WhatsApp Row */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Direct Call & WhatsApp
              </span>
              <span className="text-sm font-black text-slate-900 tracking-tight block truncate">
                {rawPhone}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* WhatsApp Logo Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Chat on WhatsApp"
                className="w-9 h-9 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center transition-all duration-200 ease-out shadow-xs cursor-pointer hover:scale-110 active:scale-95"
              >
                {/* Official SVG WhatsApp Logo */}
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </a>

              {/* Call Button */}
              <a
                href={`tel:${cleanPhoneDigits}`}
                title="Call Phone"
                className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all duration-200 ease-out shadow-xs cursor-pointer hover:scale-110 active:scale-95"
              >
                <Phone className="w-4 h-4" />
              </a>

              {/* Copy Phone */}
              <button
                type="button"
                onClick={handleCopyPhone}
                title="Copy Phone"
                className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-all duration-200 ease-out shadow-2xs cursor-pointer hover:scale-110 active:scale-95"
              >
                {copiedPhone ? <Check className="w-4 h-4 text-emerald-600 animate-in zoom-in" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Email Row */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Official Gmail
              </span>
              <span className="text-xs font-bold text-slate-900 tracking-tight block truncate font-mono">
                {email}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Mail Button */}
              <a
                href={`mailto:${email}?subject=${encodeURIComponent('Inquiry to Bable Commodity Desk')}`}
                title="Send Gmail"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center transition-all duration-200 ease-out shadow-xs cursor-pointer hover:scale-110 active:scale-95"
              >
                <Mail className="w-4 h-4 text-rose-400" />
              </a>

              {/* Copy Email */}
              <button
                type="button"
                onClick={handleCopyEmail}
                title="Copy Email"
                className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-all duration-200 ease-out shadow-2xs cursor-pointer hover:scale-110 active:scale-95"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-600 animate-in zoom-in" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

        </div>

        {/* Compact Footer Action */}
        {onOpenQuote && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenQuote();
              }}
              className="w-full py-2.5 rounded-2xl brand-gradient text-white text-xs font-bold transition shadow-md hover:opacity-95 cursor-pointer text-center"
            >
              Request Custom Quote →
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
