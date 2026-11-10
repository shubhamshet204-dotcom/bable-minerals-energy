import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  TrendingUp,
  LogOut,
  ExternalLink,
  Search,
  CheckCircle2,
  X,
  Plus,
  Trash2,
  PackagePlus,
  ChevronRight,
  ShieldCheck,
  Edit3,
  Save,
  Package,
  Layers,
  Phone,
  MessageCircle,
  AlertTriangle,
  Flame,
  FlaskConical,
  Wheat,
  Clock,
  Sparkles,
  ArrowRight,
  RefreshCw,
  CloudCheck
} from 'lucide-react';
import {
  AdminUser,
  AdminRFQ,
  RFQStatus
} from '../../types/admin';
import { ProductItem } from '../../types/product';
import { Category, CategorySubItem } from '../../types';
import mockAdminData from '../../data/mockAdminData.json';
import { AddProductModal } from './AddProductModal';
import { AddSubCategoryModal } from './AddSubCategoryModal';
import { fetchAllQuotesAdmin, updateQuoteStatus as updateFirestoreQuoteStatus } from '../../lib/firestoreService';
import { FolderPlus } from 'lucide-react';

interface AdminDashboardProps {
  currentUser: AdminUser;
  onLogout: () => void;
  onViewStorefront: () => void;
  products: ProductItem[];
  onUpdateProductPrice: (productId: string, numericPrice: number, formattedPrice: string) => Promise<void> | void;
  onAddNewProduct: (newProduct: ProductItem) => Promise<void> | void;
  onDeleteProduct: (productId: string) => Promise<void> | void;
  categories: Category[];
  onUpdateCategories: (newCategories: Category[]) => void;
}

type TabType = 'products' | 'categories' | 'rfqs';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onLogout,
  onViewStorefront,
  products,
  onUpdateProductPrice,
  onAddNewProduct,
  onDeleteProduct,
  categories,
  onUpdateCategories,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [rfqList, setRfqList] = useState<AdminRFQ[]>(mockAdminData.rfqs as AdminRFQ[]);

  // Sub-category management state
  const [isAddSubCatModalOpen, setIsAddSubCatModalOpen] = useState(false);
  const [editingSubCat, setEditingSubCat] = useState<{ categoryId: string; item?: CategorySubItem } | null>(null);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');

  const totalSubCategoryCount = categories.reduce((sum, cat) => sum + (cat.items?.length || 0), 0);

  // Load real Firestore Quotes on mount
  useEffect(() => {
    let isSubscribed = true;
    async function loadFirestoreQuotes() {
      try {
        const firestoreQuotes = await fetchAllQuotesAdmin();
        if (isSubscribed && firestoreQuotes && firestoreQuotes.length > 0) {
          const mappedQuotes: AdminRFQ[] = firestoreQuotes.map((q, idx) => ({
            id: q.id || `RFQ-${idx + 1}`,
            companyName: q.companyName || 'Enterprise Buyer',
            buyerName: q.contactName || 'Buyer',
            phone: q.phone || '+91 98765 43210',
            email: q.email || 'buyer@enterprise.com',
            category: q.category || 'Metals',
            material: `${q.productName} (${q.category})`,
            quantityMT: q.quantity || 10,
            destinationCity: q.deliveryLocation || 'Belagavi, Karnataka',
            pinCode: '590001',
            estimatedValue: q.quotedPrice || 500000,
            paymentMode: (q.notes?.toLowerCase().includes('cash') ? 'cash' : 'credit') as any,
            status: (q.status === 'pending'
              ? 'Pending'
              : q.status === 'quoted'
              ? 'Quoted'
              : q.status === 'accepted'
              ? 'Approved'
              : 'Rejected') as RFQStatus,
            submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
            notes: q.notes || '',
          }));
          const existingMock = mockAdminData.rfqs as AdminRFQ[];
          setRfqList([...mappedQuotes, ...existingMock]);
        }
      } catch (err) {
        console.warn('Admin quote load notice:', err);
      }
    }
    loadFirestoreQuotes();
    return () => { isSubscribed = false; };
  }, []);

  // UI State
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // Altering price modal state
  const [priceEditTarget, setPriceEditTarget] = useState<ProductItem | null>(null);
  const [newPriceValue, setNewPriceValue] = useState<number | ''>('');
  const [isSavingPrice, setIsSavingPrice] = useState(false);

  // Delete product confirmation modal state
  const [productToDelete, setProductToDelete] = useState<ProductItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // RFQ inspect modal state
  const [selectedRfq, setSelectedRfq] = useState<AdminRFQ | null>(null);
  const [rfqSearch, setRfqSearch] = useState('');
  const [rfqStatusFilter, setRfqStatusFilter] = useState<string>('All');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  // Open Alter Price Modal
  const handleOpenPriceEdit = (prod: ProductItem) => {
    setPriceEditTarget(prod);
    setNewPriceValue(prod.numericPrice || 0);
  };

  // Save Altered Price to Firestore (Real-time sync)
  const handleSaveAlteredPrice = async () => {
    if (!priceEditTarget || !newPriceValue || Number(newPriceValue) <= 0) return;

    setIsSavingPrice(true);
    try {
      const num = Number(newPriceValue);
      const formatted = `₹${num.toLocaleString('en-IN')}`;

      await onUpdateProductPrice(priceEditTarget.id, num, formatted);
      triggerToast(`✅ Live Price for '${priceEditTarget.name}' updated to ${formatted} ${priceEditTarget.unit}!`);
      setPriceEditTarget(null);
    } catch (err) {
      console.error('Error saving price:', err);
      triggerToast('⚠️ Could not update price. Please try again.');
    } finally {
      setIsSavingPrice(false);
    }
  };

  // Confirm and Execute Product Deletion from Firestore
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await onDeleteProduct(productToDelete.id);
      triggerToast(`🗑️ '${productToDelete.name}' was removed from your live website.`);
      setProductToDelete(null);
    } catch (err) {
      console.error('Error deleting product:', err);
      triggerToast('⚠️ Could not remove product. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Add Product Submit to Firestore
  const handleAddProductSubmit = async (newProduct: ProductItem) => {
    try {
      await onAddNewProduct(newProduct);
      triggerToast(`🎉 Success! '${newProduct.name}' is now live on your website.`);
    } catch (err) {
      console.error('Error adding product:', err);
      triggerToast('⚠️ Error adding product. Please try again.');
    }
  };

  // Update RFQ Status
  const handleUpdateRfqStatus = async (rfqId: string, newStatus: RFQStatus) => {
    setRfqList((prev) =>
      prev.map((r) => (r.id === rfqId ? { ...r, status: newStatus } : r))
    );
    if (selectedRfq && selectedRfq.id === rfqId) {
      setSelectedRfq({ ...selectedRfq, status: newStatus });
    }
    try {
      const fsStatus = newStatus === 'Approved' ? 'accepted' : newStatus === 'Rejected' ? 'rejected' : 'quoted';
      await updateFirestoreQuoteStatus(rfqId, fsStatus);
    } catch {
      // Non-blocking
    }
    triggerToast(`Order status updated to '${newStatus}'`);
  };

  // Sub-category management handlers
  const handleRemoveSubCategory = (catId: string, subCatId: string, subCatName: string) => {
    const updatedCategories = categories.map((cat) => {
      if (cat.id === catId) {
        return {
          ...cat,
          items: cat.items.filter((item) => item.id !== subCatId),
        };
      }
      return cat;
    });
    onUpdateCategories(updatedCategories);
    triggerToast(`🗑️ Sub-category '${subCatName}' removed from website.`);
  };

  const handleSaveSubCategory = (catId: string, subItem: CategorySubItem) => {
    const updatedCategories = categories.map((cat) => {
      if (cat.id === catId) {
        const existsIndex = cat.items.findIndex((it) => it.id === subItem.id);
        let newItems = [...cat.items];
        if (existsIndex >= 0) {
          newItems[existsIndex] = subItem;
        } else {
          newItems.push(subItem);
        }
        return { ...cat, items: newItems };
      }
      return cat;
    });
    onUpdateCategories(updatedCategories);
    triggerToast(`🎉 Sub-category '${subItem.name}' saved and live on website!`);
  };

  // Filtering products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(productSearch.toLowerCase())) ||
      (p.grade && p.grade.toLowerCase().includes(productSearch.toLowerCase())) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase());

    const matchesCategory =
      categoryFilter === 'All' ||
      p.category.toLowerCase() === categoryFilter.toLowerCase() ||
      (categoryFilter === 'Metals' && p.category.includes('metal')) ||
      (categoryFilter === 'Chemicals' && p.category.includes('chem')) ||
      (categoryFilter === 'Energy' && (p.category.includes('energy') || p.category.includes('mineral'))) ||
      (categoryFilter === 'Agri' && p.category.includes('agri'));

    return matchesSearch && matchesCategory;
  });

  // Filter RFQs
  const filteredRfqs = rfqList.filter((r) => {
    const matchesSearch =
      r.companyName.toLowerCase().includes(rfqSearch.toLowerCase()) ||
      r.material.toLowerCase().includes(rfqSearch.toLowerCase()) ||
      r.id.toLowerCase().includes(rfqSearch.toLowerCase());
    const matchesStatus = rfqStatusFilter === 'All' || r.status === rfqStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = rfqList.filter((r) => r.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans selection:bg-teal-500 selection:text-white pb-24">

      {/* TOP HEADER - CRISP, MODERN & CLEAN SMARTPHONE APP BAR */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          
          {/* Logo & Real-Time Sync Status */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-xs flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="Bable" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm sm:text-base text-slate-900 tracking-tight">
                  BABLE OWNER PORTAL
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  LIVE CLOUD SYNC
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500">
                Changes update the public website in real time
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onViewStorefront}
              className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 active:scale-95 text-blue-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-blue-200"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Public</span>
              <span>Website</span>
            </button>

            <button
              onClick={onLogout}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 active:scale-95 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-200"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* TOAST POPUP NOTIFICATION */}
      {showToast && (
        <div className="fixed bottom-6 right-4 left-4 sm:left-auto sm:right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm font-bold animate-in fade-in slide-in-from-bottom-5 border border-slate-700">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 w-full space-y-5">

        {/* OWNER WELCOME & REAL-TIME STATUS BANNER */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Live Website Catalog Manager
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-extrabold">
                {products.length} Products Online
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              The products below match your public website 100%. Alter prices or add/remove products with instant real-time sync.
            </p>
          </div>

          {/* Big Add Product Button */}
          <button
            onClick={() => setIsAddProductModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-md active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <PackagePlus className="w-5 h-5" />
            <span>+ Add New Product</span>
          </button>
        </div>

        {/* BIG THREE-TAB SELECTOR (TOUCH-FRIENDLY SMARTPHONE SWITCH) */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 bg-slate-200/80 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`py-3 px-2 sm:px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'products'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="truncate">Products ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`py-3 px-2 sm:px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-teal-600 shrink-0" />
            <span className="truncate">Sub-Categories ({totalSubCategoryCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rfqs')}
            className={`py-3 px-2 sm:px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'rfqs'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="truncate">Inquiries</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black shrink-0">
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: WEBSITE PRODUCTS (MATCHING 100% WITH STOREFRONT) */}
        {/* ========================================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            
            {/* Search Box & Quick Clear */}
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products by name or brand (e.g. Tata, Bitumen, JSW, Coal)..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full bg-white border-2 border-slate-200 focus:border-teal-500 rounded-2xl pl-12 pr-10 py-3.5 text-sm sm:text-base font-bold text-slate-900 placeholder-slate-400 shadow-xs focus:outline-none transition"
              />
              {productSearch && (
                <button
                  onClick={() => setProductSearch('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills (Horizontal Scroll on Mobile) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
              {[
                { label: 'All', icon: '🌟 All Products' },
                { label: 'Metals', icon: '🏗️ Steel & Metals' },
                { label: 'Chemicals', icon: '🧪 Chemicals' },
                { label: 'Energy', icon: '⚡ Coal & Minerals' },
                { label: 'Agri', icon: '🌾 Agriculture' },
              ].map((cat) => {
                const isActive = categoryFilter === cat.label;
                return (
                  <button
                    key={cat.label}
                    onClick={() => setCategoryFilter(cat.label)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer border ${
                      isActive
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span>{cat.icon}</span>
                  </button>
                );
              })}
            </div>

            {/* Product Count Indicator */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
              <span>Showing {filteredProducts.length} live website products</span>
              <span className="text-emerald-700 flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Real-time Firestore Sync
              </span>
            </div>

            {/* Products List (Cards Optimized for Easy Smartphone Tapping) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-slate-200 hover:border-slate-300 rounded-3xl p-4 sm:p-5 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    
                    {/* Thumbnail & Category Tag */}
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.onerror = null;
                            target.src = '/logo.png';
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 truncate">
                            {p.category}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                            🟢 In Stock
                          </span>
                        </div>
                        <span className="text-xs font-bold text-blue-600 block truncate">
                          {p.brand} · {p.grade}
                        </span>
                      </div>
                    </div>

                    {/* Product Name */}
                    <h3 className="font-black text-base text-slate-900 leading-snug line-clamp-2">
                      {p.name}
                    </h3>

                    {/* Prominent Price Box */}
                    <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider block">
                          Website Selling Price
                        </span>
                        <span className="text-xl sm:text-2xl font-black text-emerald-950 font-mono">
                          {p.price}
                        </span>
                        <span className="text-xs font-bold text-emerald-700 ml-1">
                          {p.unit}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-mono text-slate-500 block">
                          Numeric Rate
                        </span>
                        <span className="text-xs font-bold text-slate-800 font-mono">
                          ₹{p.numericPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ACTION BUTTONS: ALTER PRICE & REMOVE */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleOpenPriceEdit(p)}
                      className="py-3 px-3 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Change Price</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setProductToDelete(p)}
                      className="py-3 px-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 active:scale-95 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-slate-800">No matching products found</h4>
                <p className="text-xs text-slate-500">
                  Try searching for a different keyword or tap '+ Add New Product'.
                </p>
                <button
                  onClick={() => setIsAddProductModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                >
                  + Add Product to Website
                </button>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SUB-CATEGORIES MANAGER (ADD, EDIT, DELETE TILES) */}
        {/* ========================================================================= */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            
            {/* Header Box */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Layers className="w-5 h-5 text-teal-600" />
                  <span>Sub-Categories & Verticals Manager</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Add new sub-categories or remove unwanted ones (e.g. test tiles like 'surf'). Updates live website tiles in real time.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingSubCat(null);
                  setIsAddSubCatModalOpen(true);
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-teal-600 hover:opacity-95 text-white font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <FolderPlus className="w-4 h-4" />
                <span>+ Add Sub-Category</span>
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedCategoryTab('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                  selectedCategoryTab === 'all'
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                🌟 All Verticals ({categories.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategoryTab(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                    selectedCategoryTab === cat.id
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {cat.name} ({cat.items.length})
                </button>
              ))}
            </div>

            {/* Category Blocks */}
            {categories
              .filter((cat) => selectedCategoryTab === 'all' || selectedCategoryTab === cat.id)
              .map((cat) => (
                <div key={cat.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
                  
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
                        {cat.name} Vertical
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                        {cat.subtitle} ({cat.items.length} Active Sub-Categories)
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingSubCat({ categoryId: cat.id, item: null as any });
                        setIsAddSubCatModalOpen(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-blue-700 hover:text-blue-800 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer border border-slate-200 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Sub-Category</span>
                    </button>
                  </div>

                  {cat.items.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                      <p className="text-xs font-bold text-slate-500">No sub-categories in {cat.name}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSubCat({ categoryId: cat.id, item: null as any });
                          setIsAddSubCatModalOpen(true);
                        }}
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        + Add first sub-category
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {cat.items.map((subItem) => (
                        <div
                          key={subItem.id}
                          className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:bg-white hover:shadow-sm transition"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0 p-0.5 shadow-2xs">
                              <img
                                src={subItem.imageUrl}
                                alt={subItem.name}
                                className="w-full h-full object-cover rounded-lg"
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  target.onerror = null;
                                  target.src = '/logo.png';
                                }}
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <span className="font-extrabold text-sm text-slate-900 truncate">
                                  {subItem.name}
                                </span>
                                {subItem.badge && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-teal-100 text-teal-800 shrink-0">
                                    {subItem.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 leading-snug line-clamp-2">
                                {subItem.spec}
                              </p>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                            <span className="text-[10px] font-mono text-slate-400 truncate max-w-[120px]">
                              ID: {subItem.id}
                            </span>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingSubCat({ categoryId: cat.id, item: subItem });
                                  setIsAddSubCatModalOpen(true);
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                title="Edit sub-category"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Edit</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleRemoveSubCategory(cat.id, subItem.id, subItem.name)}
                                className="px-2.5 py-1.5 rounded-lg bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                                title="Remove sub-category"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}

                </div>
              ))}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CUSTOMER ORDERS & INQUIRIES */}
        {/* ========================================================================= */}
        {activeTab === 'rfqs' && (
          <div className="space-y-4">
            
            {/* Orders Header and Status Filters */}
            <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Customer Quotes & Inquiries
                </h2>
                <p className="text-xs text-slate-500">
                  Direct phone calls and WhatsApp with buyers requesting quotes.
                </p>
              </div>

              {/* Status Filters */}
              <div className="flex flex-wrap items-center gap-1.5">
                {['All', 'Pending', 'Quoted', 'Approved'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setRfqStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      rfqStatusFilter === st
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredRfqs.map((rfq) => (
                <div
                  key={rfq.id}
                  className="bg-white border border-slate-200 hover:border-slate-300 rounded-3xl p-4 sm:p-5 shadow-xs transition space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Status Pill & Order ID */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-slate-400">
                        {rfq.id}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                          rfq.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : rfq.status === 'Dispatched'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : rfq.status === 'Quoted'
                            ? 'bg-sky-100 text-sky-800 border border-sky-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {rfq.status}
                      </span>
                    </div>

                    {/* Buyer Information */}
                    <div>
                      <h3 className="font-black text-base text-slate-900 leading-snug">
                        {rfq.companyName}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Contact: {rfq.buyerName}
                      </p>
                    </div>

                    {/* One-Tap Phone & WhatsApp Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`tel:${rfq.phone}`}
                        className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-200 transition"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Call Customer</span>
                      </a>

                      <a
                        href={`https://wa.me/${rfq.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(rfq.buyerName)},%20regarding%20your%20order%20for%20${encodeURIComponent(rfq.material)}%20at%20Bable%20Minerals`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2.5 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 active:scale-95 text-teal-800 font-bold text-xs flex items-center justify-center gap-1.5 border border-teal-200 transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-teal-600" />
                        <span>WhatsApp</span>
                      </a>
                    </div>

                    {/* Material Details */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs space-y-1.5">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>Material:</span>
                        <span className="text-teal-700 text-right">{rfq.material}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Quantity:</span>
                        <span className="font-bold text-slate-900">{rfq.quantityMT} MT</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Destination:</span>
                        <span>{rfq.destinationCity}</span>
                      </div>
                    </div>
                  </div>

                  {/* Total Value & Quick Status Action */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">Order Value:</span>
                      <span className="font-mono font-black text-base text-slate-900">
                        ₹{rfq.estimatedValue.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateRfqStatus(rfq.id, 'Approved')}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs transition cursor-pointer shadow-xs"
                      >
                        ✓ Approve Order
                      </button>
                      <button
                        onClick={() => setSelectedRfq(rfq)}
                        className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* ALTER PRODUCT PRICE MODAL (REAL-TIME CLOUD UPDATE) */}
      {/* ========================================================================= */}
      {priceEditTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="fixed inset-0" onClick={() => !isSavingPrice && setPriceEditTarget(null)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 z-10 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider block">
                  Change Live Selling Price
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {priceEditTarget.name}
                </h3>
              </div>
              <button
                onClick={() => !isSavingPrice && setPriceEditTarget(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
              <span className="text-xs text-slate-500 font-bold block mb-1">Current Website Price</span>
              <span className="text-2xl font-black text-slate-900 font-mono">
                {priceEditTarget.price} {priceEditTarget.unit}
              </span>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                New Price in Rupees (₹)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-500 text-lg">
                  ₹
                </span>
                <input
                  type="number"
                  min="1"
                  value={newPriceValue}
                  onChange={(e) => setNewPriceValue(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-white border-2 border-slate-300 focus:border-teal-500 rounded-2xl pl-9 pr-4 py-3.5 text-xl font-black text-slate-900 focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Quick 1-Tap Adjust Buttons */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 block mb-1.5">Quick Adjust:</span>
              <div className="grid grid-cols-4 gap-1.5">
                {[500, 1000, -500, -1000].map((delta) => (
                  <button
                    key={delta}
                    type="button"
                    onClick={() => {
                      const cur = Number(newPriceValue) || priceEditTarget.numericPrice || 0;
                      setNewPriceValue(Math.max(1, cur + delta));
                    }}
                    className="py-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 text-xs font-bold border border-slate-200 transition"
                  >
                    {delta > 0 ? `+₹${delta}` : `-₹${Math.abs(delta)}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                disabled={isSavingPrice}
                onClick={handleSaveAlteredPrice}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-md active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSavingPrice ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Syncing to Firestore...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save New Price to Website</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={isSavingPrice}
                onClick={() => setPriceEditTarget(null)}
                className="w-full py-2.5 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE PRODUCT CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="fixed inset-0" onClick={() => !isDeleting && setProductToDelete(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 z-10 text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">Remove from Website?</h3>
              <p className="text-xs text-slate-600 mt-1">
                Are you sure you want to remove <strong>"{productToDelete.name}"</strong>? It will instantly disappear from the public website for all buyers.
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-98 text-white font-black text-sm shadow-md transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Removing from Cloud...</span>
                  </>
                ) : (
                  <span>Yes, Remove Product</span>
                )}
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setProductToDelete(null)}
                className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Cancel, Keep Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ORDER DETAILS MODAL */}
      {/* ========================================================================= */}
      {selectedRfq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="fixed inset-0" onClick={() => setSelectedRfq(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 z-10 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs text-teal-600 font-bold">{selectedRfq.id}</span>
                <h3 className="text-lg font-black text-slate-900">{selectedRfq.companyName}</h3>
              </div>
              <button
                onClick={() => setSelectedRfq(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-800 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Contact Person:</span>
                <span className="font-bold text-slate-900">{selectedRfq.buyerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <a href={`tel:${selectedRfq.phone}`} className="font-bold text-blue-600 underline">
                  {selectedRfq.phone}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-medium text-slate-800">{selectedRfq.email}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                <span className="text-slate-500">Material Requested:</span>
                <span className="text-teal-700">{selectedRfq.material}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Quantity:</span>
                <span className="font-black text-slate-900">{selectedRfq.quantityMT} MT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery Location:</span>
                <span className="font-medium text-slate-800">{selectedRfq.destinationCity}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-black text-slate-900">
                <span>Total Value:</span>
                <span className="text-emerald-700 font-mono">
                  ₹{selectedRfq.estimatedValue.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {selectedRfq.notes && (
              <div className="text-xs bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-xl">
                <strong>Buyer Note:</strong> {selectedRfq.notes}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  handleUpdateRfqStatus(selectedRfq.id, 'Approved');
                  setSelectedRfq(null);
                }}
                className="py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-xs transition"
              >
                ✓ Approve & Dispatch
              </button>
              <button
                onClick={() => {
                  handleUpdateRfqStatus(selectedRfq.id, 'Rejected');
                  setSelectedRfq(null);
                }}
                className="py-3 rounded-2xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs transition"
              >
                Reject Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onAddProduct={handleAddProductSubmit}
      />

      {/* ADD / EDIT SUB-CATEGORY MODAL */}
      <AddSubCategoryModal
        isOpen={isAddSubCatModalOpen}
        onClose={() => setIsAddSubCatModalOpen(false)}
        categories={categories}
        onSaveSubCategory={handleSaveSubCategory}
        initialSubCategory={editingSubCat}
      />

    </div>
  );
};
