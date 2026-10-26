import os
from PIL import Image, ImageEnhance
import numpy as np

print("Generating Ultra-HD 3D Hero Renders for DashboardSale...")

gen_dir = '/home/actualtam/.gemini/antigravity/brain/7b9b298e-2279-43e0-aa14-a827d83d923c'
out_dir = 'public/images/hero'
os.makedirs(out_dir, exist_ok=True)

# 1. POS Monoblok (1024x1024)
pos_src = os.path.join(gen_dir, 'pos_monoblok_3d_1792924574570.jpg')
pos_im = Image.open(pos_src).convert('RGB')
arr = np.array(pos_im)
# Solid warm beige
bg_pos = np.array([242, 233, 219], dtype=np.uint8)
for y in range(arr.shape[0]):
    for x in range(arr.shape[1]):
        inside = (145 <= x <= 905) and (45 <= y <= 855)
        if not inside:
            if (arr[y, x, 0] > 235 and arr[y, x, 1] > 230 and arr[y, x, 2] > 225) or (arr[y, x, 0] > 245):
                arr[y, x] = bg_pos

pos_clean = Image.fromarray(arr)
pos_clean = ImageEnhance.Sharpness(pos_clean).enhance(1.15)
pos_clean.save(f'{out_dir}/hero-pos-terminal@2x.png', quality=98)
pos_clean.resize((512, 512), Image.Resampling.LANCZOS).save(f'{out_dir}/hero-pos-terminal.png', quality=95)
print("Saved hero-pos-terminal@2x.png (1024x1024)")

# 2. Face ID Davomat Terminal (1024x1024)
face_src = os.path.join(gen_dir, 'face_terminal_3d_1792924596651.jpg')
face_im = Image.open(face_src).convert('RGB')
arr = np.array(face_im)
bg_face = np.array([223, 232, 251], dtype=np.uint8)
for y in range(arr.shape[0]):
    for x in range(arr.shape[1]):
        inside = (320 <= x <= 690) and (200 <= y <= 840)
        if not inside:
            if (arr[y, x, 0] > 235 and arr[y, x, 1] > 235 and arr[y, x, 2] > 240) or (arr[y, x, 0] > 248):
                arr[y, x] = bg_face

face_clean = Image.fromarray(arr)
face_clean = ImageEnhance.Sharpness(face_clean).enhance(1.15)
face_clean.save(f'{out_dir}/hero-face-attendance@2x.png', quality=98)
face_clean.resize((512, 512), Image.Resampling.LANCZOS).save(f'{out_dir}/hero-face-attendance.png', quality=95)
print("Saved hero-face-attendance@2x.png (1024x1024)")

# 3. Printer & Scanner (1024x1024)
prn_src = os.path.join(gen_dir, 'printer_scanner_3d_1792924614515.jpg')
prn_im = Image.open(prn_src).convert('RGB')
arr = np.array(prn_im)
bg_prn = np.array([251, 233, 222], dtype=np.uint8)
for y in range(arr.shape[0]):
    for x in range(arr.shape[1]):
        inside_objs = (160 <= x <= 880) and (380 <= y <= 900)
        inside_receipt = (260 <= x <= 480) and (160 <= y <= 550)
        if not (inside_objs or inside_receipt):
            if (arr[y, x, 0] > 242 and arr[y, x, 1] > 238 and arr[y, x, 2] > 232) or (arr[y, x, 0] > 248):
                arr[y, x] = bg_prn

prn_clean = Image.fromarray(arr)
prn_clean = ImageEnhance.Sharpness(prn_clean).enhance(1.15)
prn_clean.save(f'{out_dir}/hero-printer-scanner@2x.png', quality=98)
prn_clean.resize((512, 512), Image.Resampling.LANCZOS).save(f'{out_dir}/hero-printer-scanner.png', quality=95)
print("Saved hero-printer-scanner@2x.png (1024x1024)")

# 4. Analytics Dashboard (1024x1024)
dash_src = os.path.join(gen_dir, 'analytics_dashboard_3d_1792924635618.jpg')
dash_im = Image.open(dash_src).convert('RGB')
arr = np.array(dash_im)
bg_dash = np.array([227, 240, 251], dtype=np.uint8)
for y in range(arr.shape[0]):
    for x in range(arr.shape[1]):
        inside_tab = (265 <= x <= 765) and (335 <= y <= 735)
        inside_b1 = (595 <= x <= 855) and (285 <= y <= 395)
        inside_b2 = (135 <= x <= 325) and (640 <= y <= 745)
        if not (inside_tab or inside_b1 or inside_b2):
            if (arr[y, x, 0] > 238 and arr[y, x, 1] > 242 and arr[y, x, 2] > 248) or (arr[y, x, 0] > 248):
                arr[y, x] = bg_dash

dash_clean = Image.fromarray(arr)
dash_clean = ImageEnhance.Sharpness(dash_clean).enhance(1.15)
dash_clean.save(f'{out_dir}/hero-analytics-dashboard@2x.png', quality=98)
dash_clean.resize((512, 512), Image.Resampling.LANCZOS).save(f'{out_dir}/hero-analytics-dashboard.png', quality=95)
print("Saved hero-analytics-dashboard@2x.png (1024x1024)")

# 5. AI Supermarket Heatmap (1376x768)
ai_src = os.path.join(gen_dir, 'supermarket_heatmap_3d_1792924653331.jpg')
ai_im = Image.open(ai_src).convert('RGB')
arr = np.array(ai_im)
bg_ai = np.array([238, 242, 248], dtype=np.uint8)
for y in range(arr.shape[0]):
    for x in range(arr.shape[1]):
        inside_scene = (120 <= x <= 1256) and (70 <= y <= 710)
        if not inside_scene:
            if (arr[y, x, 0] > 235 and arr[y, x, 1] > 238 and arr[y, x, 2] > 242) or (arr[y, x, 0] > 248):
                arr[y, x] = bg_ai

ai_clean = Image.fromarray(arr)
ai_clean = ImageEnhance.Sharpness(ai_clean).enhance(1.15)
ai_clean.save(f'{out_dir}/hero-ai-camera-heatmap@2x.png', quality=98)
ai_clean.resize((688, 384), Image.Resampling.LANCZOS).save(f'{out_dir}/hero-ai-camera-heatmap.png', quality=95)
print("Saved hero-ai-camera-heatmap@2x.png (1376x768)")

print("All Ultra-HD 3D Hero Renders successfully generated!")
