import os
from PIL import Image
import numpy as np

gen_dir = '/home/actualtam/.gemini/antigravity/brain/7b9b298e-2279-43e0-aa14-a827d83d923c'

configs = [
    {
        'key': 'online-store',
        'src': 'pos_monoblok_3d_1792924574570.jpg',
        'dest': 'svc-online-store.png',
        'scale': 0.72,
        'offset_y': -8
    },
    {
        'key': 'accounting-bots',
        'src': 'analytics_dashboard_3d_1792924635618.jpg',
        'dest': 'svc-accounting-bots.png',
        'scale': 0.70,
        'offset_y': -5
    },
    {
        'key': 'attendance',
        'src': 'face_terminal_3d_1792924596651.jpg',
        'dest': 'svc-attendance.png',
        'scale': 0.72,
        'offset_y': 0
    },
    {
        'key': 'ai-cameras',
        'src': 'supermarket_heatmap_3d_1792924653331.jpg',
        'dest': 'svc-ai-cameras.png',
        'scale': 0.74,
        'offset_y': 0
    },
    {
        'key': 'equipment-setup',
        'src': 'printer_scanner_3d_1792924614515.jpg',
        'dest': 'svc-equipment-setup.png',
        'scale': 0.70,
        'offset_y': 0
    }
]

target_dir = 'public/images/services'
os.makedirs(target_dir, exist_ok=True)

for c in configs:
    src_path = os.path.join(gen_dir, c['src'])
    im = Image.open(src_path).convert('RGBA')
    w, h = im.size
    
    # Target canvas size: 1000 x 680
    canvas_w = 1000
    canvas_h = 680
    
    scale = c['scale']
    scaled_w = int(canvas_w * scale)
    scaled_h = int(canvas_h * scale)
    
    orig_ratio = w / h
    if orig_ratio >= 1.0:
        new_w = scaled_w
        new_h = int(new_w / orig_ratio)
        if new_h > int(canvas_h * 0.86):
            new_h = int(canvas_h * 0.86)
            new_w = int(new_h * orig_ratio)
    else:
        new_h = scaled_h
        new_w = int(new_h * orig_ratio)
    
    resized_im = im.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Create smooth feathered alpha mask for seamless edges
    mask = Image.new('L', (new_w, new_h), 255)
    feather_px = 64
    for x in range(new_w):
        for y in range(new_h):
            dist_x = min(x, new_w - 1 - x)
            dist_y = min(y, new_h - 1 - y)
            min_dist = min(dist_x, dist_y)
            if min_dist < feather_px:
                # Cosine smooth curve for ultra gentle falloff
                factor = 0.5 * (1 - np.cos(np.pi * (min_dist / feather_px)))
                alpha = int(255 * factor)
                mask.putpixel((x, y), alpha)
    
    resized_im.putalpha(mask)
    
    # Transparent RGBA canvas
    canvas = Image.new('RGBA', (canvas_w, canvas_h), (0, 0, 0, 0))
    paste_x = (canvas_w - new_w) // 2
    paste_y = (canvas_h - new_h) // 2 + c.get('offset_y', 0)
    canvas.paste(resized_im, (paste_x, paste_y), resized_im)
    
    dest_path = os.path.join(target_dir, c['dest'])
    canvas.save(dest_path, 'PNG')
    print(f"Generated transparent feathered visual: {dest_path} (canvas: {canvas.size}, object: {new_w}x{new_h})")

print("All 5 service visuals regenerated with transparent feathered edges!")
