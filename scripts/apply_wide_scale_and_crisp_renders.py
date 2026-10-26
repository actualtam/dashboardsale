import re

print("Applying wide scale layout, 4K crisp 3D assets, and unified desktop/mini app design...")

with open('scripts/build_full_website.py', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update wrap to 1320px in additional_css and add expansive layout rules
wide_scale_css = '''
    /* ==================== EXPANSIVE WIDE SCALE LAYOUT ==================== */
    :root {
      --wrap: 1320px !important;
    }
    .wrap {
      max-width: 1320px !important;
      width: 100% !important;
    }

    /* Expansive Wide Hero Section */
    .hero {
      position: relative;
      overflow: hidden;
      text-align: center;
      padding: 56px 0 40px;
      min-height: 960px;
    }
    .hero-copy {
      position: relative;
      z-index: 5;
      width: min(100%, 720px);
      max-width: 760px;
      margin: 0 auto;
      padding: 20px 20px 0;
    }
    .hero h1 {
      font-weight: 800;
      font-size: clamp(38px, 4.6vw, 76px);
      line-height: 1.08;
      letter-spacing: -.035em;
      text-wrap: balance;
      margin-bottom: 20px;
    }
    .hero h1 em {
      font-style: normal;
      color: var(--blue);
    }
    .hero-lead {
      margin: 0 auto 32px;
      max-width: 640px;
      font-size: clamp(17px, 1.4vw, 21px);
      line-height: 1.55;
      font-weight: 600;
      color: var(--mute);
      text-wrap: balance;
    }
    .hero-actions {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin-top: 32px;
      flex-wrap: wrap;
    }

    /* Desktop Viewport (Wide Screen Framed Layout) */
    @media (min-width: 1101px) {
      .hero-stage {
        position: absolute;
        inset: 0;
        pointer-events: none;
        max-width: 1540px;
        margin: 0 auto;
      }
      .shot {
        position: absolute;
        overflow: hidden;
        pointer-events: auto;
        cursor: pointer;
        box-shadow: 0 24px 60px rgba(15, 19, 32, 0.1);
        transition: transform .4s cubic-bezier(.2,.8,.2,1), box-shadow .4s ease;
      }
      .s1 {
        left: 0;
        top: 80px;
        width: min(22vw, 380px);
        height: 380px;
        border-radius: 0 64px 64px 0;
        background: linear-gradient(160deg, #f2e9dc, #dccdb8);
      }
      .s2 {
        left: 0;
        top: 500px;
        width: min(22vw, 390px);
        height: 400px;
        border-radius: 0 64px 64px 0;
        background: linear-gradient(160deg, #dfe8fb, #b9cdf3);
      }
      .s3 {
        right: 0;
        top: 80px;
        width: min(22vw, 380px);
        height: 380px;
        border-radius: 64px 0 0 64px;
        background: linear-gradient(160deg, #fbe9de, #f2cdb4);
      }
      .s4 {
        right: 0;
        top: 500px;
        width: min(22vw, 390px);
        height: 400px;
        border-radius: 64px 0 0 64px;
        background: linear-gradient(160deg, #e3f0fb, #bcd9f2);
      }
      .s5 {
        left: 50%;
        top: 560px;
        width: min(54vw, 840px);
        height: 400px;
        transform: translateX(-50%);
        border-radius: 120px 120px 0 0;
        background: linear-gradient(180deg, #eef2f8, #dfe6f1);
      }
    }

    /* Telegram Mini App & Mobile (Harmonized Identical Design) */
    @media (max-width: 1100px) {
      .hero {
        min-height: auto;
        padding: 40px 0 32px;
      }
      .hero-copy {
        width: 100%;
        max-width: 680px;
        padding: 0 16px;
      }
      .hero h1 {
        font-size: clamp(32px, 6vw, 50px);
        line-height: 1.15;
      }
      .hero-lead {
        font-size: 16px;
        margin-bottom: 24px;
      }
      .hero-actions {
        margin-top: 24px;
        gap: 12px;
      }
      .hero-actions .btn {
        flex: 1 1 auto;
        min-width: 180px;
      }
      .hero-stage {
        position: relative;
        inset: auto;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
        max-width: 720px;
        margin: 40px auto 0;
        padding: 0 16px;
      }
      .shot {
        position: relative;
        width: 100%;
        height: auto;
        aspect-ratio: 1 / 1;
        border-radius: 24px;
        overflow: hidden;
        box-shadow: 0 12px 32px rgba(15, 19, 32, 0.08);
      }
      .s1, .s2, .s3, .s4 {
        left: auto;
        right: auto;
        top: auto;
        width: auto;
        height: auto;
        border-radius: 24px;
      }
      .s5 {
        left: auto;
        top: auto;
        width: auto;
        transform: none;
        grid-column: 1 / -1;
        height: auto;
        aspect-ratio: 16 / 9;
        border-radius: 24px;
      }
    }

    /* 4K Crystal Clear 3D Shot Images */
    .shot img.shot-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      display: block;
      image-rendering: -webkit-optimize-contrast;
      image-rendering: crisp-edges;
      transition: transform .45s cubic-bezier(.2,.8,.2,1);
    }
    .shot:hover {
      transform: translateY(-4px);
      box-shadow: 0 28px 64px rgba(11, 92, 255, 0.16);
    }
    .shot:hover img.shot-img {
      transform: scale(1.05);
    }

    /* Spacious Equipment Grid */
    .equip-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important;
      gap: 22px !important;
    }
'''

# Replace additional_css beginning
add_idx = text.find("additional_css = '''")
if add_idx != -1:
    text = text[:add_idx + len("additional_css = '''")] + wide_scale_css + text[add_idx + len("additional_css = '''"):]

# Update new_hero_stage to use clean 1024x1024 images
hero_stage_code = '''
# 3D Render Hero Stage (4K Crystal Clear)
new_hero_stage = \'\'\'
    <div class="hero-stage">
      <!-- 1: POS monoblok -->
      <div class="shot s1" role="img" aria-label="POS monoblok ekrani">
        <img src="/images/hero/hero-pos-terminal.png" alt="Sensorli POS monoblok kassa ekrani" class="shot-img shot-pos" loading="eager"/>
      </div>

      <!-- 2: Face ID -->
      <div class="shot s2" role="img" aria-label="Face ID davomat terminali">
        <img src="/images/hero/hero-face-attendance.png" alt="Face ID va biometrik davomat nazorati" class="shot-img shot-face" loading="eager"/>
      </div>

      <!-- 3: Chek printer + skaner -->
      <div class="shot s3" role="img" aria-label="Chek printeri va shtrix-kod skaneri">
        <img src="/images/hero/hero-printer-scanner.png" alt="Chek printeri va shtrix-kod skaneri" class="shot-img shot-printer" loading="eager"/>
      </div>

      <!-- 4: Dashboard planshet -->
      <div class="shot s4" role="img" aria-label="Savdo hisoboti paneli">
        <img src="/images/hero/hero-analytics-dashboard.png" alt="Buxgalteriya va savdo tahlili paneli" class="shot-img shot-dash" loading="eager"/>
      </div>

      <!-- 5: AI monitoring -->
      <div class="shot s5" role="img" aria-label="Do‘kon ichidagi mijozlar oqimi xaritasi">
        <img src="/images/hero/hero-ai-camera-heatmap.png" alt="AI video kuzatuv va supermarket mijozlar oqimi xaritasi" class="shot-img shot-ai" loading="eager"/>
      </div>
    </div>
\'\'\'
'''

# Replace new_hero_stage definition
nhs_start = text.find("# 3D Render Hero Stage")
if nhs_start != -1:
    nhs_end = text.find("'''\n\n# 3.1 Replace hero-stage", nhs_start) + len("'''")
    text = text[:nhs_start] + hero_stage_code.strip() + text[nhs_end:]

with open('scripts/build_full_website.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated build_full_website.py with wide scale layout and crisp 4K 3D assets!")
