export interface ProductSpec {
  [key: string]: string;
}

export interface ProductItem {
  id: string;
  name: string;
  shortName: string;
  category: string;
  categoryLabel: string;
  subCategory: string;
  subCategoryLabel: string;
  brand: string;
  grade: string;
  price: string;
  numericPrice: number;
  unit: string;
  specs: ProductSpec;
  deliveryTime: string;
  imageUrl: string;
  inStock: boolean;
  minOrderMT?: number;
  featured?: boolean;
}

export interface FilterState {
  categories: string[];
  subCategories: string[];
  grades: string[];
  brands: string[];
  searchQuery: string;
  priceRange?: [number, number];
}

export interface CartItem {
  product: ProductItem;
  quantityMT: number;
  selectedCity: string;
}
