import urllib.request
import re
import json
import os
import concurrent.futures

os.makedirs('public/images/hardware', exist_ok=True)

# Fetch sitemap
req = urllib.request.Request('https://lariba.robosite.uz/sitemap.xml', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=10) as r:
    sitemap = r.read().decode('utf-8')

urls = list(set(re.findall(r'<loc>(https://lariba\.robosite\.uz/products/[^<]+)</loc>', sitemap)))
print(f'Fetching {len(urls)} products concurrently...')

products = []

def fetch_product(url):
    try:
        r = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(r, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            m = re.search(r'<script type="application/ld\+json">(.*?)</script>', html)
            if m:
                d = json.loads(m.group(1))
                d['source_url'] = url
                return d
    except Exception as e:
        pass
    return None

with concurrent.futures.ThreadPoolExecutor(max_workers=16) as executor:
    results = executor.map(fetch_product, urls)
    for res in results:
        if res:
            products.append(res)

print(f'Successfully fetched {len(products)} products!')

# Download images
def download_image(p):
    imgs = p.get('image', [])
    local_imgs = []
    for idx, img_url in enumerate(imgs):
        try:
            ext = os.path.splitext(img_url)[1] or '.webp'
            if '?' in ext:
                ext = ext.split('?')[0]
            sku = p.get('sku', 'prod').replace('/', '_')
            filename = f'{sku}_{idx}{ext}'
            filepath = os.path.join('public/images/hardware', filename)
            if not os.path.exists(filepath):
                req = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=10) as r:
                    with open(filepath, 'wb') as img_f:
                        img_f.write(r.read())
            local_imgs.append(f'/images/hardware/{filename}')
        except Exception as e:
            local_imgs.append(img_url)
    p['local_images'] = local_imgs
    return p

with concurrent.futures.ThreadPoolExecutor(max_workers=16) as executor:
    products = list(executor.map(download_image, products))

with open('all_scraped_products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print('Saved all_scraped_products.json with images downloaded!')
