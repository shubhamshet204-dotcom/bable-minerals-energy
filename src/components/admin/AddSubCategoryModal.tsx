import React, { useState } from 'react';
import {
  X,
  Layers,
  FlaskConical,
  Flame,
  Wheat,
  Plus,
  AlertCircle,
  FolderPlus,
  Sparkles
} from 'lucide-react';
import { Category, CategorySubItem } from '../../types';

interface AddSubCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSaveSubCategory: (categoryId: string, subCategory: CategorySubItem) => void;
  initialSubCategory?: { categoryId: string; item?: CategorySubItem } | null;
}

export const AddSubCategoryModal: React.FC<AddSubCategoryModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSaveSubCategory,
  initialSubCategory,
}) => {
  const defaultCat = initialSubCategory?.categoryId || categories[0]?.id || 'metals';
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(defaultCat);
  const [name, setName] = useState(initialSubCategory?.item?.name || '');
  const [spec, setSpec] = useState(initialSubCategory?.item?.spec || '');
  const [badge, setBadge] = useState(initialSubCategory?.item?.badge || 'Prime Grade');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [customImageUrl, setCustomImageUrl] = useState(initialSubCategory?.item?.imageUrl || '');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // Preset curated high-res industrial photos for sub-categories
  const presetImages = [
    {
      url: 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=600&auto=format&fit=crop&q=80',
      label: 'Steel & Beams'
    },
    {
      url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80',
      label: 'Sheets & Coils'
    },
    {
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      label: 'Stainless Steel'
    },
    {
      url: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=600&auto=format&fit=crop&q=80',
      label: 'Aluminium Ingots'
    },
    {
      url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80',
      label: 'Copper Rods'
    },
    {
      url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&auto=format&fit=crop&q=80',
      label: 'Bitumen & Chemicals'
    },
    {
      url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=80',
      label: 'Bulk Solvents'
    },
    {
      url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=600&auto=format&fit=crop&q=80',
      label: 'Coal & Petcoke'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter a sub-category name (e.g. Structural Steel or Bulk Bitumen).');
      return;
    }

    const cleanId = initialSubCategory?.item?.id || name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `subcat-${Date.now()}`;
    const chosenImage = customImageUrl.trim() || presetImages[selectedImageIndex]?.url || presetImages[0].url;

    const subItem: CategorySubItem = {
      id: cleanId,
      name: name.trim(),
      spec: spec.trim() || `${name.trim()} Commercial Specifications`,
      badge: badge.trim() || 'Verified Stock',
      imageUrl: chosenImage,
      fallbackBg: 'from-slate-700 to-blue-950',
      icon: 'Layers'
    };

    onSaveSubCategory(selectedCategoryId, subItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-950/75 backdrop-blur-xs">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 via-teal-600 to-emerald-600 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner">
              <FolderPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                {initialSubCategory ? 'Edit Sub-Category' : 'Add New Sub-Category'}
              </h3>
              <p className="text-xs text-teal-100 font-medium">
                Appears instantly on your storefront Categories section
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

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-5 mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          
          {/* Main Vertical Selection */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
              Select Main Category Vertical
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer flex items-center gap-2.5 ${
                    selectedCategoryId === cat.id
                      ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-bold shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 font-medium'
                  }`}
                >
                  <span className="text-xs">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sub-Category Name */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
              Sub-Category Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Structural Steel, Bulk Bitumen, PVC Compounds..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
          </div>

          {/* Specification Subtitle */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
              Short Description / Specifications Preview
            </label>
            <input
              type="text"
              placeholder="e.g. TMT Fe 550D, Beams, Angles, Channels, Wire Rods"
              value={spec}
              onChange={(e) => setSpec(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
          </div>

          {/* Badge Tag */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
              Badge Tag
            </label>
            <input
              type="text"
              placeholder="e.g. Hot Rolled, Prime Quality, ASTM Standard"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
          </div>

          {/* Visual Thumbnail Picker */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
              Choose Thumbnail Image
            </label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {presetImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedImageIndex(idx);
                    setCustomImageUrl('');
                  }}
                  className={`aspect-4/3 rounded-xl overflow-hidden relative border-2 transition cursor-pointer ${
                    selectedImageIndex === idx && !customImageUrl
                      ? 'border-blue-600 ring-2 ring-blue-300 scale-105 shadow-md'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <input
              type="url"
              placeholder="Or paste custom image URL (https://...)"
              value={customImageUrl}
              onChange={(e) => setCustomImageUrl(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full brand-gradient text-white font-black text-xs shadow-md hover:opacity-95 active:scale-95 transition cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>{initialSubCategory ? 'Save Changes' : 'Add Sub-Category'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
