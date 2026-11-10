import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  ChevronDown,
  Search,
  Check,
  Building2,
  Navigation,
  X,
  Sparkles,
  Loader2
} from 'lucide-react';
import {
  UserLocation,
  MAIN_LOCATION,
  MAJOR_CITIES,
  getStoredLocation,
  saveStoredLocation,
  detectLocationFromPincode
} from '../utils/location';

interface LocationSelectorProps {
  className?: string;
  variant?: 'navbar' | 'compact' | 'hero';
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  className = '',
  variant = 'navbar',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<UserLocation>(getStoredLocation);
  const [manualInput, setManualInput] = useState('');
  const [detectedLocation, setDetectedLocation] = useState<UserLocation | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync state with global storage event
  useEffect(() => {
    const handleLocationChange = (e: Event) => {
      const customEvent = e as CustomEvent<UserLocation>;
      if (customEvent.detail) {
        setCurrentLocation(customEvent.detail);
      }
    };
    window.addEventListener('bable_location_changed', handleLocationChange);
    return () => window.removeEventListener('bable_location_changed', handleLocationChange);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle live PIN code or city detection when input changes
  useEffect(() => {
    if (!manualInput.trim()) {
      setDetectedLocation(null);
      setIsDetecting(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsDetecting(true);
      const res = await detectLocationFromPincode(manualInput);
      if (res) {
        setDetectedLocation(res.location);
      } else {
        setDetectedLocation(null);
      }
      setIsDetecting(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [manualInput]);

  const handleSelectLocation = (location: UserLocation) => {
    setCurrentLocation(location);
    saveStoredLocation(location);
    setIsOpen(false);
    setManualInput('');
    setDetectedLocation(null);
  };

  const handleApplyManualInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (detectedLocation) {
      handleSelectLocation(detectedLocation);
    } else if (manualInput.trim()) {
      const customLoc: UserLocation = {
        city: manualInput.trim(),
        state: 'India',
        pincode: /^[1-9][0-9]{5}$/.test(manualInput.trim()) ? manualInput.trim() : '',
        formatted: manualInput.trim(),
      };
      handleSelectLocation(customLoc);
    }
  };

  const handleDetectBrowserLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          // Reverse geocoding fallback
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          if (response.ok) {
            const data = await response.json();
            const city = data.address?.city || data.address?.town || data.address?.suburb || 'Belagavi';
            const state = data.address?.state || 'Karnataka';
            const pincode = data.address?.postcode || '590001';
            const detected: UserLocation = {
              city,
              state,
              pincode,
              formatted: `${city}, ${state} (${pincode})`,
            };
            handleSelectLocation(detected);
          } else {
            handleSelectLocation(MAIN_LOCATION);
          }
        } catch {
          handleSelectLocation(MAIN_LOCATION);
        } finally {
          setGeoLoading(false);
        }
      },
      () => {
        setGeoLoading(false);
        alert('Could not retrieve browser location. Defaulting to Belagavi, Karnataka.');
        handleSelectLocation(MAIN_LOCATION);
      }
    );
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center gap-1.5 transition-all text-left focus:outline-none shrink-0 ${
          variant === 'hero'
            ? 'px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-xs'
            : variant === 'compact'
            ? 'px-2.5 py-1 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-full text-slate-800 text-xs font-semibold'
            : 'px-2.5 sm:px-3 py-1 bg-white/15 hover:bg-white/25 border border-white/25 rounded-full text-white text-xs font-semibold shadow-xs'
        }`}
        aria-expanded={isOpen}
        aria-label="Select delivery location"
      >
        <MapPin className={`w-3.5 h-3.5 shrink-0 group-hover:scale-110 transition-transform ${variant === 'compact' ? 'text-amber-500' : 'text-amber-300'}`} />
        <div className="truncate max-w-[90px] sm:max-w-[110px] md:max-w-[120px] xl:max-w-[150px]">
          <span className={`text-[8.5px] uppercase font-bold block leading-tight truncate ${variant === 'compact' ? 'text-slate-500' : 'text-teal-100'}`}>
            Deliver To
          </span>
          <span className={`font-bold text-xs truncate leading-tight block ${variant === 'compact' ? 'text-slate-900' : 'text-white'}`}>
            {currentLocation.city || 'Belagavi'} {currentLocation.pincode ? `(${currentLocation.pincode})` : ''}
          </span>
        </div>
        <ChevronDown className={`w-3 h-3 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${variant === 'compact' ? 'text-slate-500' : 'text-white/80'}`} />
      </button>

      {/* Dropdown Modal Menu */}
      {isOpen && (
        <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 text-slate-800 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                Select Delivery Location
              </h4>
              <p className="text-[11px] text-slate-500">Prices & freight rates calculated for selected hub</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Current Active Location Badge */}
          <div className="my-3 p-2.5 bg-blue-50/80 border border-blue-200/60 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
              <span className="w-2 h-2 rounded-full bg-blue-600 -ml-4"></span>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-blue-700 tracking-wider block">Active Location</span>
                <span className="text-xs font-bold text-slate-900">{currentLocation.formatted}</span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-600 text-white rounded-md">Selected</span>
          </div>

          {/* Main HQ Location Banner */}
          <div className="mb-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 px-1">Primary Headquarters & Hub</p>
            <button
              onClick={() => handleSelectLocation(MAIN_LOCATION)}
              className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition ${
                currentLocation.isMainLocation || currentLocation.city.toLowerCase() === 'belagavi'
                  ? 'border-teal-500 bg-teal-50/60 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    Belagavi, Karnataka
                    <span className="px-1.5 py-0.2 bg-teal-100 text-teal-800 text-[9px] rounded font-bold">Main HQ (590001)</span>
                  </div>
                  <div className="text-[11px] text-slate-500">Central Supply Hub & Warehouse</div>
                </div>
              </div>
              {(currentLocation.isMainLocation || currentLocation.city.toLowerCase() === 'belagavi') && (
                <Check className="w-4 h-4 text-teal-600 shrink-0" />
              )}
            </button>
          </div>

          {/* Major Cities Selector Grid */}
          <div className="mb-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-1">Major Indian Logistics Hubs</p>
            <div className="max-h-40 overflow-y-auto pr-1 space-y-1 custom-scrollbar">
              {MAJOR_CITIES.slice(1).map((cityObj) => {
                const isSelected = currentLocation.city.toLowerCase() === cityObj.city.toLowerCase();
                return (
                  <button
                    key={cityObj.city}
                    onClick={() => handleSelectLocation(cityObj)}
                    className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs flex items-center justify-between transition ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <span className="truncate">{cityObj.formatted}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Manual PIN Code or Add Location Input */}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-1">
              Add Location / Enter PIN Code
            </p>
            <form onSubmit={handleApplyManualInput} className="space-y-2">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3" />
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="Enter 6-digit PIN (e.g. 590001) or City..."
                  className="w-full pl-8 pr-20 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
                <button
                  type="submit"
                  disabled={!manualInput.trim()}
                  className="absolute right-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-[11px] font-bold transition"
                >
                  Apply
                </button>
              </div>

              {/* PIN Code Detection Feedback */}
              {isDetecting && (
                <div className="flex items-center gap-1.5 text-[11px] text-blue-600 px-1 py-0.5">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Detecting PIN location...</span>
                </div>
              )}

              {detectedLocation && !isDetecting && (
                <div
                  onClick={() => handleSelectLocation(detectedLocation)}
                  className="cursor-pointer p-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900 hover:bg-emerald-100 transition"
                >
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold block">Detected Location:</span>
                      <span className="text-[11px] text-emerald-800">{detectedLocation.formatted}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-1 bg-emerald-600 text-white rounded-md">
                    Select
                  </span>
                </div>
              )}

              {/* Browser Geolocation Button */}
              <button
                type="button"
                onClick={handleDetectBrowserLocation}
                disabled={geoLoading}
                className="w-full py-1.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
              >
                {geoLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                ) : (
                  <Navigation className="w-3.5 h-3.5 text-blue-600" />
                )}
                <span>{geoLoading ? 'Detecting Location...' : 'Use Current Device Location'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
