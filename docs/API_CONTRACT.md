# DashboardSale Hardware Store & Inquiries — API Contract

Version: `1.0.0`  
Base URL: `/api`  
Primary Language: Uzbek Latin (`uz`) with optional Russian (`ru`)  
Currency: `UZS` (Uzbekistan Som)

This document specifies the REST API contract for **DashboardSale**, defining endpoints for the public storefront, customer consultation/order inquiries, and the dedicated external AI Agent / Admin Dashboard that manages hardware catalog data.

---

## 1. Authentication & Security

| Target Audience | Header | Description |
| :--- | :--- | :--- |
| **Public Storefront** | None required | Read-only catalog endpoints and public lead submission. |
| **Admin & AI Agent** | `x-admin-api-key: <ADMIN_API_KEY>` or `Authorization: Bearer <TOKEN>` | Full catalog write/update/delete operations and lead inspection. |

Default environment key: `ADMIN_API_KEY` (configured in `.env`).

---

## 2. Public Storefront Endpoints

### 2.1. List Hardware Categories
- **Method:** `GET`
- **Route:** `/api/public/categories`
- **Description:** Returns all active hardware categories with real published product counts.

#### Response Example (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "19b4b0e3-...",
      "slug": "pos-terminals",
      "nameUz": "Monobloklar va POS terminallar",
      "nameRu": "Моноблоки и POS терминалы",
      "description": "Sensorli ekranli tezkor monobloklar va kassa kompyuterlari",
      "icon": "Monitor",
      "sortOrder": 1,
      "productCount": 0
    },
    {
      "id": "27c1a89d-...",
      "slug": "receipt-printers",
      "nameUz": "Chek printerlar",
      "nameRu": "Чековые принтеры",
      "description": "58mm va 80mm termal tezkor chek va kvitansiya printerlari",
      "icon": "Printer",
      "sortOrder": 2,
      "productCount": 0
    }
  ]
}
```

---

### 2.2. List Hardware Products
- **Method:** `GET`
- **Route:** `/api/public/products`
- **Query Parameters:**
  - `category` (optional, string): Filter by category slug (e.g. `pos-terminals`)
  - `search` (optional, string): Search query matching product name, SKU, or description
  - `inStock` (optional, boolean): Filter only in-stock items (`true`/`false`)
  - `limit` (optional, integer): Max items per page (default: 50)
  - `page` (optional, integer): Page number (default: 1)

#### Response Example (`200 OK`):
```json
{
  "success": true,
  "total": 1,
  "page": 1,
  "limit": 50,
  "data": [
    {
      "id": "7f098dca-...",
      "slug": "sunmi-t2s-pos-monoblock",
      "sku": "DS-POS-T2S",
      "nameUz": "Sunmi T2s 15.6\" Smart POS Monoblok",
      "nameRu": "Sunmi T2s 15.6\" Смарт POS Моноблок",
      "categorySlug": "pos-terminals",
      "categoryName": "Monobloklar va POS terminallar",
      "price": 4200000,
      "currency": "UZS",
      "priceOnRequest": false,
      "descriptionUz": "Yuqori tezlikdagi sensorli ekran, o‘rnatilgan Seiko termal printer va kuchli Qualcomm sakkiz yadroli protsessor.",
      "images": [
        "https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80"
      ],
      "specs": {
        "Protsessor": "Qualcomm Snapdragon Octa-core",
        "Operativ xotira": "4 GB RAM",
        "Doimiy xotira": "64 GB ROM",
        "Ekran": "15.6\" FHD 1920x1080 IPS sensorli",
        "O‘rnatilgan printer": "80mm Seiko termal (250mm/s)",
        "Interfeyslar": "Wi-Fi, Bluetooth 5.0, 5x USB, LAN RJ45, RJ12 kassa qutisi"
      },
      "compatibility": ["BILLZ", "1C:Predpriyatie", "Jowi", "R-Keeper", "iiko"],
      "inStock": true,
      "isPublished": true
    }
  ]
}
```

*Note: If `total === 0`, the storefront displays an intentional empty state in Uzbek Latin with an active Telegram CTA.*

---

### 2.3. Get Product Details by Slug
- **Method:** `GET`
- **Route:** `/api/public/products/:slug`

#### Response Example (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": "7f098dca-...",
    "slug": "sunmi-t2s-pos-monoblock",
    "sku": "DS-POS-T2S",
    "nameUz": "Sunmi T2s 15.6\" Smart POS Monoblok",
    "price": 4200000,
    "currency": "UZS",
    "priceOnRequest": false,
    "specs": { ... },
    "images": [ ... ],
    "compatibility": [ ... ],
    "category": {
      "slug": "pos-terminals",
      "nameUz": "Monobloklar va POS terminallar"
    }
  }
}
```

---

### 2.4. Submit Service Consultation Inquiry
- **Method:** `POST`
- **Route:** `/api/public/inquiries`
- **Description:** Captures B2B service consultation inquiries and dispatches an instant Telegram notification to `@DashboardSale777bot`.

#### Request Body (`application/json`):
```json
{
  "customerName": "Alisher Qodirov",
  "phone": "+998 90 123 45 67",
  "serviceKey": "attendance",
  "businessName": "Express Supermarket",
  "message": "3 ta filialimiz uchun Face ID davomat tizimi va turniket o‘rnatmoqchimiz.",
  "preferredContact": "TELEGRAM"
}
```

#### Validation Rules:
- `customerName`: required, min 2 chars.
- `phone`: required, valid Uzbekistan mobile phone format (`+998 XX XXX XX XX`).
- `serviceKey`: required, one of:
  - `online_store`
  - `accounting_bots`
  - `attendance`
  - `ai_cameras`
  - `equipment_setup`
  - `general`
- `preferredContact`: `TELEGRAM` | `PHONE`

#### Response Example (`201 Created`):
```json
{
  "success": true,
  "inquiryNumber": "INQ-20261025-001",
  "message": "So‘rovingiz qabul qilindi. Tez orada mutaxassisimiz siz bilan bog‘lanadi."
}
```

---

### 2.5. Submit Equipment Order Request
- **Method:** `POST`
- **Route:** `/api/public/orders`
- **Description:** Captures hardware purchases, logs in PostgreSQL, and dispatches a Telegram notification.

#### Request Body:
```json
{
  "customerName": "Sherzod Aliyev",
  "phone": "+998 99 876 54 32",
  "deliveryMethod": "COURIER",
  "address": "Toshkent shahri, Chilonzor tumani, 9-mavze, 14-uy",
  "notes": "Ertaga soat 14:00 gacha yetkazib berish iltimos.",
  "items": [
    {
      "productId": "7f098dca-...",
      "sku": "DS-POS-T2S",
      "name": "Sunmi T2s 15.6\" Smart POS Monoblok",
      "price": 4200000,
      "quantity": 2
    }
  ],
  "totalAmount": 8400000
}
```

#### Response Example (`201 Created`):
```json
{
  "success": true,
  "orderNumber": "EQ-20261025-001",
  "message": "Buyurtmangiz muvaffaqiyatli qabul qilindi. Operatorimiz tez orada tasdiqlash uchun qo‘ng‘iroq qiladi."
}
```

---

## 3. Dedicated Admin & AI Agent Endpoints

These endpoints allow the external AI Agent or dedicated Product Management Dashboard to add and update catalog data automatically.

### 3.1. Create or Upsert Product
- **Method:** `POST`
- **Route:** `/api/admin/products`
- **Headers:** `x-admin-api-key: <ADMIN_API_KEY>`

#### Request Body:
```json
{
  "slug": "xprinter-xp-n160ii",
  "sku": "DS-PRN-N160",
  "nameUz": "Xprinter XP-N160II Termal Chek Printeri (80mm)",
  "nameRu": "Термопринтер чеков Xprinter XP-N160II (80мм)",
  "categorySlug": "receipt-printers",
  "price": 650000,
  "currency": "UZS",
  "priceOnRequest": false,
  "descriptionUz": "Tezkor 160 mm/s avtomatik pichoqli termal chek printeri. USB va LAN interfeysi orqali har qanday kassa dasturlariga oson ulanadi.",
  "images": [
    "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80"
  ],
  "specs": {
    "Bosish tezligi": "160 mm/sekund",
    "Qog‘oz kengligi": "80 mm",
    "Avtomatik qirqish": "Mavjud (Avtorez 1.5 mln kesish)",
    "Interfeys": "USB + LAN (Ethernet)",
    "Moslik": "Windows, Linux, Android, iOS"
  },
  "compatibility": ["BILLZ", "1C", "Jowi", "R-Keeper", "iiko"],
  "inStock": true,
  "isPublished": true,
  "sortOrder": 1
}
```

#### Response (`200 OK` / `201 Created`):
```json
{
  "success": true,
  "product": {
    "id": "31b0de12-...",
    "slug": "xprinter-xp-n160ii",
    "sku": "DS-PRN-N160",
    "nameUz": "Xprinter XP-N160II Termal Chek Printeri (80mm)",
    "price": 650000,
    "isPublished": true
  }
}
```

---

### 3.2. Update Product Price or Stock
- **Method:** `PATCH`
- **Route:** `/api/admin/products/:id`
- **Headers:** `x-admin-api-key: <ADMIN_API_KEY>`

#### Request Body:
```json
{
  "price": 680000,
  "inStock": true,
  "isPublished": true
}
```

---

### 3.3. Batch Sync Catalog (AI Agent Catalog Sync)
- **Method:** `POST`
- **Route:** `/api/admin/products/batch`
- **Description:** Allows AI agent to upload or synchronize multiple products in a single transaction.

---

## 4. Telegram Notification Templates

Whenever an inquiry or order is posted, the backend formats and sends an alert to bot `@DashboardSale777bot`:

### Service Inquiry Telegram Alert:
```
📋 Yangi xizmat so‘rovi: #INQ-20261025-001
🏷️ Xizmat: Xodimlar davomati va nazorat tizimlari
👤 Mijoz: Alisher Qodirov
📞 Telefon: +998 90 123 45 67
🏢 Korxona: Express Supermarket
💬 Izoh: 3 ta filialimiz uchun Face ID davomat tizimi va turniket o‘rnatmoqchimiz.
📲 Aloqa turi: TELEGRAM
```

### Equipment Order Telegram Alert:
```
🛒 Yangi uskuna buyurtmasi: #EQ-20261025-001
👤 Xaridor: Sherzod Aliyev
📞 Telefon: +998 99 876 54 32
🚚 Yetkazib berish: COURIER (Toshkent shahri, Chilonzor tumani, 9-mavze, 14-uy)
📦 Mahsulotlar:
  • Sunmi T2s 15.6" Smart POS Monoblok (2 dona) — 8,400,000 UZS
💰 Jami summa: 8,400,000 UZS
```
