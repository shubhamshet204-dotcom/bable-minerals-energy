export interface LivePriceItem {
  id: string;
  name: string;
  shortName: string;
  price: string;
  numericPrice: number;
  unit: string;
  location: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  city: string;
  category: string;
}

export interface CategorySubItem {
  id: string;
  name: string;
  spec: string;
  badge: string;
  imageUrl: string;
  fallbackBg: string;
  icon: string;
}

export interface Category {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  bgImage: string;
  supplierCount: string;
  manufacturingCount: string;
  manufacturingLinkText: string;
  items: CategorySubItem[];
}

export interface ManufacturingUnit {
  id: string;
  name: string;
  location: string;
  capacity: string;
  specialty: string;
  certifications: string[];
}

export interface StatItem {
  id: string;
  value: string;
  prefix: string;
  suffix: string;
  label: string;
  description: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  location: string;
  metric: string;
  saving: string;
}
