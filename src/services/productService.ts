import { supabase } from '../lib/supabase';
import { isSupabaseConfigured } from '../config/supabase';
import { Product, ProductFilter, ProduceCategory } from '../types';

export const KENYAN_COUNTIES = [
  'Nakuru',
  'Nyandarua',
  'Kiambu',
  'Meru',
  'Nyeri',
  'Murang\'a',
  'Uasin Gishu',
  'Trans Nzoia',
  'Kirinyaga',
  'Machakos',
  'Kisii',
  'Narok',
  'Bungoma',
  'Kakamega',
  'Makueni',
  'Kajiado',
  'Kilifi',
  'Nairobi',
] as const;

export const PRODUCE_CATEGORIES: ProduceCategory[] = [
  'Vegetables',
  'Fruits',
  'Grains & Cereals',
  'Tubers & Roots',
  'Legumes & Pulses',
  'Herbs & Spices',
  'Dairy & Farm Fresh',
];

export interface FetchProductsResponse {
  products: Product[];
  isConfigured: boolean;
  error: string | null;
}

export const productService = {
  async getProducts(filters?: ProductFilter): Promise<FetchProductsResponse> {
    if (!isSupabaseConfigured || !supabase) {
      return {
        products: [],
        isConfigured: false,
        error: null,
      };
    }

    try {
      let query = supabase
        .from('products')
        .select('*');

      if (filters?.search) {
        query = query.ilike('title', `%${filters.search}%`);
      }

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.county) {
        query = query.eq('county', filters.county);
      }

      if (filters?.onlyOrganic) {
        query = query.eq('is_organic', true);
      }

      if (filters?.minPrice !== undefined) {
        query = query.gte('price_kes', filters.minPrice);
      }

      if (filters?.maxPrice !== undefined) {
        query = query.lte('price_kes', filters.maxPrice);
      }

      if (filters?.sortBy === 'price_asc') {
        query = query.order('price_kes', { ascending: true });
      } else if (filters?.sortBy === 'price_desc') {
        query = query.order('price_kes', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        return {
          products: [],
          isConfigured: true,
          error: error.message,
        };
      }

      // Map snake_case DB columns to camelCase
      const mappedProducts: Product[] = (data || []).map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description || '',
        category: row.category as ProduceCategory,
        priceKes: Number(row.price_kes),
        quantityAvailable: Number(row.quantity_available),
        unit: row.unit,
        county: row.county,
        subCounty: row.sub_county,
        farmerId: row.farmer_id,
        farmerName: row.farmer_name || 'Kenyan Farmer',
        farmerPhone: row.farmer_phone,
        imageUrl: row.image_url || '',
        harvestDate: row.harvest_date,
        isOrganic: Boolean(row.is_organic),
        minimumOrderQuantity: row.minimum_order_quantity ? Number(row.minimum_order_quantity) : 1,
        createdAt: row.created_at,
      }));

      return {
        products: mappedProducts,
        isConfigured: true,
        error: null,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to query database';
      return {
        products: [],
        isConfigured: true,
        error: msg,
      };
    }
  },

  async createProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<{ success: boolean; error: string | null; id?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        error: 'Supabase database is not configured in .env. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
      };
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          title: product.title,
          description: product.description,
          category: product.category,
          price_kes: product.priceKes,
          quantity_available: product.quantityAvailable,
          unit: product.unit,
          county: product.county,
          sub_county: product.subCounty,
          farmer_id: product.farmerId,
          farmer_name: product.farmerName,
          farmer_phone: product.farmerPhone,
          image_url: product.imageUrl,
          harvest_date: product.harvestDate,
          is_organic: product.isOrganic,
          minimum_order_quantity: product.minimumOrderQuantity || 1,
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null, id: data.id };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create listing';
      return { success: false, error: msg };
    }
  },

  // Reference showcase items for UI preview when developer tests without DB
  getSamplePreviewProducts(): Product[] {
    return [
      {
        id: 'sample-1',
        title: 'Export-Grade Hass Avocados',
        description: 'Naturally ripened Hass avocados harvested from volcanic soils of Murang\'a. High oil content, dark pebbled skin.',
        category: 'Fruits',
        priceKes: 180,
        quantityAvailable: 450,
        unit: 'kg',
        county: 'Murang\'a',
        subCounty: 'Kandara',
        farmerId: 'demo-farmer-1',
        farmerName: 'Wanjiku Kamau (Green Valley Shamba)',
        farmerPhone: '+254 712 345 678',
        imageUrl: '/src/assets/images/produce_avocados_fresh_1792156700559.jpg',
        harvestDate: '2026-10-14',
        isOrganic: true,
        minimumOrderQuantity: 10,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'sample-2',
        title: 'Crisp Extra-Fine French Beans (Haricots Verts)',
        description: 'Tender hand-picked green beans, uniform length, zero stringiness. Ideal for commercial kitchens, supermarkets, and hospitality.',
        category: 'Vegetables',
        priceKes: 140,
        quantityAvailable: 800,
        unit: 'kg',
        county: 'Nyandarua',
        subCounty: 'Ol Kalou',
        farmerId: 'demo-farmer-2',
        farmerName: 'Kiprono Cheruiyot (Aberdare Fresh)',
        farmerPhone: '+254 723 456 789',
        imageUrl: '/src/assets/images/produce_french_beans_1792156700988.jpg',
        harvestDate: '2026-10-15',
        isOrganic: true,
        minimumOrderQuantity: 15,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'sample-3',
        title: 'Fresh Dutch Rikea Potatoes',
        description: 'High-density starchy yellow-flesh potatoes washed and sorted in standard 50kg bags. Perfect for chips and boiling.',
        category: 'Tubers & Roots',
        priceKes: 3200,
        quantityAvailable: 120,
        unit: 'bag (90kg)',
        county: 'Nakuru',
        subCounty: 'Molo',
        farmerId: 'demo-farmer-3',
        farmerName: 'David Mwangi (Highland Roots)',
        farmerPhone: '+254 734 567 890',
        imageUrl: '/src/assets/images/produce_avocados_fresh_1792156700559.jpg',
        harvestDate: '2026-10-12',
        isOrganic: false,
        minimumOrderQuantity: 2,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'sample-4',
        title: 'Yellow & Red Sweet Bell Peppers',
        description: 'Greenhouse-cultivated sweet bell peppers with thick crisp walls. Harvested fresh every morning in Naivasha.',
        category: 'Vegetables',
        priceKes: 220,
        quantityAvailable: 350,
        unit: 'kg',
        county: 'Nakuru',
        subCounty: 'Naivasha',
        farmerId: 'demo-farmer-4',
        farmerName: 'Sarah Achieng (Rift Agri-Tech)',
        farmerPhone: '+254 745 678 901',
        imageUrl: '/src/assets/images/farmer_portrait_kenya_1792156701502.jpg',
        harvestDate: '2026-10-16',
        isOrganic: true,
        minimumOrderQuantity: 5,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'sample-5',
        title: 'Sun-Dried Meru Yellow Passion Fruits',
        description: 'Intensely fragrant and sweet purple-yellow passion fruits. High juice yield, graded for restaurants and juice bars.',
        category: 'Fruits',
        priceKes: 190,
        quantityAvailable: 280,
        unit: 'kg',
        county: 'Meru',
        subCounty: 'Imenti South',
        farmerId: 'demo-farmer-5',
        farmerName: 'Silas Mutua (Mount Kenya Orchards)',
        farmerPhone: '+254 756 789 012',
        imageUrl: '/src/assets/images/produce_french_beans_1792156700988.jpg',
        harvestDate: '2026-10-13',
        isOrganic: true,
        minimumOrderQuantity: 10,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'sample-6',
        title: 'Cleaned Mwea Pishori Aromatic Rice',
        description: 'Authentic 100% pure Mwea Pishori aromatic white rice, milled and de-stoned, ready for commercial and home kitchens.',
        category: 'Grains & Cereals',
        priceKes: 185,
        quantityAvailable: 1500,
        unit: 'kg',
        county: 'Kirinyaga',
        subCounty: 'Mwea',
        farmerId: 'demo-farmer-6',
        farmerName: 'Joyce Njeri (Kirinyaga Rice Farmers)',
        farmerPhone: '+254 767 890 123',
        imageUrl: '/src/assets/images/produce_avocados_fresh_1792156700559.jpg',
        harvestDate: '2026-10-01',
        isOrganic: false,
        minimumOrderQuantity: 25,
        createdAt: new Date().toISOString(),
      },
    ];
  },
};
