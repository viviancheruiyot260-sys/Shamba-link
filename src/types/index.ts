export type UserRole = 'farmer' | 'buyer';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  county?: string;
  subCounty?: string;
  farmName?: string;
  organizationName?: string;
  createdAt?: string;
}

export type ProduceCategory =
  | 'Vegetables'
  | 'Fruits'
  | 'Grains & Cereals'
  | 'Tubers & Roots'
  | 'Legumes & Pulses'
  | 'Herbs & Spices'
  | 'Dairy & Farm Fresh';

export type ProduceUnit = 'kg' | 'crate (50kg)' | 'bag (90kg)' | 'bunch' | 'piece' | 'ton';

export interface Product {
  id: string;
  title: string;
  description: string;
  category: ProduceCategory;
  priceKes: number;
  quantityAvailable: number;
  unit: ProduceUnit;
  county: string;
  subCounty?: string;
  farmerId: string;
  farmerName: string;
  farmerPhone?: string;
  imageUrl: string;
  harvestDate?: string;
  isOrganic?: boolean;
  minimumOrderQuantity?: number;
  createdAt: string;
}

export interface ProductFilter {
  search?: string;
  category?: string;
  county?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'newest' | 'price_asc' | 'price_desc';
  onlyOrganic?: boolean;
}

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface OrderInquiry {
  id: string;
  buyerName: string;
  buyerPhone: string;
  deliveryCounty: string;
  notes?: string;
  items: OrderItem[];
  totalKes: number;
  status: 'pending' | 'confirmed' | 'fulfilled' | 'cancelled';
  createdAt: string;
}
