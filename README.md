# Bable Minerals and Energy Pvt Ltd - B2B Commerce Platform

A modern, responsive, high-performance B2B industrial raw materials and energy commerce web platform built with React, Vite, Tailwind CSS, Framer Motion, and Lucide React.

---

## 🎨 Design System & Highlights
- **Palette**: Clean white canvas with corporate Teal (`#00C9B1`) to Blue (`#0B6FE8`) gradients, soft shadows, rounded-2xl cards, and hover lift effects.
- **Typography**: Inter & Plus Jakarta Sans with bold italic gradient headings.
- **Components**:
  1. **Sticky Gradient Navbar**: Logo, "Categories" & "About Us" dropdowns, Live Prices trigger, and a white pill "Login" button opening the authentication modal.
  2. **Live Prices Ticker**: Pulsing green dot + "LIVE PRICES", infinite marquee streaming commodity spot prices (TMT bars, Bitumen, Coal, Petcoke, Polymers, etc.) with day changes and an interactive City Selector on the right.
  3. **Industrial Warehouse Hero**: High-bay warehouse backdrop with clean white wash, "Powered by In-House Technology" badge, gradient H1, cycling search bar with trending chips, and 3 interactive action cards (Procurement, Smart Financing, Revenue Generation).
  4. **Categories We Serve**: 4 wide blocks (Metals, Chemicals, Energy & Minerals, Agri) with dark image cards, 6-tile product grids, light-blue supplier/brand counts strip, and "View Manufacturing Units →" modal trigger.
  5. **Stats & Why Choose Us**: Count-up animated counters and 4 core value proposition cards.
  6. **How It Works**: 4-step procurement workflow from spec selection to doorstep delivery.
  7. **Social Proof & CTA**: Partner logos (Tata, L&T, JSW, Adani, JSPL), client testimonials carousel, and high-impact custom RFQ banner.
  8. **Dark Navy Footer**: Full corporate entity disclosure, CIN, GSTIN, Gurugram & Mumbai office addresses, toll-free hotlines, and quick links.
  9. **Floating "Ask Bable AI"**: Bottom-right assistant with instant specification lookup, price queries, and financing guidance.
  10. **Get Quote Modal**: Interactive landed consignment price estimator with real-time freight simulation and reference ID generation.

---

## 📁 Data Configuration (All Content in JSON)
All copy, prices, categories, and company details are modularized for effortless editing:
- `src/data/livePrices.json`: Commodity spot prices, percentage changes, units, and delivery hub cities.
- `src/data/categories.json`: All 4 verticals (Metals, Chemicals, Energy & Minerals, Agri), 6 products each with specs, image URLs, and fallback styling.
- `src/data/companyData.json`: Corporate address, CIN, GSTIN, search placeholders, action cards, why choose us, how it works, and manufacturing units.
- `src/data/testimonials.json`: Enterprise client logos and buyer case studies.

---

## 🖼️ Where to Replace Logo & Images

1. **Brand Logo**:
   - Location: `/public/logo.png`
   - To replace: Drop your own transparent PNG/SVG logo into the `/public` directory named `logo.png`. The navbar, footer, and login modal automatically pick this up.

2. **Hero Warehouse Image**:
   - Location: `/src/assets/images/hero_industrial_warehouse_1793479824050.jpg`
   - Configured in: `src/components/Hero.tsx`

3. **Category Banner Images**:
   - Metals: `/src/assets/images/cat_metals_banner_1793479826533.jpg`
   - Chemicals: `/src/assets/images/cat_chemicals_banner_1793479826557.jpg`
   - Energy & Minerals: `/src/assets/images/cat_minerals_banner_1793479827611.jpg`
   - Configured in: `src/data/categories.json` (`bgImage` field)

4. **Category Sub-Item Grid Images**:
   - Configured in: `src/data/categories.json` under each item's `imageUrl` field. If any image is missing or unreachable, the system automatically displays a styled CSS gradient fallback with the item name.

---

## 🔐 Secure Admin Console
An enterprise-grade administration and fulfillment console is built into the platform:
- **Access Points**:
  - Click the **"Admin"** pill button in the top navbar (or in the mobile menu)
  - Or click **"Secure Admin Console"** in the footer
  - Or navigate to `#admin` in the URL
- **Security Features**:
  - Dual-Factor Authentication (Corporate Email & Master Password + 6-digit Hardware Security Token)
  - Brute-force lockout defense (Locks console for 60s after 5 consecutive failed attempts)
  - Encrypted session persistence with one-click instant lock/logout
  - Role-based permissions (Super Admin, Procurement Head, Risk & Credit Officer)
- **Evaluation Demo Credentials** (pre-filled on screen for ease of testing):
  - **Email**: `admin@bableminerals.com`
  - **Password**: `BableAdmin@2026`
  - **2FA Token**: `882200`
- **Console Modules**:
  1. **Executive Overview**: Total pipeline value, active RFQs, sanctioned trade credit, and real-time commodity watchlist.
  2. **RFQ & Orders Queue**: Filter by status (*Pending, Reviewing, Quoted, Approved, Dispatched*), search by buyer/material, inspect specifications, update status, and **Export to CSV**.
  3. **Live Price Controller**: Real-time editor for all spot commodity benchmark prices (TMT bars, Bitumen, Coal, Petcoke, Limestone, Methanol, etc.). Clicking **"Save & Broadcast"** immediately updates the public storefront marquee!
  4. **Smart Credit Desk**: Review underwriting applications, turnover, and CIBIL Commercial scores, and sanction or decline revolving credit lines.
  5. **Accredited Mill Directory**: Manage verified rolling mills, port terminals, and refineries with inspection ratings.
  6. **Security Audit Log**: Immutable chronological audit trail recording all admin actions, timestamps, and IP addresses.

---

## 🚀 Running the Project
```bash
# Install dependencies
npm install

# Start development server (Port 3000)
npm run dev

# Build for production
npm run build
```
