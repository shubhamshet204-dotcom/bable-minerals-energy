import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LivePricesTicker } from './components/LivePricesTicker';
import { Hero } from './components/Hero';
import { CategoriesWeServe } from './components/CategoriesWeServe';
import { StatsSection } from './components/StatsSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { HowItWorks } from './components/HowItWorks';
import { SocialProofAndCTA } from './components/SocialProofAndCTA';
import { Footer } from './components/Footer';
import { AskBableAIModal } from './components/AskBableAIModal';
import { GetQuoteModal } from './components/GetQuoteModal';
import { ManufacturingUnitsModal } from './components/ManufacturingUnitsModal';
import { CommodityDeskModal } from './components/CommodityDeskModal';
import { LoginModal } from './components/LoginModal';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ProductListingPage } from './components/products/ProductListingPage';
import { CartDrawer } from './components/cart/CartDrawer';
import { CartPage } from './components/cart/CartPage';
import { UserProfilePage } from './components/profile/UserProfilePage';
import { AuthProvider } from './context/AuthContext';
import { CategorySubItem, LivePriceItem, Category } from './types';
import { AdminUser } from './types/admin';
import { ProductItem, CartItem } from './types/product';
import livePricesData from './data/livePrices.json';
import categoriesData from './data/categories.json';
import rawProductsData from './data/products.json';
import { useAuth } from './context/AuthContext';
import {
  subscribeToProducts,
  addProductToFirestore,
  updateProductPriceInFirestore,
  deleteProductFromFirestore,
  subscribeToCategories,
  saveCategoriesToFirestore,
} from './lib/firestoreService';
import { Bot } from 'lucide-react';
import { MobileBottomNav } from './components/MobileBottomNav';

function MainContent() {
  const { user, isAdmin, logout } = useAuth();
  // Navigation & Multi-page routing: 'home' | 'products' | 'category' | 'cart' | 'profile'
  const [currentPage, setCurrentPage] = useState<'home' | 'products' | 'category' | 'cart' | 'profile'>('home');
  const [activeCategory, setActiveCategory] = useState<string>('metals');
  const [activeSubCategory, setActiveSubCategory] = useState<string | undefined>(undefined);

  // App routing mode: 'storefront' or 'admin'
  const [viewMode, setViewMode] = useState<'storefront' | 'admin'>('storefront');
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = sessionStorage.getItem('bable_admin_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Dynamic products catalog (loads from localStorage or products.json)
  const [catalogProducts, setCatalogProducts] = useState<ProductItem[]>(() => {
    const saved = localStorage.getItem('bable_custom_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return rawProductsData as unknown as ProductItem[];
      }
    }
    return rawProductsData as unknown as ProductItem[];
  });

  // Dynamic cart items state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('bable_cart_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // Dynamic live prices state (editable from Admin Panel, displayed on Storefront)
  const [livePrices, setLivePrices] = useState<LivePriceItem[]>(() => {
    const savedPrices = localStorage.getItem('bable_custom_prices');
    if (savedPrices) {
      try {
        return JSON.parse(savedPrices);
      } catch {
        return livePricesData.prices;
      }
    }
    return livePricesData.prices;
  });

  // Dynamic categories state (expandable via Admin Panel "+ Add Product")
  const [categories, setCategories] = useState<Category[]>(() => {
    const savedCategories = localStorage.getItem('bable_custom_categories');
    if (savedCategories) {
      try {
        const parsed = JSON.parse(savedCategories) as Category[];
        const cleaned = parsed.map((cat) => {
          const defaultCat = (categoriesData as Category[]).find((c) => c.id === cat.id);
          return {
            ...cat,
            bgImage: defaultCat?.bgImage?.startsWith('/Categories_photos/') ? defaultCat.bgImage : cat.bgImage,
            items: cat.items
              .filter((it) => it.id !== 'surf' && it.name.toLowerCase() !== 'surf')
              .map((it) => {
                const defaultItem = defaultCat?.items.find((d) => d.id === it.id);
                if (defaultItem && defaultItem.imageUrl.startsWith('/Categories_photos/')) {
                  return { ...it, imageUrl: defaultItem.imageUrl };
                }
                return it;
              }),
          };
        });
        return cleaned;
      } catch {
        return categoriesData as Category[];
      }
    }
    return categoriesData as Category[];
  });

  // Modal dialog states
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [unitsModalOpen, setUnitsModalOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [commodityDeskOpen, setCommodityDeskOpen] = useState(false);

  // Quote modal prefill states
  const [quoteCategory, setQuoteCategory] = useState<string>('Metals');
  const [quoteProduct, setQuoteProduct] = useState<string>('Long Steel');

  // Real-time Firestore synchronization for all products & categories
  useEffect(() => {
    const unsubProducts = subscribeToProducts((realtimeProducts) => {
      setCatalogProducts(realtimeProducts);
    });
    const unsubCategories = subscribeToCategories((realtimeCategories) => {
      setCategories(realtimeCategories);
    });
    return () => {
      unsubProducts();
      unsubCategories();
    };
  }, []);

  // Handle URL hash changes: secret admin portal (#admin-portal-secure-console), #products, #cart, #profile, #category/metals, etc.
  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash;
      if (hash === '#admin-portal-secure-console' || hash === '#admin-console' || hash === '#admin') {
        setViewMode('admin');
      } else if (hash === '#cart') {
        setViewMode('storefront');
        setCurrentPage('cart');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#profile') {
        setViewMode('storefront');
        setCurrentPage('profile');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash.startsWith('#category/')) {
        setViewMode('storefront');
        setCurrentPage('category');
        const parts = hash.replace('#category/', '').split('/');
        setActiveCategory(parts[0] || 'metals');
        setActiveSubCategory(parts[1] || undefined);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#products') {
        setViewMode('storefront');
        setCurrentPage('products');
        setActiveCategory('all');
        setActiveSubCategory(undefined);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setViewMode('storefront');
        if (hash === '#home' || hash === '') {
          setCurrentPage('home');
        }
      }
    };

    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);

  const navigateToHome = () => {
    setViewMode('storefront');
    setCurrentPage('home');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToProfile = () => {
    setViewMode('storefront');
    setCurrentPage('profile');
    window.location.hash = '#profile';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCategory = (catId: string, subCatId?: string) => {
    setViewMode('storefront');
    setCurrentPage('category');
    setActiveCategory(catId);
    setActiveSubCategory(subCatId);
    window.location.hash = subCatId ? `#category/${catId}/${subCatId}` : `#category/${catId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToProducts = () => {
    setViewMode('storefront');
    setCurrentPage('products');
    setActiveCategory('all');
    setActiveSubCategory(undefined);
    window.location.hash = '#products';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCart = () => {
    setViewMode('storefront');
    setCurrentPage('cart');
    window.location.hash = '#cart';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAdmin = () => {
    setViewMode('admin');
    window.location.hash = '#admin-portal-secure-console';
  };

  // Cart operations
  const handleAddToCart = (product: ProductItem) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantityMT: item.quantityMT + (product.minOrderMT || 5) }
            : item
        );
      } else {
        updated = [
          ...prev,
          {
            product,
            quantityMT: product.minOrderMT || 10,
            selectedCity: 'Delhi NCR',
          },
        ];
      }
      localStorage.setItem('bable_cart_items', JSON.stringify(updated));
      return updated;
    });
    setCartDrawerOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item.product.id === productId ? { ...item, quantityMT: quantity } : item
      );
      localStorage.setItem('bable_cart_items', JSON.stringify(updated));
      return updated;
    });
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.product.id !== productId);
      localStorage.setItem('bable_cart_items', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
    localStorage.removeItem('bable_cart_items');
  };

  const handleCheckoutCart = (items: CartItem[]) => {
    const summary = items
      .map((it) => `${it.product.name} (${it.quantityMT} MT)`)
      .join(', ');
    setQuoteCategory('Consolidated Procurement');
    setQuoteProduct(summary);
    setQuoteModalOpen(true);
  };

  // Admin session handlers
  const handleAdminLoginSuccess = (user: AdminUser) => {
    setAdminUser(user);
    sessionStorage.setItem('bable_admin_session', JSON.stringify(user));
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    sessionStorage.removeItem('bable_admin_session');
    navigateToHome();
  };

  const handleUpdateProductPrice = async (
    productId: string,
    newNumericPrice: number,
    formattedPrice: string
  ) => {
    // 1. Update Firestore in real time
    await updateProductPriceInFirestore(productId, newNumericPrice, formattedPrice);

    // 2. Also update live ticker if matching
    setLivePrices((prev) =>
      prev.map((item) => {
        if (
          item.id === productId ||
          item.name.toLowerCase().includes(productId.toLowerCase()) ||
          productId.toLowerCase().includes(item.id.toLowerCase())
        ) {
          return {
            ...item,
            numericPrice: newNumericPrice,
            price: formattedPrice,
          };
        }
        return item;
      })
    );
  };

  const handleAddNewProduct = async (newProduct: ProductItem) => {
    // 1. Add directly to Firestore in real time
    await addProductToFirestore(newProduct);

    // 2. Also add to category items so categories view reflects it immediately
    setCategories((prevCategories) =>
      prevCategories.map((cat) => {
        if (cat.id === newProduct.category) {
          const subItem: CategorySubItem = {
            id: newProduct.id,
            name: newProduct.shortName || newProduct.name,
            spec: newProduct.specs?.Specification || `${newProduct.name} Commercial Grade`,
            badge: 'Verified Stock',
            imageUrl: newProduct.imageUrl,
            fallbackBg: 'from-slate-700 to-slate-900',
            icon: 'Layers',
          };
          return {
            ...cat,
            items: [subItem, ...cat.items],
          };
        }
        return cat;
      })
    );
  };

  const handleDeleteProduct = async (productId: string) => {
    // 1. Remove from Firestore in real time
    await deleteProductFromFirestore(productId);

    // 2. Remove from live prices and categories
    setLivePrices((prev) => prev.filter((p) => p.id !== productId));
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        items: cat.items.filter((it) => it.id !== productId),
      }))
    );
  };

  const handleUpdateCategories = async (newCategories: Category[]) => {
    setCategories(newCategories);
    // Real-time sync to Firestore database
    await saveCategoriesToFirestore(newCategories);
    try {
      localStorage.setItem('bable_custom_categories', JSON.stringify(newCategories));
    } catch (err) {
      console.error('Error persisting custom categories:', err);
    }
  };

  const handleOpenQuote = (category?: string, product?: string) => {
    if (category) setQuoteCategory(category);
    if (product) setQuoteProduct(product);
    setQuoteModalOpen(true);
  };

  const handleSelectProduct = (categoryName: string, item: CategorySubItem) => {
    const lower = categoryName.toLowerCase();
    const catId = lower.includes('metal')
      ? 'metals'
      : lower.includes('chem')
      ? 'chemicals'
      : lower.includes('energy') || lower.includes('mineral') || lower.includes('fuel')
      ? 'energy-minerals'
      : lower.includes('agri')
      ? 'agri'
      : 'industrial-materials';
    navigateToCategory(catId, item.id);
  };

  const handleSelectPriceItem = (item: LivePriceItem) => {
    const lower = item.category.toLowerCase();
    const catId = lower.includes('metal')
      ? 'metals'
      : lower.includes('chem')
      ? 'chemicals'
      : lower.includes('energy') || lower.includes('mineral')
      ? 'energy-minerals'
      : lower.includes('agri')
      ? 'agri'
      : 'industrial-materials';
    navigateToCategory(catId);
  };

  const handleSearch = (query: string) => {
    const lower = query.toLowerCase();
    if (lower.includes('metal') || lower.includes('steel') || lower.includes('beam') || lower.includes('ingot') || lower.includes('sheet') || lower.includes('coil')) {
      navigateToCategory('metals');
    } else if (lower.includes('chem') || lower.includes('bitumen') || lower.includes('methanol') || lower.includes('pvc') || lower.includes('gas') || lower.includes('plastic')) {
      navigateToCategory('chemicals');
    } else if (lower.includes('coal') || lower.includes('petcoke') || lower.includes('lime') || lower.includes('ore') || lower.includes('mineral') || lower.includes('oil') || lower.includes('scrap')) {
      navigateToCategory('energy-minerals');
    } else if (lower.includes('agri') || lower.includes('food') || lower.includes('wheat') || lower.includes('rice') || lower.includes('sugar') || lower.includes('cotton') || lower.includes('fertilizer')) {
      navigateToCategory('agri');
    } else {
      navigateToProducts();
    }
  };

  const handleSelectActionCard = (cardId: string) => {
    if (cardId === 'procurement') {
      navigateToProducts();
    } else if (cardId === 'financing') {
      handleOpenQuote('Financing', '30-90 Day Trade Credit Line');
    } else if (cardId === 'revenue') {
      document.getElementById('live-prices-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // --------------------------------------------------------------------------
  // ADMIN VIEW WITH FIREBASE SECURITY GATE
  // --------------------------------------------------------------------------
  if (viewMode === 'admin') {
    const isAuthorizedAdminSession =
      adminUser &&
      (adminUser.email.toLowerCase() === 'bableminerals.sales@gmail.com' ||
       adminUser.email.toLowerCase() === 'neurosucess@gmail.com' ||
       adminUser.email.toLowerCase().endsWith('@bableminerals.com'));

    const isAuthorizedFirebaseAdmin =
      user &&
      (isAdmin ||
       user.email?.toLowerCase() === 'bableminerals.sales@gmail.com' ||
       user.email?.toLowerCase() === 'neurosucess@gmail.com' ||
       Boolean(user.email?.toLowerCase().endsWith('@bableminerals.com')));

    if (!isAuthorizedAdminSession && !isAuthorizedFirebaseAdmin) {
      return (
        <AdminLogin
          onSuccess={handleAdminLoginSuccess}
          onExit={navigateToHome}
        />
      );
    }

    const activeAdminUser: AdminUser = adminUser || {
      id: `ADM-${user?.uid.slice(0, 6).toUpperCase() || 'SYS'}`,
      name: user?.displayName || 'Enterprise Administrator',
      email: user?.email || 'bableminerals.sales@gmail.com',
      role: 'Super Admin',
      lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    return (
      <AdminDashboard
        currentUser={activeAdminUser}
        onLogout={() => {
          handleAdminLogout();
          logout();
        }}
        onViewStorefront={navigateToHome}
        products={catalogProducts}
        onUpdateProductPrice={handleUpdateProductPrice}
        onAddNewProduct={handleAddNewProduct}
        onDeleteProduct={handleDeleteProduct}
        categories={categories}
        onUpdateCategories={handleUpdateCategories}
      />
    );
  }

  // --------------------------------------------------------------------------
  // MULTI-PAGE: DEDICATED SEPARATE CART PAGE
  // --------------------------------------------------------------------------
  if (currentPage === 'cart') {
    return (
      <>
        <CartPage
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveCartItem}
          onClearCart={handleClearCart}
          onNavigateHome={navigateToHome}
          onNavigateProducts={navigateToProducts}
          onOpenQuote={handleOpenQuote}
          onOpenLogin={() => setLoginModalOpen(true)}
          onOpenAdmin={navigateToAdmin}
          catalogProducts={catalogProducts}
          onAddToCart={handleAddToCart}
        />

        <GetQuoteModal
          isOpen={quoteModalOpen}
          onClose={() => setQuoteModalOpen(false)}
          defaultCategory={quoteCategory}
          defaultProduct={quoteProduct}
        />

        <LoginModal
          isOpen={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
        />

        {/* Mobile Smartphone Bottom App Bar */}
        <MobileBottomNav
          currentPage={currentPage}
          onNavigateHome={navigateToHome}
          onNavigateProducts={navigateToProducts}
          onNavigateCart={navigateToCart}
          onNavigateProfile={navigateToProfile}
          onOpenLogin={() => setLoginModalOpen(true)}
          onOpenQuote={() => handleOpenQuote()}
          cartCount={cartItems.length}
        />
      </>
    );
  }

  // --------------------------------------------------------------------------
  // MULTI-PAGE: CATEGORY / ALL PRODUCTS VIEW (JSW ONE MSME FORMAT)
  // --------------------------------------------------------------------------
  if (currentPage === 'category' || currentPage === 'products') {
    return (
      <>
        <ProductListingPage
          products={catalogProducts}
          selectedCategory={currentPage === 'products' ? 'all' : activeCategory}
          selectedSubCategory={activeSubCategory}
          onNavigateHome={navigateToHome}
          onSelectCategory={(catId, subCatId) => {
            if (catId === 'all') {
              navigateToProducts();
            } else {
              navigateToCategory(catId, subCatId);
            }
          }}
          onOpenQuote={handleOpenQuote}
          onOpenLogin={() => setLoginModalOpen(true)}
          onOpenAdmin={navigateToAdmin}
          onAddToCart={handleAddToCart}
          cartCount={cartItems.length}
          onOpenCart={navigateToCart}
          customCategories={categories}
          onOpenCommodityDesk={() => setCommodityDeskOpen(true)}
        />

        {/* Global Cart Drawer */}
        <CartDrawer
          isOpen={cartDrawerOpen}
          onClose={() => setCartDrawerOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveCartItem}
          onCheckout={(items) => {
            setCartDrawerOpen(false);
            navigateToCart();
          }}
          onBrowseMore={() => setCartDrawerOpen(false)}
        />

        {/* Global Modals */}
        <GetQuoteModal
          isOpen={quoteModalOpen}
          onClose={() => setQuoteModalOpen(false)}
          defaultCategory={quoteCategory}
          defaultProduct={quoteProduct}
        />

        <LoginModal
          isOpen={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
        />

        {/* Mobile Smartphone Bottom App Bar */}
        <MobileBottomNav
          currentPage={currentPage}
          onNavigateHome={navigateToHome}
          onNavigateProducts={navigateToProducts}
          onNavigateCart={navigateToCart}
          onNavigateProfile={navigateToProfile}
          onOpenLogin={() => setLoginModalOpen(true)}
          onOpenQuote={() => handleOpenQuote()}
          cartCount={cartItems.length}
        />
      </>
    );
  }

  // --------------------------------------------------------------------------
  // MULTI-PAGE: USER PROFILE PAGE
  // --------------------------------------------------------------------------
  if (currentPage === 'profile') {
    return (
      <>
        <UserProfilePage
          onNavigateHome={navigateToHome}
          onNavigateProducts={navigateToProducts}
          onOpenQuote={handleOpenQuote}
        />

        <GetQuoteModal
          isOpen={quoteModalOpen}
          onClose={() => setQuoteModalOpen(false)}
          defaultCategory={quoteCategory}
          defaultProduct={quoteProduct}
        />

        <LoginModal
          isOpen={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
        />

        {/* Mobile Smartphone Bottom App Bar */}
        <MobileBottomNav
          currentPage={currentPage}
          onNavigateHome={navigateToHome}
          onNavigateProducts={navigateToProducts}
          onNavigateCart={navigateToCart}
          onNavigateProfile={navigateToProfile}
          onOpenLogin={() => setLoginModalOpen(true)}
          onOpenQuote={() => handleOpenQuote()}
          cartCount={cartItems.length}
        />
      </>
    );
  }

  // --------------------------------------------------------------------------
  // PUBLIC STOREFRONT HOMEPAGE
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 antialiased selection:bg-teal-500 selection:text-white relative pb-20 md:pb-0">
      
      {/* 1. Sticky Gradient Navbar */}
      <Navbar
        onOpenLogin={() => setLoginModalOpen(true)}
        onOpenQuote={() => handleOpenQuote()}
        onOpenUnits={() => setUnitsModalOpen(true)}
        onOpenAdmin={navigateToAdmin}
        onOpenProfile={navigateToProfile}
        onNavigateCategory={navigateToCategory}
        onOpenProducts={navigateToProducts}
        onOpenCart={navigateToCart}
        cartCount={cartItems.length}
      />

      {/* 2. Live Prices Ticker below Navbar */}
      <LivePricesTicker
        onSelectItem={handleSelectPriceItem}
        customPrices={livePrices}
      />

      <main className="flex-1">
        {/* 3. Hero Section */}
        <Hero
          onSearch={handleSearch}
          onSelectActionCard={handleSelectActionCard}
        />

        {/* 4. Categories We Serve Section */}
        <CategoriesWeServe
          onSelectProduct={handleSelectProduct}
          onOpenUnits={() => setUnitsModalOpen(true)}
          customCategories={categories}
          onNavigateCategory={navigateToCategory}
        />

        {/* 5. Stats Counters (Count-up) */}
        <StatsSection />

        {/* Why Choose Us */}
        <WhyChooseUs onOpenQuote={() => handleOpenQuote()} />

        {/* How It Works (4 Steps) */}
        <HowItWorks onOpenQuote={() => handleOpenQuote()} />

        {/* 6. Client Logos, Testimonials & CTA Banner */}
        <SocialProofAndCTA
          onOpenQuote={() => handleOpenQuote()}
          onOpenChat={() => setAiChatOpen(true)}
          onOpenCommodityDesk={() => setCommodityDeskOpen(true)}
        />
      </main>

      {/* 7. Dark Navy Footer */}
      <Footer
        onOpenQuote={() => handleOpenQuote()}
        onOpenUnits={() => setUnitsModalOpen(true)}
        onOpenAdmin={navigateToAdmin}
      />

      {/* EXTRAS: Floating "Ask Bable AI" Button */}
      <aside aria-label="Procurement AI Assistant" className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setAiChatOpen(true)}
          className="group flex items-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full brand-gradient text-white shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ring-4 ring-white/80"
          aria-label="Open Bable AI Procurement Assistant"
        >
          <div className="w-8 h-8 rounded-full bg-white text-blue-700 flex items-center justify-center font-bold text-xs shadow-xs border border-white/40">
            <Bot className="w-4 h-4 text-teal-600" />
          </div>
          
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-extrabold text-xs sm:text-sm tracking-tight text-white">
                Ask Bable AI
              </span>
              <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping"></span>
            </div>
            <span className="text-[10px] text-teal-100 font-medium leading-tight">
              Live Prices & Specs
            </span>
          </div>
        </button>
      </aside>

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={(items) => {
          setCartDrawerOpen(false);
          navigateToCart();
        }}
        onBrowseMore={() => {
          setCartDrawerOpen(false);
          navigateToProducts();
        }}
      />

      {/* Modals */}
      <AskBableAIModal
        isOpen={aiChatOpen}
        onClose={() => setAiChatOpen(false)}
        onOpenQuote={handleOpenQuote}
      />

      <GetQuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        defaultCategory={quoteCategory}
        defaultProduct={quoteProduct}
      />

      <ManufacturingUnitsModal
        isOpen={unitsModalOpen}
        onClose={() => setUnitsModalOpen(false)}
        onOpenQuote={() => handleOpenQuote()}
      />

      <CommodityDeskModal
        isOpen={commodityDeskOpen}
        onClose={() => setCommodityDeskOpen(false)}
        onOpenQuote={() => handleOpenQuote()}
      />

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
