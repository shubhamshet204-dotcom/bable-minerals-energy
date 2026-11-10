import React, { useState } from 'react';
import {
  X,
  PackagePlus,
  Layers,
  FlaskConical,
  Flame,
  Wheat,
  Check,
  AlertCircle
} from 'lucide-react';
import { ProductItem } from '../../types/product';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (newProduct: ProductItem) => void;
}

type MainCategory = 'Metals' | 'Chemicals' | 'Energy & Minerals' | 'Agri';

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
}) => {
  const [category, setCategory] = useState<MainCategory>('Metals');
  const [productName, setProductName] = useState('');
  const [priceNumber, setPriceNumber] = useState<number | ''>(52000);
  const [unit, setUnit] = useState<string>('/MT');
  const [city, setCity] = useState<string>('Delhi NCR');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // Curated, beautiful HD industrial images for each category
  const categoryImages: Record<MainCategory, { url: string; label: string }[]> = {
    Metals: [
      {
        url: 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=600&auto=format&fit=crop&q=80',
        label: 'TMT Steel & Bars'
      },
      {
        url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80',
        label: 'Steel Sheets & Coils'
      },
      {
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
        label: 'Stainless Steel'
      },
      {
        url: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=600&auto=format&fit=crop&q=80',
        label: 'Aluminium & Ingots'
      }
    ],
    Chemicals: [
      {
        url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&auto=format&fit=crop&q=80',
        label: 'Bitumen & Asphalt Drums'
      },
      {
        url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=80',
        label: 'Industrial Solvents'
      },
      {
        url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
        label: 'Chemical Tanks'
      },
      {
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
        label: 'Petrochemicals'
      }
    ],
    'Energy & Minerals': [
      {
        url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=600&auto=format&fit=crop&q=80',
        label: 'Coal & Petcoke'
      },
      {
        url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
        label: 'Mineral Ores & Rocks'
      },
      {
        url: 'https://images.unsplash.com/photo-1590496793929-36417d3117de?w=600&auto=format&fit=crop&q=80',
        label: 'Limestone & Gypsum'
      },
      {
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
        label: 'Bulk Fuels'
      }
    ],
    Agri: [
      {
        url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80',
        label: 'Grains & Wheat'
      },
      {
        url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
        label: 'Rice & Paddy'
      },
      {
        url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
        label: 'Agri Inputs & Seeds'
      },
      {
        url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80',
        label: 'Fertilizer & Nutrition'
      }
    ]
  };

  const currentImages = categoryImages[category];

  const handleCategoryChange = (newCat: MainCategory) => {
    setCategory(newCat);
    setSelectedImageIndex(0);
    if (newCat === 'Metals') setPriceNumber(54000);
    else if (newCat === 'Chemicals') setPriceNumber(160);
    else if (newCat === 'Energy & Minerals') setPriceNumber(8500);
    else if (newCat === 'Agri') setPriceNumber(28000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!productName.trim()) {
      setErrorMessage('Please type the product name (e.g. TMT Steel 12mm or Bitumen VG30).');
      return;
    }

    if (!priceNumber || Number(priceNumber) <= 0) {
      setErrorMessage('Please enter a valid price in Rupees.');
      return;
    }

    const num = Number(priceNumber);
    const formattedPrice = `₹${num.toLocaleString('en-IN')}`;
    const cleanId = productName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `item-${Date.now()}`;

    const chosenImageUrl = currentImages[selectedImageIndex]?.url || currentImages[0].url;

    const categoryIdMap: Record<MainCategory, string> = {
      Metals: 'metals',
      Chemicals: 'chemicals',
      'Energy & Minerals': 'energy-minerals',
      Agri: 'agri',
    };

    const newProduct: ProductItem = {
      id: cleanId,
      name: productName.trim(),
      shortName: productName.trim().slice(0, 24),
      category: categoryIdMap[category],
      categoryLabel:
        category === 'Metals'
          ? 'Metals & Metallurgy'
          : category === 'Chemicals'
          ? 'Chemicals, Synthetics & Gases'
          : category === 'Energy & Minerals'
          ? 'Energy, Ores & Fuels'
          : 'Agri & Agricultural Inputs',
      subCategory: `${categoryIdMap[category]}-products`,
      subCategoryLabel: `${category} Products`,
      brand: 'Bable Verified',
      grade: `${category} Commercial Grade`,
      price: formattedPrice,
      numericPrice: num,
      unit: unit,
      specs: {
        Specification: `${productName.trim()} Commercial Grade`,
        Location: `EX-${city}`,
        Condition: 'Primary Mill Quality',
        Certification: 'MTC / ISO 9001 Included',
      },
      deliveryTime: 'Delivery in 2 - 5 days',
      imageUrl: chosenImageUrl,
      inStock: true,
      minOrderMT: 10,
      featured: true,
    };

    onAddProduct(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-950/75 backdrop-blur-xs">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Main Clean Modal Container */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Clean Friendly Header */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner">
              <PackagePlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                Add New Product
              </h3>
              <p className="text-xs text-teal-100 font-medium">
                Saves in real-time to your live online shop
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert if missing fields */}
        {errorMessage && (
          <div className="mx-5 mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-5 max-h-[78vh] overflow-y-auto">

          {/* STEP 1: CATEGORY SELECTION (BIG VISUAL BUTTONS) */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
              Step 1: Choose Category
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleCategoryChange('Metals')}
                className={`p-3 rounded-2xl border-2 text-left flex items-center gap-3 transition cursor-pointer ${
                  category === 'Metals'
                    ? 'border-blue-600 bg-blue-50/80 text-blue-900 shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm">Steel & Metals</div>
                  <div className="text-[10px] text-slate-500 font-medium">TMT, Sheets, Coils</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleCategoryChange('Chemicals')}
                className={`p-3 rounded-2xl border-2 text-left flex items-center gap-3 transition cursor-pointer ${
                  category === 'Chemicals'
                    ? 'border-teal-600 bg-teal-50/80 text-teal-900 shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm">Chemicals</div>
                  <div className="text-[10px] text-slate-500 font-medium">Bitumen, Solvents</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleCategoryChange('Energy & Minerals')}
                className={`p-3 rounded-2xl border-2 text-left flex items-center gap-3 transition cursor-pointer ${
                  category === 'Energy & Minerals'
                    ? 'border-amber-600 bg-amber-50/80 text-amber-900 shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm">Coal & Energy</div>
                  <div className="text-[10px] text-slate-500 font-medium">Coal, Ores, Limestone</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleCategoryChange('Agri')}
                className={`p-3 rounded-2xl border-2 text-left flex items-center gap-3 transition cursor-pointer ${
                  category === 'Agri'
                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Wheat className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm">Agriculture</div>
                  <div className="text-[10px] text-slate-500 font-medium">Wheat, Rice, Feed</div>
                </div>
              </button>
            </div>
          </div>

          {/* STEP 2: PRODUCT NAME */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
              Step 2: Product Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Tata Tiscon 550D TMT or Bitumen VG-30"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-200 focus:border-teal-500 focus:bg-white rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none transition"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Give it the brand or item name your customers look for.
            </p>
          </div>

          {/* STEP 3: PRICE AND LOCATION */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
              Step 3: Price & Location
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="block text-[11px] font-bold text-slate-500 mb-1">
                  Price in Rupees (₹)
                </span>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-slate-500 text-base">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="52000"
                    value={priceNumber}
                    onChange={(e) => setPriceNumber(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-white border-2 border-slate-300 focus:border-teal-500 rounded-xl pl-8 pr-3 py-2.5 text-base font-black text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <span className="block text-[11px] font-bold text-slate-500 mb-1">
                  Unit (How you sell it)
                </span>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full bg-white border-2 border-slate-300 focus:border-teal-500 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none"
                >
                  <option value="/MT">Per Metric Ton (/MT)</option>
                  <option value="/KG">Per Kilogram (/KG)</option>
                  <option value="/Bag">Per 50kg Bag (/Bag)</option>
                  <option value="/Barrel">Per Barrel / Drum</option>
                  <option value="/KL">Per Kilolitre (/KL)</option>
                </select>
              </div>
            </div>

            <div>
              <span className="block text-[11px] font-bold text-slate-500 mb-1">
                Dispatch Hub / City
              </span>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-white border-2 border-slate-300 focus:border-teal-500 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none"
              >
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Belagavi, Karnataka">Belagavi, Karnataka</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Chennai">Chennai</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Raipur">Raipur</option>
              </select>
            </div>
          </div>

          {/* STEP 4: 1-TAP PHOTO SELECTION */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
              Step 4: Pick a Photo (Tap one to select)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {currentImages.map((img, idx) => {
                const isSelected = selectedImageIndex === idx;
                return (
                  <div
                    key={img.url}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative rounded-2xl overflow-hidden cursor-pointer border-3 transition duration-150 aspect-4/3 group ${
                      isSelected
                        ? 'border-teal-600 ring-2 ring-teal-300 shadow-md scale-[1.02]'
                        : 'border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.label}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1.5 text-center">
                      <span className="text-[10px] font-bold text-white block truncate">
                        {img.label}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-md">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* SUBMIT BUTTON - BIG TOUCH TARGET FOR SMARTPHONE */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm sm:text-base shadow-lg active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <PackagePlus className="w-5 h-5" />
              <span>✅ Add Product to Website Now</span>
            </button>
            <p className="text-center text-[11px] text-slate-500 mt-2">
              Saved in real-time to Firestore database. All visitors see it immediately.
            </p>
          </div>

        </form>

      </div>
    </div>
  );
};
