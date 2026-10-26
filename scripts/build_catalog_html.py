import json
import re

with open('all_scraped_products.json') as f:
    products = json.load(f)

# Priority mapping for screenshot products
SCREENSHOT_STATSIONAR = [
    {
        'key': 'superlead',
        'name': 'Superlead',
        'brand': 'SUPERLEAD',
        'brand_color': '#e53e3e',
        'price': 2000000,
        'old_price': 2000500,
        'discount': '-0%',
        'img': '/images/hardware/ae637a2f-1465-4c4c-ac01-14d57ffe44e1_0.webp',
        'remote_img': 'https://robosell.ams3.digitaloceanspaces.com/robosell/ae637a2f-1465-4c4c-ac01-14d57ffe44e1.webp',
        'spec1': '1D va 2D shtrix-kodlar',
        'spec2': 'USB orqali uzluksiz aloqa',
        'spec3': 'Surat asosida tez o‘qish'
    },
    {
        'key': 'dt-1500i',
        'name': 'DT-1500i',
        'brand': 'DATALOGIC',
        'brand_color': '#0284c7',
        'price': 1875000,
        'old_price': 2500000,
        'discount': '-25%',
        'img': '/images/hardware/64a63021-f4d9-4439-95af-b0fb3a73c02c_0.webp',
        'remote_img': 'https://robosell.ams3.digitaloceanspaces.com/robosell/64a63021-f4d9-4439-95af-b0fb3a73c02c.webp',
        'spec1': 'Keng format: 1D va 2D',
        'spec2': 'Sim orqali uzluksiz aloqa',
        'spec3': 'Tezlik: 2.5 m/s'
    },
    {
        'key': 'zebra-9308',
        'name': 'Zebra 9308',
        'brand': 'ZEBRA',
        'brand_color': '#111827',
        'price': 1625000,
        'old_price': 1800000,
        'discount': '-9.7%',
        'img': '/images/hardware/35939375-ba9f-4853-a5ab-523a5bba0585_0.webp',
        'remote_img': 'https://robosell.ams3.digitaloceanspaces.com/robosell/ac44670e-e122-4fba-9c14-fd251498944d.webp',
        'spec1': 'Tezligi: 3 sm/s gacha',
        'spec2': '2D barcha QR va kodlar',
        'spec3': 'Sim orqali uzluksiz aloqa'
    },
    {
        'key': 'b2d',
        'name': 'B2D',
        'brand': 'LARIBA GROUP',
        'brand_color': '#0f766e',
        'price': 1250000,
        'old_price': 12500000,
        'discount': '-90%',
        'img': '/images/hardware/7a99d61b-0fe2-416c-9d86-d57ef42c8a2d_0.webp',
        'remote_img': 'https://robosell.ams3.digitaloceanspaces.com/robosell/819d4546-3700-474d-93ec-499313ea3504.webp',
        'spec1': '1D va 2D kodlar',
        'spec2': '2D imager aniqlash',
        'spec3': 'Katta o‘qish maydoni'
    },
    {
        'key': '8800pro',
        'name': '8800PRO',
        'brand': 'LARIBA GROUP',
        'brand_color': '#0f766e',
        'price': 1000000,
        'old_price': 1200000,
        'discount': '-16.7%',
        'img': '/images/hardware/fdf0b206-6702-479d-9f6d-45322bb0eeb4_0.webp',
        'remote_img': 'https://robosell.ams3.digitaloceanspaces.com/robosell/54fe009a-bb6f-47a8-be80-738914ba068f.webp',
        'spec1': 'Surat shtrix-kodlar 1D, 2D',
        'spec2': 'Simli USB aloqa',
        'spec3': 'Tezlik: 2.7 m/s'
    },
    {
        'key': 'lps-8900pro-bt',
        'name': 'LPS-8900PRO BT',
        'brand': 'LARIBA GROUP',
        'brand_color': '#0f766e',
        'price': 750000,
        'old_price': 900000,
        'discount': '-16.7%',
        'img': '/images/hardware/5ac43565-851f-42c2-a17c-9a52333869d1_0.webp',
        'remote_img': 'https://robosell.ams3.digitaloceanspaces.com/robosell/5ac43565-851f-42c2-a17c-9a52333869d1.webp',
        'spec1': 'Skanerlash tezligi: 2.9 m/s',
        'spec2': 'Simsiz Bluetooth + Simli',
        'spec3': '1D va 2D kodlar'
    },
    {
        'key': 'lps-8900pro',
        'name': 'LPS-8900PRO',
        'brand': 'LARIBA GROUP',
        'brand_color': '#0f766e',
        'price': 496000,
        'old_price': 496500,
        'discount': '-0.1%',
        'img': '/images/hardware/244a9092-52ab-4314-a7f1-58611e36ce60_0.webp',
        'remote_img': 'https://robosell.ams3.digitaloceanspaces.com/robosell/244a9092-52ab-4314-a7f1-58611e36ce60.webp',
        'spec1': 'Skanerlash tezligi: 2.6 m/s',
        'spec2': 'Surat orqali aniqlash',
        'spec3': 'USB interfeysi'
    }
]

SCREENSHOT_QOL = [
    {
        'key': 'zebra-2208',
        'name': 'ZEBRA 2208',
        'brand': 'ZEBRA',
        'brand_color': '#111827',
        'price': 1700000,
        'old_price': 2000000,
        'discount': '-15%',
        'img': '/images/hardware/bc778973-1765-4e4c-8483-26316ce5b102_0.webp',
        'remote_img': 'https://robosell.ams3.digitaloceanspaces.com/robosell/bc778973-1765-4e4c-8483-26316ce5b102.webp',
        'spec1': 'USB, RS-232 interfeys',
        'spec2': '1D/2D barcodlarni o‘qish',
        'spec3': 'Stend bilan birga'
    },
    {
        'key': 'zebra-2278',
        'name': 'ZEBRA 2278',
        'brand': 'ZEBRA',
        'brand_color': '#111827',
        'price': 2875000,
        'old_price': 3000000,
        'discount': '-4.2%',
        'img': '/images/hardware/732123ae-6356-468c-8e80-022b7a655340_0.webp',
        'remote_img': 'https://robosell.ams3.digitaloceanspaces.com/robosell/732123ae-6356-468c-8e80-022b7a655340.webp',
        'spec1': 'Simsiz Bluetooth aloqa',
        'spec2': 'Batareya: 2400 mAh',
        'spec3': 'Zaryadlash stansiyasi'
    },
    {
        'key': 'datalogic',
        'name': 'DATALOGIC',
        'brand': 'DATALOGIC',
        'brand_color': '#0284c7',
        'price': 1250000,
        'old_price': 1400000,
        'discount': '-10.7%',
        'img': '/images/hardware/47d0954f-97a4-427f-a673-c3a51418ceb9_0.webp',
        'remote_img': 'https://robosell.ams3.digitaloceanspaces.com/robosell/47d0954f-97a4-427f-a673-c3a51418ceb9.webp',
        'spec1': '1D va 2D kodlar',
        'spec2': 'Batareya: 2400 mAh',
        'spec3': 'Tezlik: 2.0 m/s'
    },
    {
        'key': 'ct650wb',
        'name': 'CT650WB',
        'brand': 'LARIBA GROUP',
        'brand_color': '#0f766e',
        'price': 750000,
        'old_price': 800000,
        'discount': '-6.3%',
        'img': '/images/hardware/bf04ee7e-fcbd-4994-8d4a-71f10fb4d135_0.webp',
        'remote_img': 'https://robosell.ams3.digitaloceanspaces.com/robosell/bf04ee7e-fcbd-4994-8d4a-71f10fb4d135.webp',
        'spec1': 'Surat asosida aniqlash',
        'spec2': '1D, 2D (QR, DataMatrix)',
        'spec3': 'Simsiz 2.4G va Bluetooth'
    },
    {
        'key': 'lps-2200',
        'name': 'LPS-2200',
        'brand': 'LARIBA GROUP',
        'brand_color': '#0f766e',
        'price': 500000,
        'old_price': 500500,
        'discount': '-0.1%',
        'img': '/images/hardware/a4cc224b-3e0c-4ebf-8dfd-97ea3402b5a4_0.webp',
        'remote_img': 'https://robosell.ams3.digitaloceanspaces.com/robosell/a4cc224b-3e0c-4ebf-8dfd-97ea3402b5a4.webp',
        'spec1': '1D va 2D shtrix-kodlar',
        'spec2': 'Simli USB ulanish',
        'spec3': 'Kafolat: 1 yil'
    },
    {
        'key': 'lps-5500',
        'name': 'LPS-5500',
        'brand': 'LARIBA GROUP',
        'brand_color': '#0f766e',
        'price': 1000000,
        'old_price': 1200000,
        'discount': '-16.7%',
        'img': '/images/hardware/ff76438e-17e2-4b8d-92a7-5ecf22474449_0.webp',
        'remote_img': 'https://robosell.ams3.digitaloceanspaces.com/robosell/ff76438e-17e2-4b8d-92a7-5ecf22474449.webp',
        'spec1': 'Skanerlash tezligi: 1.2 m/s',
        'spec2': 'Batareya: NiMH 2300 mAh',
        'spec3': 'Simsiz qabul qiluvchi stansiya'
    },
    {
        'key': 'lps-4400pro',
        'name': 'LPS-4400PRO',
        'brand': 'LARIBA GROUP',
        'brand_color': '#0f766e',
        'price': 500000,
        'old_price': 500500,
        'discount': '-0.1%',
        'img': '/images/hardware/5e2ec048-7b58-4ede-a340-b7e0a298dfb8_0.webp',
        'remote_img': 'https://robosell.ams3.digitaloceanspaces.com/robosell/5e2ec048-7b58-4ede-a340-b7e0a298dfb8.webp',
        'spec1': 'Skanerlash tezligi: 2.0 m/s',
        'spec2': 'Surat asosida aniqlash',
        'spec3': 'Kassa tizimlari bilan to‘liq mos'
    }
]

print('Statsionar count:', len(SCREENSHOT_STATSIONAR))
print('Qo\'l count:', len(SCREENSHOT_QOL))
