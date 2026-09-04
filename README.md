# Hidden Urban

**Live:** [https://hiddenurban.com](https://hiddenurban.com)

A production men’s fashion ecommerce platform for Bangladesh: storefront shopping, cash-on-delivery checkout, courier fulfillment, and a role-based admin dashboard.

Hidden Urban is built as a full commerce system — catalog, cart, orders, shipping, marketing pixels, and operations — not a static shop template.

---

## Resume bullets (copy-ready)

- Designed and shipped a full-stack ecommerce store for Hidden Urban ([hiddenurban.com](https://hiddenurban.com)), covering catalog, COD checkout, order tracking, and an operations dashboard.
- Implemented a role-based admin (Super Admin, Shop Manager, Moderator) with JWT cookie sessions, route protection, and product/order CRUD.
- Integrated Steadfast courier (consignment create, status history, fraud check), ImageKit media uploads, and Meta / TikTok Pixel plus Conversions API.
- Built Bangladesh-specific checkout: BD phone validation, region/city selection, inside/outside Dhaka shipping, and free-delivery thresholds.

---

## Overview

Hidden Urban is a Next.js App Router store with MongoDB persistence. Shoppers browse products and collections, add items to cart, and place COD orders without creating an account. Staff manage catalog, customers, and fulfillment from `/dashboard/admin`.

| | |
| --- | --- |
| **Product** | Men’s fashion ecommerce |
| **Market** | Bangladesh (BDT, COD, local courier) |
| **Live site** | [hiddenurban.com](https://hiddenurban.com) |

---

## Storefront features

### Catalog and merchandising

- Home page with configurable hero slider and side banners (falls back to collection imagery)
- Top categories and curated collection sections
- Client reviews on the home page
- Full shop grid plus category routes (`/shop`, `/shop/[category]`)
- Collection listing and collection detail pages
- Product detail pages with:
  - Image gallery
  - Size and color selection
  - Quantity and stock awareness
  - Discount / compare-at pricing
  - Related products
  - WhatsApp inquiry (pre-filled product message)
  - Share product
  - Add to cart and buy-now
- Dynamic SEO metadata and Open Graph images on product pages
- About and contact pages (validated contact form, phone / email / hours from site settings)

### Cart, wishlist, and checkout

- Persistent cart (browser storage) with sidebar and dedicated cart page
- Quantity updates, line removal, subtotal and shipping preview
- Wishlist sidebar and wishlist page
- Guest checkout (no customer login required)
- Cash on delivery (COD)
- Bangladesh phone validation (`01XXXXXXXXX` / `+880`)
- Region and district selection
- Configurable shipping areas (inside / outside Dhaka) with class-based fees
- Optional free delivery above a minimum order value
- Delivery time estimates per area
- Order notes
- Checkout success page with order confirmation
- Conversion events: ViewContent, AddToCart, InitiateCheckout, Purchase

### Order tracking

- Public track-order page: lookup by order number and phone
- Visual status steps: New → Confirmed → Handed to courier → Out for delivery → Delivered
- Handles operational statuses (follow-up, cancelled, fraudulent) without a false “in transit” path

---

## Admin dashboard

Protected under `/dashboard/admin`. Unauthenticated users are redirected to login.

### Access control

| Role | Access |
| --- | --- |
| **Super Admin** | Full dashboard, including staff users |
| **Shop Manager** | Products, categories, collections, customers |
| **Moderator** | Orders and reports |

- Email/password login with bcrypt
- JWT session cookie (7-day TTL)
- Middleware enforces auth and role path prefixes

### Overview

- Greeting, date, and store KPIs from live orders and products
- Revenue chart
- Recent orders, recent activity, and quick actions

### Orders

- Paginated order list with search, status filters, and date ranges (today, 7d, 30d, month, lifetime)
- Status workflow tailored to COD operations (confirmed, no response, follow-up, Steadfast, out for delivery, delivered, cancelled, fraudulent)
- Order detail and edit (customer, items, discounts, shipping)
- WhatsApp and phone shortcuts for customer follow-up
- Print invoice and COD shipping sticker
- Send order to Steadfast; show consignment ID
- Courier history and customer fraud-check signals
- Copy, refresh, and delete flows

### Catalog

- Products: create, edit, list; SKU, stock, tags, material/fit/care attributes
- Multi-image upload via ImageKit
- Variable pricing by size/color variants
- Unique slug generation
- Product attributes library
- Categories with images
- Collections with product assignment and cover images

### Customers and reports

- Customer directory derived from orders (stats, search)
- All-customers report
- Repeat-customers report for retention / follow-up

### Staff

- Super Admin can create and manage dashboard users and roles

### Site settings

- **General:** shop name, tagline, brand colors, logo, favicon
- **Hero:** homepage slides and side banners
- **Pixel & CAPI:** Meta Pixel / CAPI and TikTok Pixel / Events API (optional test event codes)
- **Steadfast:** enable/disable, API credentials, connection test
- **Shipping:** areas, classes, fees, free-delivery rules, ETA copy
- **Contact:** phone, email, address, support hours, social links

---

## Integrations

| Service | Role |
| --- | --- |
| **MongoDB / Mongoose** | Products, orders, settings, admin users |
| **ImageKit** | Authenticated product, category, collection, and brand image uploads |
| **Steadfast (Packzy API)** | Consignment create, balance/credential check, tracking history, phone fraud check |
| **Meta Pixel + CAPI** | Browser pixel plus server-side conversion events |
| **TikTok Pixel + Events API** | Browser pixel plus hashed user matching on the server |
| **WhatsApp** | Product inquiries and order follow-up links |

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| UI | Tailwind CSS 4, MUI 9, Motion, Swiper |
| Data | TanStack Query, Axios, React Hook Form, Zod |
| Auth | jose (JWT), bcryptjs, Next.js middleware |
| Database | MongoDB, Mongoose (cached connection) |
| Charts | Recharts |
| Images | next/image + ImageKit |

Architecture notes:

- Route groups: `(storefront)`, `(auth)`, `dashboard/admin`
- REST handlers under `src/app/api` for store and admin
- Shared services, DB readers/mutations, and Zod schemas
- Server prefetch + Query hydration on the home page

---

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin UI: `/login` → `/dashboard/admin`.

Useful scripts:

```bash
npm run seed          # dummy catalog data
npm run seed:admin    # create an admin user
npm run build
npm run start
```

Configure environment variables for MongoDB, ImageKit, auth secret, and optional Steadfast / pixel keys before running against a real database.

---

## Project structure (high level)

```
src/app/(storefront)/     Public shop, cart, checkout, track order
src/app/dashboard/admin/  Operations dashboard
src/app/api/              Store, admin, auth, and pixel APIs
src/components/           Storefront, checkout, and admin UI
src/lib/                  Auth, shipping, Steadfast, pixels, DB
src/services/             Client/server data access
src/models/               Mongoose models
```
