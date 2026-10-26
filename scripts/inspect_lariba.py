import urllib.request, re, json

req = urllib.request.Request('https://lariba.robosite.uz', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=10) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

scripts = re.findall(r'src="(/_next/static/chunks/[^"]+)"', html)
print('Found chunks:', len(scripts))

for s in scripts:
    chunk_url = f'https://lariba.robosite.uz{s}'
    try:
        req_c = urllib.request.Request(chunk_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req_c, timeout=5) as c_resp:
            c_text = c_resp.read().decode('utf-8', errors='ignore')
            endpoints = re.findall(r'https?://[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/[^\s"'`]*api[^\s"'`]*', c_text)
            if endpoints:
                print('Endpoints in', s, set(endpoints))
            shop_refs = re.findall(r'shop_id=[a-zA-Z0-9-]+', c_text)
            if shop_refs:
                print('Shop refs in', s, set(shop_refs))
    except:
        pass
