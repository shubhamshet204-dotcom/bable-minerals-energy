import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  FileText,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import companyData from '../data/companyData.json';

interface FooterProps {
  onOpenQuote: () => void;
  onOpenUnits: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenQuote, onOpenUnits, onOpenAdmin }) => {
  const { company } = companyData;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="footer" className="bg-[#0B1528] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Col 1 & 2: Brand Identity & Legal Overview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md flex items-center justify-center shrink-0">
                <img
                  src="/logo.png"
                  alt="Bable Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      target.parentElement.innerHTML = '<span class="text-xs font-black text-blue-700">B</span>';
                    }
                  }}
                />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white uppercase block">
                  {company.name}
                </span>
                <span className="text-xs font-semibold text-teal-400">
                  Tech-Enabled Industrial Raw Materials
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              India's premier B2B procurement and smart financing ecosystem for Metals, Industrial Chemicals, Energy & Solid Fuels, and Agri commodities. Delivering transparency, verified quality, and doorstep fulfillment.
            </p>

            <div className="space-y-1 text-xs text-slate-400 pt-2 font-mono">
              <p><span className="text-slate-500 font-sans">CIN:</span> {company.cin}</p>
              <p><span className="text-slate-500 font-sans">GSTIN:</span> {company.gstin}</p>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={onOpenQuote}
                className="px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold text-xs rounded-full shadow hover:opacity-95 transition"
              >
                Request Custom RFQ
              </button>
              <button
                type="button"
                onClick={onOpenUnits}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-full transition border border-slate-700"
              >
                Stocking Facilities
              </button>
            </div>
          </div>

          {/* Col 3: Categories We Serve */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li>
                <button
                  onClick={() => scrollToSection('category-metals')}
                  className="hover:text-teal-300 transition flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" /> Long & Flat Steel
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('category-metals')}
                  className="hover:text-teal-300 transition flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" /> Aluminium, Cu & Zinc
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('category-chemicals')}
                  className="hover:text-teal-300 transition flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" /> Bulk Chemicals & Solvents
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('category-chemicals')}
                  className="hover:text-teal-300 transition flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" /> Bitumen VG30 & VG40
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('category-energy-minerals')}
                  className="hover:text-teal-300 transition flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" /> Thermal & Coking Coal
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('category-energy-minerals')}
                  className="hover:text-teal-300 transition flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" /> Petcoke & Limestone
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('category-agri')}
                  className="hover:text-teal-300 transition flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" /> Bulk Agri & Edible Oils
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Links & Platform */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li>
                <button
                  onClick={() => scrollToSection('live-prices-section')}
                  className="hover:text-blue-300 transition flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" /> Live Mandi Ticker
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('smart-financing-card')}
                  className="hover:text-blue-300 transition flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" /> Smart Trade Financing
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenUnits}
                  className="hover:text-blue-300 transition flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" /> Manufacturing & Port Hubs
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('why-choose-us')}
                  className="hover:text-blue-300 transition flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" /> Quality Labs & NABL MTR
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="hover:text-blue-300 transition flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" /> How It Works
                </button>
              </li>
              <li>
                <a
                  href="#privacy"
                  onClick={(e) => { e.preventDefault(); alert("Bable Enterprise Privacy & Data Security policy is fully GDPR and Indian DPDP Act compliant."); }}
                  className="hover:text-blue-300 transition flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" /> Privacy & Escrow Terms
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact Info */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Contact
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">Belagavi Office:</strong>
                  <p className="text-slate-400">{company.belagaviOffice || 'Belagavi, Karnataka, India'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <a href={`tel:${company.phone}`} className="text-slate-200 font-semibold hover:text-teal-300 transition block">
                    {company.phone}
                  </a>
                  <p className="text-[11px] text-slate-500">Direct Sales & Owner Hotline</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${company.email}`} className="text-slate-200 hover:text-teal-300 transition font-medium">
                  {company.email}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Strip: Copyright & Disclaimers */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Bable Minerals and Energy Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>ISO 9001:2015 Certified Operations</span>
            <span>·</span>
            <span>Zero-Middleman Supply Chain</span>
            <span>·</span>
            <span>Powered by In-House Tech</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
