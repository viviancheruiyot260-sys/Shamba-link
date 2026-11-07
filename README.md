# Shamba Link 🌾🇰🇪

> **Direct Farm-to-Market Agricultural Marketplace for Kenya**  
> Connecting smallholder farmers and agricultural cooperatives directly with consumers, restaurants, supermarkets, and bulk buyers with transparent farm-gate pricing, verified county origins, and zero middleman exploitation.

---

## 1. Project Overview

In Kenya, agricultural produce often passes through up to four layers of informal brokers ("cartels") between the farm gate in Nyandarua, Nakuru, or Meru and the retail stalls in Nairobi or Mombasa. Farmers are frequently underpaid, while buyers face inflated prices and degraded shelf life.

**Shamba Link** bridges this gap with:
- **Direct Marketplace Discovery**: Filter produce by Kenyan county, crop category, organic certification, and price in Kenyan Shillings (KES).
- **Transparent Farm Gate Pricing**: Every listing highlights the unit rate (KES per kg, 50kg crate, 90kg bag, or bunch) and the cultivating farmer.
- **Role-Aware Dashboards**: Dedicated experiences for **Farmers** (list crop harvest, set price, monitor buyer demand) and **Commercial Buyers** (bulk produce inquiries, restaurants, retail orders).
- **Direct Order Inquiries**: Buyers calculate batch order quantities, specify delivery destination counties, and submit direct dispatch requests.
- **Supabase Integration Ready**: Engineered for PostgreSQL storage, Supabase Auth, and Storage buckets with full Row Level Security (RLS).

---

## 2. Technology Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS v4, Plus Jakarta Sans typography
- **Navigation**: React Router v7
- **Database & Auth**: Supabase (PostgreSQL, Row-Level Security, Auth)
- **Icons**: Lucide React
- **Testing**: Vitest, React Testing Library, JSDOM
- **Build System**: Vite 8

---

## 3. Directory Structure

```text
├── index.html                   # HTML entry point with Plus Jakarta Sans & SEO meta
├── supabase/
│   └── schema.sql               # Complete PostgreSQL tables, RLS policies & triggers
├── src/
│   ├── assets/images/           # High-resolution authentic Kenyan agricultural imagery
│   ├── components/
│   │   ├── cart/                # Order inquiry drawer & quantity recalculation
│   │   ├── common/              # Supabase config helper & alerts
│   │   ├── layout/              # Top Bar Contract Navbar, Kenyan Agricultural Footer, Layout
│   │   └── marketplace/         # Product cards (zero-pill discipline) & filter sidebars
│   ├── config/                  # Supabase environment validator
│   ├── context/                 # AuthContext & CartContext
│   ├── lib/                     # Initialized Supabase client with safe fallback
│   ├── pages/                   # Home, Marketplace, Login, Register, ForgotPassword, Dashboard, 404
│   ├── services/                # ProductService (Kenyan counties/categories) & AuthService
│   ├── test/                    # Unit & integration tests for components and routing
│   └── types/                   # Domain TypeScript models
├── vitest.config.ts             # Vitest test runner configuration
└── package.json
```

---

## 4. Getting Started & Local Development

### Prerequisites
- Node.js 18+ and npm

### Installation
```bash
npm install
```

### Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Set your Supabase credentials:
```env
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

*(Note: If Supabase credentials are not provided initially, Shamba Link will automatically run in demonstration mode with sample produce so you can immediately explore the UI without runtime crashes).*

### Supabase Database Setup
1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste and run the contents of `supabase/schema.sql`.
4. Copy your **Project URL** and **anon public key** from **Project Settings → API** into your `.env`.

### Running Tests
```bash
npm run test
```

### Type Checking & Linting
```bash
npm run lint
```

### Production Build
```bash
npm run build
```

---

## 5. Next Roadmap Milestones (Phase 2 & 3)

1. **Safaricom M-Pesa Daraja API Integration**: Direct STK Push payment authorization for instant farmer escrow and payout.
2. **Cooperative Bulk Logistics Pooling**: County-level aggregation center routing (e.g. Molo, Naivasha, Kangema depots).
3. **SMS & USSD Gateway**: Enabling rural smallholders without smartphones to post available harvest quantities via standard USSD codes (*384#).
