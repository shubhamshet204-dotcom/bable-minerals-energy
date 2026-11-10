import React from 'react';
import { X, Building2, MapPin, Award, CheckCircle, Factory, ArrowRight } from 'lucide-react';
import companyData from '../data/companyData.json';

interface ManufacturingUnitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuote: () => void;
}

export const ManufacturingUnitsModal: React.FC<ManufacturingUnitsModalProps> = ({
  isOpen,
  onClose,
  onOpenQuote,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-8">
        
        {/* Header */}
        <div className="brand-gradient text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center">
              <Factory className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                Manufacturing Units & Strategic Stocking Hubs
              </h3>
              <p className="text-xs text-teal-100">
                5 Primary Facilities & 4 In-House Brands powering India's raw material supply chain
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto bg-slate-50">
          {companyData.manufacturingUnits.map((unit) => (
            <div
              key={unit.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900">
                    {unit.name}
                  </h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>{unit.location}</span>
                  </p>
                </div>

                <div className="bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold px-3 py-1.5 rounded-full shrink-0 self-start">
                  Capacity: {unit.capacity}
                </div>
              </div>

              <div className="text-xs text-slate-700 bg-slate-50 rounded-xl p-3 mb-3 border border-slate-100">
                <span className="font-bold text-slate-900 mr-1">Core Specialty & Equipment:</span>
                {unit.specialty}
              </div>

              {/* Certifications badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                  Accreditations:
                </span>
                {unit.certifications.map((cert, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-2xs"
                  >
                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* Bottom callout */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h5 className="text-sm font-bold text-blue-950">
                Need Factory Inspection or MTR Physical Verification?
              </h5>
              <p className="text-xs text-blue-700 mt-0.5">
                We coordinate site visits, third-party SGS / Lloyd's inspections, and sample testing prior to bulk dispatch.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenQuote();
              }}
              className="brand-gradient text-white font-bold text-xs px-5 py-2.5 rounded-full shadow hover:opacity-95 transition shrink-0 self-start sm:self-auto cursor-pointer"
            >
              Book Factory Visit / RFQ
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
