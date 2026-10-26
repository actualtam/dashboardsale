# BILLZ-Inspired Retail Management SaaS (Uzbekistan)

A complete, production-grade retail management platform inspired by the workflows, information architecture, and UI polish of [BILLZ](https://billz.io). Built with Next.js 14, TypeScript, Tailwind CSS, Prisma ORM, and PostgreSQL 18.

---

## 🌟 Key Capabilities

### 1. High-Speed Point of Sale (POS)
- **Barcode & SKU Scanning:** Instant item lookup with hardware barcode scanner support and keyboard shortcuts (`F2` search, `F4` checkout, `F7` park cart, `Esc` cancel).
- **Variant Selection Matrix:** Seamless size and color matrix selection with real-time stock levels and price tiers.
- **Split Tender & Cash Calculation:** Supports Split payments, Cash (with denomination helpers and change due calculator), Bank cards (Uzcard / Humo), and digital payments (Payme, Click).
- **Thermal Receipt Generator:** 58mm & 80mm printable thermal receipt layout with fiscal QQS 12%, QR code, and business header/footer.
- **Cash Register Shifts:** Open shift with float, mid-shift cash drops/injections, and closing drawer reconciliation with discrepancy tracking.
- **Returns & Exchanges:** Full refund workflow with automatic warehouse inventory restocking.

### 2. Double-Entry Inventory Ledger & Warehouses
- **Multi-Warehouse & Multi-Branch:** Centralized inventory valuation across multiple stores and stockrooms.
- **Audit-Trail Movements:** Every stock change (SALE, RETURN, PURCHASE_RECEIPT, TRANSFER_DISPATCH, TRANSFER_RECEIVE, ADJUSTMENT, WRITE_OFF) is immutably logged with actor, timestamp, and reason.
- **Inter-Branch Stock Transfers:** Strict 3-stage lifecycle: `Draft` → `Dispatched` (decrements source stock) → `Received` (increments destination stock).
- **Stocktake & Variance Reconciliation:** Physical inventory counting and variance adjustment.
- **Anti-Oversell Protection:** Transactions prevent negative stock balances unless explicitly overridden.

### 3. Product Catalog & Variant Matrix
- Centralized product catalog supporting clothing, electronics, cosmetics, and groceries.
- Barcode generation & printable garment / shelf label preview.
- Category, brand, and supplier relationships.
- Bulk CSV import and export.

### 4. Executive Overview & Business Intelligence
- Real-time KPI metrics computed from live database records: Gross Sales, Net Sales, COGS, Gross Profit, Operating Expenses, Net Profit, Average Ticket, Units Sold, and Inventory Valuation.
- Interactive sales trend area charts, payment method distribution pie charts, and branch comparisons.
- Top best-selling products and low-stock warning lists.

### 5. Omnichannel E-Commerce Storefront
- Public customer-facing storefront at `/store`.
- Responsive product catalog, variant selector, and shopping cart.
- Checkout with Courier Delivery or Store Pickup.
- Admin fulfillment pipeline: `NEW` → `PROCESSING` → `READY_FOR_PICKUP` → `SHIPPED` → `DELIVERED`.

### 6. Operational Finance & CRM
- Expense management categorized by Rent, Utilities, Petty Cash, and Inventory Cost.
- Exact decimal-safe arithmetic for Uzbek Som (UZS).
- Customer CRM with purchase history, RFM segments (VIP, Regular, Inactive), and loyalty reward points.

### 7. Integrations (Uzbekistan)
- **Payme & Click:** Sandbox payment webhook simulation and merchant credential configurations.
- **Telegram Bot:** Real-time shift notifications, low stock alerts, and daily sales summaries.
- **1C:Enterprise:** Standard CommerceML 2.09 XML catalog and invoice export.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, Tailwind CSS, Lucide Icons, Recharts.
- **Backend:** Next.js Server Actions & Route Handlers, TypeScript.
- **Database:** PostgreSQL 18.4 with Prisma ORM.
- **Testing:** Vitest test suite.
- **Localization:** Uzbek Latin (`uz`), Russian (`ru`), English (`en`).

---

## 🚀 Getting Started

### Prerequisites
- Node.js v20+ and npm
- PostgreSQL 18 running locally or via connection string

### Environment Variables
Copy `.env.example` to `.env`:
```bash
DATABASE_URL="postgresql://postgres@127.0.0.1:5432/billz_retail"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### Setup & Database Migration
```bash
# Push schema to database
npm run db:push

# Seed realistic demonstration business
npm run db:seed
```

### Running the Application
```bash
# Development mode
npm run dev

# Production build and run
npm run build
npm start
```
The application will be accessible at:
- SaaS Admin: `http://localhost:3000`
- POS Terminal: `http://localhost:3000/pos`
- Online Storefront: `http://localhost:3000/store`

### Running Automated Tests
```bash
npm test
```

---

## 🔑 Demo Accounts & Credentials

| Role | Email | Password | Assigned Location |
| :--- | :--- | :--- | :--- |
| **Owner (Admin)** | `admin@billz-retail.uz` | `admin123` | All Locations |
| **Branch Manager** | `manager@billz-retail.uz` | `manager123` | Chilanzar Store |
| **Cashier (POS)** | `cashier@billz-retail.uz` | `cashier123` | Chilanzar Store (POS-01) |
| **Accountant** | `accountant@billz-retail.uz` | `accountant123` | All Locations |
