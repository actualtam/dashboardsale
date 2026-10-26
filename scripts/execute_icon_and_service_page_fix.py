import re
import os
import shutil

print("=== 1. Updating scripts/build_full_website.py ===")
with open('scripts/build_full_website.py', 'r', encoding='utf-8') as f:
    bfw = f.read()

# Replace duplicate CSS blocks
css_start = bfw.find("additional_css = '''") + len("additional_css = '''")
css_end = bfw.find("/* ==================== EXPANSIVE WIDE SCALE LAYOUT ==================== */")

clean_tile_css = '''
    /* ==================== 3D ICON TILES & PADDED VISUALS ==================== */
    .svc-icon-tile {
      width: 76px;
      height: 76px;
      border-radius: 20px;
      overflow: hidden;
      margin-bottom: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--soft);
      box-shadow: 0 8px 24px rgba(11, 92, 255, 0.08);
      border: 1px solid var(--line);
      padding: 8px;
      transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s ease;
    }
    .svc:hover .svc-icon-tile {
      transform: translateY(-4px) scale(1.06);
      box-shadow: 0 14px 32px rgba(11, 92, 255, 0.18);
    }
    .svc-icon-img {
      width: 100%;
      height: 100%;
      object-fit: contain !important;
      border-radius: 14px;
      display: block;
      transition: transform .35s ease;
    }
    .svc:hover .svc-icon-img {
      transform: scale(1.05);
    }

    /* Hero Service Split & Visual */
    .svc-hero-split {
      display: grid;
      grid-template-columns: 1.3fr 1fr;
      gap: 36px;
      align-items: center;
      margin-bottom: 28px;
    }
    @media (max-width: 860px) {
      .svc-hero-split { grid-template-columns: 1fr; }
    }
    .svc-hero-visual {
      width: 100%;
      height: 250px;
      border-radius: 24px;
      overflow: hidden;
      background: #eae0d2;
      box-shadow: 0 12px 32px rgba(15, 19, 32, 0.08);
      border: 1px solid var(--line);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .svc-visual-img {
      width: 100%;
      height: 100%;
      object-fit: contain !important;
      display: block;
      transition: transform .4s ease;
    }
    .svc:hover .svc-visual-img {
      transform: scale(1.04);
    }

    [data-theme="dark"] .svc-icon-tile {
      background: #141d33 !important;
      border-color: #23314d !important;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4) !important;
    }
    [data-theme="dark"] .svc-hero-visual {
      background: #141d33 !important;
      border-color: #23314d !important;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4) !important;
    }

    /* Fallback for .svc-card-visual if any exist */
    .svc-card-visual {
      width: 100%;
      height: 180px;
      border-radius: 20px;
      overflow: hidden;
      margin-bottom: 20px;
      background: var(--soft);
      box-shadow: 0 8px 24px rgba(15, 19, 32, 0.06);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .svc-card-visual img {
      width: 100%;
      height: 100%;
      object-fit: contain !important;
      display: block;
    }

    /* Padded Shot Images in Hero */
    .shot img.shot-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 10px;
      display: block;
      image-rendering: -webkit-optimize-contrast;
      transition: transform .45s cubic-bezier(.2,.8,.2,1);
    }
\n'''

if css_start != -1 and css_end != -1:
    bfw = bfw[:css_start] + clean_tile_css + bfw[css_end:]
    print("Cleaned additional_css in build_full_website.py")

# Ensure the replacement logic for Services section is present
rep_target = "# 5. Replace Equipment section"
svc_rep_code = '''# 4. Replace Services section with clean 3D icon tiles and non-clipped visuals
svc_start = output_html.find('<!-- ==================== SERVICES ==================== -->')
if svc_start == -1:
    svc_start = output_html.find('<section id="services"')
svc_end = output_html.find('<!-- ==================== PROCESS ==================== -->')
if svc_end == -1:
    svc_end = output_html.find('<section id="process"')
if svc_start != -1 and svc_end != -1:
    output_html = output_html[:svc_start] + new_services_html.strip() + '\\n\\n  ' + output_html[svc_end:]

'''

if "# 4. Replace Services section with clean 3D icon tiles" not in bfw:
    bfw = bfw.replace(rep_target, svc_rep_code + rep_target)
    print("Added Services section replacement step into output_html generation!")

with open('scripts/build_full_website.py', 'w', encoding='utf-8') as f:
    f.write(bfw)

print("Saved updated scripts/build_full_website.py")
