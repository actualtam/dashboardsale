import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '../src/lib/db';
import { POST as handleInquiryPost } from '../src/app/api/public/inquiries/route';
import { POST as handleOrderPost } from '../src/app/api/public/orders/route';
import { GET as handleCategoriesGet } from '../src/app/api/public/categories/route';
import { GET as handleProductsGet } from '../src/app/api/public/products/route';
import { POST as handleAdminProductPost } from '../src/app/api/admin/products/route';
import { NextRequest } from 'next/server';

describe('DashboardSale Public Website & Storefront API Tests', () => {
  beforeAll(async () => {
    // Ensure pos-terminals category exists for test
    await prisma.hardwareCategory.upsert({
      where: { slug: 'pos-terminals' },
      update: {},
      create: {
        slug: 'pos-terminals',
        nameUz: 'Monobloklar va POS terminallar',
        sortOrder: 1,
      },
    });
  });

  afterAll(async () => {
    // Clean up test items
    await prisma.hardwareProduct.deleteMany({
      where: { sku: 'TEST-SKU-999' },
    });
    await prisma.serviceInquiry.deleteMany({
      where: { customerName: 'Test Customer Vitest' },
    });
    await prisma.equipmentOrder.deleteMany({
      where: { customerName: 'Test Buyer Vitest' },
    });
    await prisma.$disconnect();
  });

  it('GET /api/public/categories returns seeded categories', async () => {
    const res = await handleCategoriesGet();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.data.length).toBeGreaterThanOrEqual(1);

    const posCat = data.data.find((c: any) => c.slug === 'pos-terminals');
    expect(posCat).toBeDefined();
    expect(posCat.nameUz).toBe('Monobloklar va POS terminallar');
  });

  it('POST /api/public/inquiries validates name and phone properly', async () => {
    // Test missing name
    const reqInvalid = new NextRequest('http://localhost:3000/api/public/inquiries', {
      method: 'POST',
      body: JSON.stringify({
        customerName: '',
        phone: '+998 90 123 45 67',
        serviceKey: 'attendance',
      }),
    });
    const resInvalid = await handleInquiryPost(reqInvalid);
    expect(resInvalid.status).toBe(400);

    // Test valid inquiry
    const reqValid = new NextRequest('http://localhost:3000/api/public/inquiries', {
      method: 'POST',
      body: JSON.stringify({
        customerName: 'Test Customer Vitest',
        phone: '+998 90 111 22 33',
        serviceKey: 'attendance',
        businessName: 'Vitest Retail Chain',
        message: 'Looking for 3 Face ID terminals',
        preferredContact: 'TELEGRAM',
      }),
    });
    const resValid = await handleInquiryPost(reqValid);
    const dataValid = await resValid.json();

    expect(resValid.status).toBe(200);
    expect(dataValid.success).toBe(true);
    expect(dataValid.inquiryNumber).toMatch(/^INQ-\d{8}-\d{4}$/);

    // Verify record in PostgreSQL
    const dbRecord = await prisma.serviceInquiry.findUnique({
      where: { inquiryNumber: dataValid.inquiryNumber },
    });
    expect(dbRecord).not.toBeNull();
    expect(dbRecord?.customerName).toBe('Test Customer Vitest');
    expect(dbRecord?.serviceKey).toBe('attendance');
  });

  it('POST /api/public/orders validates items and creates equipment order', async () => {
    // Missing items
    const reqNoItems = new NextRequest('http://localhost:3000/api/public/orders', {
      method: 'POST',
      body: JSON.stringify({
        customerName: 'Test Buyer Vitest',
        phone: '+998 90 999 88 77',
        items: [],
      }),
    });
    const resNoItems = await handleOrderPost(reqNoItems);
    expect(resNoItems.status).toBe(400);

    // Valid order
    const reqValid = new NextRequest('http://localhost:3000/api/public/orders', {
      method: 'POST',
      body: JSON.stringify({
        customerName: 'Test Buyer Vitest',
        phone: '+998 90 999 88 77',
        deliveryMethod: 'COURIER',
        address: 'Tashkent, Chilonzor 1-kvartal',
        items: [
          {
            name: 'Sunmi T2s Monoblock',
            sku: 'SUNMI-T2S',
            price: 4200000,
            quantity: 2,
          },
        ],
        totalAmount: 8400000,
      }),
    });
    const resValid = await handleOrderPost(reqValid);
    const dataValid = await resValid.json();

    expect(resValid.status).toBe(200);
    expect(dataValid.success).toBe(true);
    expect(dataValid.orderNumber).toMatch(/^EQ-\d{8}-\d{4}$/);

    const dbOrder = await prisma.equipmentOrder.findUnique({
      where: { orderNumber: dataValid.orderNumber },
    });
    expect(dbOrder).not.toBeNull();
    expect(Number(dbOrder?.totalAmount)).toBe(8400000);
    expect(dbOrder?.deliveryMethod).toBe('COURIER');
  });

  it('POST /api/admin/products upserts hardware product and GET /api/public/products returns it', async () => {
    const adminReq = new NextRequest('http://localhost:3000/api/admin/products', {
      method: 'POST',
      headers: {
        'x-admin-api-key': 'dashboardsale-admin-secret-2026',
      },
      body: JSON.stringify({
        slug: 'test-monoblock-t2s',
        sku: 'TEST-SKU-999',
        nameUz: 'Sunmi T2s Test Monoblock',
        categorySlug: 'pos-terminals',
        price: 4500000,
        currency: 'UZS',
        descriptionUz: 'Test description for POS terminal',
        images: ['https://images.unsplash.com/test.jpg'],
        specs: {
          CPU: 'Snapdragon Octa-Core',
          RAM: '4GB',
        },
        compatibility: ['BILLZ', '1C'],
        inStock: true,
        isPublished: true,
      }),
    });

    const adminRes = await handleAdminProductPost(adminReq);
    const adminData = await adminRes.json();
    expect(adminRes.status).toBe(200);
    expect(adminData.success).toBe(true);

    // Verify public API returns it
    const publicReq = new NextRequest('http://localhost:3000/api/public/products?search=TEST-SKU-999');
    const publicRes = await handleProductsGet(publicReq);
    const publicData = await publicRes.json();

    expect(publicRes.status).toBe(200);
    expect(publicData.success).toBe(true);
    expect(publicData.total).toBeGreaterThanOrEqual(1);

    const found = publicData.data.find((p: any) => p.sku === 'TEST-SKU-999');
    expect(found).toBeDefined();
    expect(found.nameUz).toBe('Sunmi T2s Test Monoblock');
    expect(found.specs.CPU).toBe('Snapdragon Octa-Core');
    expect(found.compatibility).toContain('BILLZ');
  });
});
