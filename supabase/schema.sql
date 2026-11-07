-- ==============================================================================
-- SHAMBA LINK POSTGRESQL SCHEMA FOR SUPABASE
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('farmer', 'buyer')),
  phone TEXT,
  county TEXT,
  sub_county TEXT,
  farm_name TEXT,
  organization_name TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  farmer_name TEXT NOT NULL,
  farmer_phone TEXT,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN (
    'Vegetables',
    'Fruits',
    'Grains & Cereals',
    'Tubers & Roots',
    'Legumes & Pulses',
    'Herbs & Spices',
    'Dairy & Farm Fresh'
  )),
  price_kes NUMERIC NOT NULL CHECK (price_kes >= 0),
  quantity_available NUMERIC NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'kg',
  county TEXT NOT NULL,
  sub_county TEXT,
  image_url TEXT,
  harvest_date DATE,
  is_organic BOOLEAN DEFAULT FALSE,
  minimum_order_quantity NUMERIC DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Order Inquiries Table
CREATE TABLE IF NOT EXISTS public.order_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  buyer_name TEXT NOT NULL,
  buyer_phone TEXT NOT NULL,
  delivery_county TEXT NOT NULL,
  notes TEXT,
  total_kes NUMERIC NOT NULL CHECK (total_kes >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'fulfilled', 'cancelled')),
  items JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_inquiries ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies: Profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 7. RLS Policies: Products
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
CREATE POLICY "Products are viewable by everyone"
  ON public.products FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Farmers can insert products" ON public.products;
CREATE POLICY "Farmers can insert products"
  ON public.products FOR INSERT
  WITH CHECK (auth.uid() = farmer_id);

DROP POLICY IF EXISTS "Farmers can update their own products" ON public.products;
CREATE POLICY "Farmers can update their own products"
  ON public.products FOR UPDATE
  USING (auth.uid() = farmer_id);

DROP POLICY IF EXISTS "Farmers can delete their own products" ON public.products;
CREATE POLICY "Farmers can delete their own products"
  ON public.products FOR DELETE
  USING (auth.uid() = farmer_id);

-- 8. RLS Policies: Order Inquiries
DROP POLICY IF EXISTS "Anyone can create order inquiries" ON public.order_inquiries;
CREATE POLICY "Anyone can create order inquiries"
  ON public.order_inquiries FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Buyers can view their own inquiries" ON public.order_inquiries;
CREATE POLICY "Buyers can view their own inquiries"
  ON public.order_inquiries FOR SELECT
  USING (auth.uid() = buyer_id);

-- 9. Trigger to create profile automatically on auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, phone, county, organization_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Member'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'buyer'),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'county',
    NEW.raw_user_meta_data->>'organization_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- SAMPLE SEED DATA (OPTIONAL: Run this to populate your Supabase DB with initial Kenyan produce)
-- ==============================================================================
INSERT INTO public.products (title, description, category, price_kes, quantity_available, unit, county, sub_county, farmer_name, farmer_phone, image_url, harvest_date, is_organic, minimum_order_quantity)
VALUES
  ('Export-Grade Hass Avocados', 'Naturally ripened Hass avocados harvested from volcanic soils of Murang''a. High oil content, dark pebbled skin.', 'Fruits', 180, 450, 'kg', 'Murang''a', 'Kandara', 'Wanjiku Kamau', '+254 712 345 678', 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80', CURRENT_DATE - INTERVAL '1 day', true, 10),
  ('Crisp Extra-Fine French Beans', 'Tender hand-picked green beans, uniform length, zero stringiness. Ideal for commercial kitchens, supermarkets, and hospitality.', 'Vegetables', 140, 800, 'kg', 'Nyandarua', 'Ol Kalou', 'Kiprono Cheruiyot', '+254 723 456 789', 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=80', CURRENT_DATE, true, 15),
  ('Fresh Dutch Rikea Potatoes', 'High-density starchy yellow-flesh potatoes washed and sorted in standard 50kg bags. Perfect for chips and boiling.', 'Tubers & Roots', 3200, 120, 'bag (90kg)', 'Nakuru', 'Molo', 'David Mwangi', '+254 734 567 890', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80', CURRENT_DATE - INTERVAL '3 days', false, 2),
  ('Yellow & Red Sweet Bell Peppers', 'Greenhouse-cultivated sweet bell peppers with thick crisp walls. Harvested fresh every morning in Naivasha.', 'Vegetables', 220, 350, 'kg', 'Nakuru', 'Naivasha', 'Sarah Achieng', '+254 745 678 901', 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80', CURRENT_DATE, true, 5),
  ('Sun-Dried Meru Yellow Passion Fruits', 'Intensely fragrant and sweet purple-yellow passion fruits. High juice yield, graded for restaurants and juice bars.', 'Fruits', 190, 280, 'kg', 'Meru', 'Imenti South', 'Silas Mutua', '+254 756 789 012', 'https://images.unsplash.com/photo-1589533610925-1cffc309ebaa?auto=format&fit=crop&w=800&q=80', CURRENT_DATE - INTERVAL '2 days', true, 10),
  ('Cleaned Mwea Pishori Aromatic Rice', 'Authentic 100% pure Mwea Pishori aromatic white rice, milled and de-stoned, ready for commercial and home kitchens.', 'Grains & Cereals', 185, 1500, 'kg', 'Kirinyaga', 'Mwea', 'Joyce Njeri', '+254 767 890 123', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80', CURRENT_DATE - INTERVAL '10 days', false, 25);
