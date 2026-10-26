import re

with open('scripts/generate_standalone_service_pages.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Map image to each service
image_mappings = {
    "'slug': 'online-store',": "'slug': 'online-store',\n    'image': '/images/services/svc-online-store.png',",
    "'slug': 'accounting-bots',": "'slug': 'accounting-bots',\n    'image': '/images/services/svc-accounting-bots.png',",
    "'slug': 'attendance',": "'slug': 'attendance',\n    'image': '/images/services/svc-attendance.png',",
    "'slug': 'ai-cameras',": "'slug': 'ai-cameras',\n    'image': '/images/services/svc-ai-cameras.png',",
    "'slug': 'equipment-setup',": "'slug': 'equipment-setup',\n    'image': '/images/services/svc-equipment-setup.png',"
}

for k, v in image_mappings.items():
    text = text.replace(k, v)

# Update Hero in page_content
old_hero_pattern = re.compile(r'<!-- ==================== HERO ==================== -->.*?<!-- ==================== FEATURES ==================== -->', re.DOTALL)
new_hero = '''<!-- ==================== HERO ==================== -->
    <section class="sec svc-page-hero">
      <div class="wrap">
        <div class="svc-page-hero-grid">
          <div class="svc-page-hero-info">
            <span class="badge" style="margin-bottom:16px;">{s['badge']}</span>
            <h1 class="svc-page-hero-title">
              {s['headline']}
            </h1>
            <p class="svc-page-hero-sub">
              {s['subtitle']}
            </p>
            <div class="svc-page-hero-btns">
              <a class="btn btn-p btn-lg rip" href="https://t.me/dashboardsalevvbot" target="_blank" rel="noopener">
                <svg class="ico"><use href="#i-send"/></svg>
                <span>Bepul konsultatsiya olish</span>
              </a>
              <a class="btn btn-s btn-lg" href="#packages">
                <span>Tariflar va narxlar</span>
              </a>
            </div>
          </div>
          <div class="svc-page-hero-visual">
            <img src="{s['image']}" alt="{s['title']}" class="svc-page-hero-img" loading="eager"/>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== FEATURES ==================== -->'''

text = old_hero_pattern.sub(new_hero, text)

# Add CSS for .svc-page-hero-grid
css_addition = '''
    .svc-page-hero { padding-top: 48px; padding-bottom: 48px; background: var(--soft); }
    .svc-page-hero-grid { display: grid; grid-template-columns: 1.25fr 1fr; gap: 40px; align-items: center; }
    @media (max-width: 900px) {
      .svc-page-hero-grid { grid-template-columns: 1fr; text-align: center; }
      .svc-page-hero-btns { justify-content: center; }
    }
    .svc-page-hero-title { font-size: clamp(30px, 4vw, 42px); font-weight: 800; letter-spacing: -.025em; line-height: 1.2; margin-bottom: 18px; color: var(--ink); }
    .svc-page-hero-sub { font-size: 17px; color: var(--mute); line-height: 1.6; margin-bottom: 28px; }
    .svc-page-hero-btns { display: flex; gap: 12px; flex-wrap: wrap; }
    .svc-page-hero-visual {
      width: 100%;
      height: 320px;
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 20px 48px rgba(15, 19, 32, 0.1);
      background: var(--card-bg);
      border: 1px solid var(--card-border);
    }
    .svc-page-hero-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform .4s ease;
    }
    .svc-page-hero-visual:hover .svc-page-hero-img {
      transform: scale(1.05);
    }
    [data-theme="dark"] .svc-page-hero-visual {
      background: #141d33 !important;
      box-shadow: 0 20px 48px rgba(0, 0, 0, 0.4);
    }
'''
text = text.replace('.svc-capabilities-grid {', css_addition + '\n    .svc-capabilities-grid {')

with open('scripts/generate_standalone_service_pages.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated scripts/generate_standalone_service_pages.py with 3D hero visuals!")
