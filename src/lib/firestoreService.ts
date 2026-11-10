import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { ProductItem } from '../types/product';
import { Category } from '../types';
import rawProductsData from '../data/products.json';
import categoriesData from '../data/categories.json';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  companyName?: string;
  gstin?: string;
  phone?: string;
  role: 'buyer' | 'admin';
  city?: string;
  state?: string;
  pincode?: string;
  createdAt?: any;
}

export interface QuoteRequest {
  id?: string;
  userId: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  gstin?: string;
  category: string;
  productName: string;
  quantity: number;
  unit: string;
  deliveryLocation: string;
  notes?: string;
  status: 'pending' | 'quoted' | 'accepted' | 'rejected';
  quotedPrice?: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface OrderRecord {
  id?: string;
  userId: string;
  companyName: string;
  contactPhone: string;
  items: Array<{
    id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    unit: string;
  }>;
  totalAmount: number;
  deliveryAddress: string;
  pincode: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  createdAt?: any;
  updatedAt?: any;
}

// User Profile
export async function saveUserProfile(profile: UserProfile): Promise<void> {
  const path = `users/${profile.uid}`;
  try {
    await setDoc(doc(db, 'users', profile.uid), {
      ...profile,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const path = `users/${uid}`;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// Quotes
export async function createQuote(quote: Omit<QuoteRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const path = 'quotes';
  try {
    const docRef = await addDoc(collection(db, 'quotes'), {
      ...quote,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function fetchUserQuotes(userId: string): Promise<QuoteRequest[]> {
  const path = 'quotes';
  try {
    const q = query(collection(db, 'quotes'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const quotes: QuoteRequest[] = [];
    querySnapshot.forEach((d) => {
      quotes.push({ id: d.id, ...d.data() } as QuoteRequest);
    });
    return quotes;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function fetchAllQuotesAdmin(): Promise<QuoteRequest[]> {
  const path = 'quotes';
  if (!auth.currentUser) {
    return [];
  }
  try {
    const querySnapshot = await getDocs(collection(db, 'quotes'));
    const quotes: QuoteRequest[] = [];
    querySnapshot.forEach((d) => {
      quotes.push({ id: d.id, ...d.data() } as QuoteRequest);
    });
    return quotes;
  } catch (error) {
    console.warn('fetchAllQuotesAdmin notice:', error);
    return [];
  }
}

export async function updateQuoteStatus(quoteId: string, status: QuoteRequest['status'], quotedPrice?: number): Promise<void> {
  const path = `quotes/${quoteId}`;
  try {
    await updateDoc(doc(db, 'quotes', quoteId), {
      status,
      ...(quotedPrice !== undefined ? { quotedPrice } : {}),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// Orders
export async function createOrder(order: Omit<OrderRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const path = 'orders';
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...order,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function fetchUserOrders(userId: string): Promise<OrderRecord[]> {
  const path = 'orders';
  try {
    const q = query(collection(db, 'orders'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const orders: OrderRecord[] = [];
    querySnapshot.forEach((d) => {
      orders.push({ id: d.id, ...d.data() } as OrderRecord);
    });
    return orders;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function fetchAllOrdersAdmin(): Promise<OrderRecord[]> {
  const path = 'orders';
  if (!auth.currentUser) {
    return [];
  }
  try {
    const querySnapshot = await getDocs(collection(db, 'orders'));
    const orders: OrderRecord[] = [];
    querySnapshot.forEach((d) => {
      orders.push({ id: d.id, ...d.data() } as OrderRecord);
    });
    return orders;
  } catch (error) {
    console.warn('fetchAllOrdersAdmin notice:', error);
    return [];
  }
}

export async function updateOrderStatus(orderId: string, status: OrderRecord['status']): Promise<void> {
  const path = `orders/${orderId}`;
  try {
    await updateDoc(doc(db, 'orders', orderId), {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// ----------------------------------------------------------------------------
// REAL-TIME PRODUCT CATALOG INTEGRATION (SYNCED ACROSS STORE & ADMIN)
// ----------------------------------------------------------------------------

export async function ensureAdminAuth(): Promise<void> {
  if (!auth.currentUser) {
    try {
      await signInAnonymously(auth);
    } catch (e) {
      console.warn('Anonymous auth sign-in notice:', e);
    }
  }
}

let hasSeededProducts = false;
let isSeedingProducts = false;
let lastProductsFingerprint = '';

export function subscribeToProducts(
  callback: (products: ProductItem[]) => void
): () => void {
  const productsCol = collection(db, 'products');

  const unsubscribe = onSnapshot(
    productsCol,
    async (snapshot) => {
      // If products collection in Firestore is empty, seed it with all real catalog products in ONE atomic batch
      if (snapshot.empty) {
        const initialProducts = rawProductsData as unknown as ProductItem[];
        callback(initialProducts);

        if (!hasSeededProducts && !isSeedingProducts) {
          isSeedingProducts = true;
          try {
            const batch = writeBatch(db);
            for (const item of initialProducts) {
              const docRef = doc(db, 'products', item.id);
              batch.set(docRef, {
                ...item,
                updatedAt: serverTimestamp(),
              });
            }
            await batch.commit();
            hasSeededProducts = true;
          } catch (seedErr) {
            console.warn('Initial product batch seeding notice:', seedErr);
            hasSeededProducts = true; // Mark as attempted to prevent loops
          } finally {
            isSeedingProducts = false;
          }
        }
        return;
      }

      const products: ProductItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        products.push({
          id: docSnap.id,
          name: data.name || '',
          shortName: data.shortName || data.name || '',
          category: data.category || 'metals',
          categoryLabel: data.categoryLabel || 'Industrial Materials',
          subCategory: data.subCategory || 'products',
          subCategoryLabel: data.subCategoryLabel || 'Products',
          brand: data.brand || 'Bable Verified',
          grade: data.grade || 'Commercial Grade',
          price: data.price || `₹${(data.numericPrice || 50000).toLocaleString('en-IN')}`,
          numericPrice: Number(data.numericPrice) || 50000,
          unit: data.unit || '/MT',
          specs: data.specs || {},
          deliveryTime: data.deliveryTime || 'Delivery in 2 - 5 days',
          imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80',
          inStock: data.inStock !== false,
          minOrderMT: data.minOrderMT || 10,
          featured: Boolean(data.featured),
        });
      });

      // Fingerprint check to prevent redundant re-renders and element blinking
      const currentFingerprint = products.map((p) => `${p.id}:${p.price}:${p.numericPrice}`).join('|');
      if (currentFingerprint === lastProductsFingerprint) {
        return;
      }
      lastProductsFingerprint = currentFingerprint;

      callback(products);
    },
    (error) => {
      console.warn('Real-time products subscription notice:', error);
      // Fallback to local data
      const fallback = rawProductsData as unknown as ProductItem[];
      callback(fallback);
    }
  );

  return unsubscribe;
}

export async function addProductToFirestore(product: ProductItem): Promise<void> {
  const path = `products/${product.id}`;
  try {
    await setDoc(doc(db, 'products', product.id), {
      ...product,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateProductPriceInFirestore(
  productId: string,
  numericPrice: number,
  formattedPrice: string
): Promise<void> {
  const path = `products/${productId}`;
  try {
    await updateDoc(doc(db, 'products', productId), {
      numericPrice,
      price: formattedPrice,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteProductFromFirestore(productId: string): Promise<void> {
  const path = `products/${productId}`;
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ----------------------------------------------------------------------------
// REAL-TIME CATEGORIES & SUB-CATEGORIES SYNC (FIRESTORE)
// ----------------------------------------------------------------------------

let hasSeededCategories = false;
let isSeedingCategories = false;
let lastCategoriesFingerprint = '';

export function subscribeToCategories(
  callback: (categories: Category[]) => void
): () => void {
  const categoriesCol = collection(db, 'categories');

  const unsubscribe = onSnapshot(
    categoriesCol,
    async (snapshot) => {
      // If collection is empty, seed it with default categories in atomic batch
      if (snapshot.empty) {
        const initialCategories = categoriesData as Category[];
        callback(initialCategories);

        if (!hasSeededCategories && !isSeedingCategories) {
          isSeedingCategories = true;
          try {
            const batch = writeBatch(db);
            for (const cat of initialCategories) {
              const docRef = doc(db, 'categories', cat.id);
              batch.set(docRef, {
                ...cat,
                items: cat.items.filter((it) => it.id !== 'surf' && it.name.toLowerCase() !== 'surf'),
                updatedAt: serverTimestamp(),
              });
            }
            await batch.commit();
            hasSeededCategories = true;
          } catch (seedErr) {
            console.warn('Initial categories seeding notice:', seedErr);
            hasSeededCategories = true;
          } finally {
            isSeedingCategories = false;
          }
        }
        return;
      }

      const categories: Category[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const defaultCat = (categoriesData as Category[]).find((c) => c.id === docSnap.id);
        categories.push({
          id: docSnap.id,
          name: data.name || '',
          subtitle: data.subtitle || '',
          description: data.description || '',
          bgImage: defaultCat?.bgImage?.startsWith('/Categories_photos/') ? defaultCat.bgImage : (data.bgImage || ''),
          supplierCount: data.supplierCount || '',
          manufacturingCount: data.manufacturingCount || '',
          manufacturingLinkText: data.manufacturingLinkText || 'View Details',
          items: (data.items || [])
            .filter((it: any) => it && it.id !== 'surf' && (it.name || '').toLowerCase() !== 'surf')
            .map((it: any) => {
              const defaultItem = defaultCat?.items.find((d) => d.id === it.id);
              if (defaultItem && defaultItem.imageUrl.startsWith('/Categories_photos/')) {
                return { ...it, imageUrl: defaultItem.imageUrl };
              }
              return it;
            }),
        });
      });

      // Preserve canonical vertical order (metals, chemicals, energy-minerals, agri, industrial-materials)
      const order = ['metals', 'chemicals', 'energy-minerals', 'agri', 'industrial-materials'];
      categories.sort((a, b) => {
        const indexA = order.indexOf(a.id);
        const indexB = order.indexOf(b.id);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.name.localeCompare(b.name);
      });

      // Fingerprint check to prevent unneeded re-renders
      const currentFingerprint = categories
        .map((c) => `${c.id}:${c.items.map((it) => it.id).join(',')}`)
        .join('|');
      if (currentFingerprint === lastCategoriesFingerprint) {
        return;
      }
      lastCategoriesFingerprint = currentFingerprint;

      callback(categories);
    },
    (error) => {
      console.warn('Real-time categories subscription notice:', error);
      callback(categoriesData as Category[]);
    }
  );

  return unsubscribe;
}

export async function saveCategoriesToFirestore(newCategories: Category[]): Promise<void> {
  const path = 'categories';
  try {
    const batch = writeBatch(db);
    for (const cat of newCategories) {
      const docRef = doc(db, 'categories', cat.id);
      batch.set(
        docRef,
        {
          ...cat,
          items: cat.items.filter((it) => it.id !== 'surf' && it.name.toLowerCase() !== 'surf'),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}


