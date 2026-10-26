import re

with open('scripts/build_full_website.py', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Replace the hero layout CSS in additional_css
hero_css_start = text.find("/* ==================== EXPANSIVE WIDE SCALE LAYOUT ==================== */")
if hero_css_start == -1:
    hero_css_start = text.find("/* Desktop Viewport")

hero_css_end = text.find("/* ==================== SCRAPED HARDWARE CATALOG STYLING ==================== */")

perfect_first_page_css = '''/* ==================== PERFECT FIRST PAGE (HERO MOCKUP ACCURACY) ==================== */
    :root {
      --wrap: 1280px !important;
    }
    .wrap {
      max-width: 1280px !important;
      width: 100% !important;
    }

    /* 3D Shot Images in Hero (Full bleed, no padding, ultra crisp) */
    .shot img.shot-img {
      width: 100%;
      height: 100%;
      object-fit: cover !important;
      padding: 0 !important;
      display: block;
      image-rendering: -webkit-optimize-contrast;
      transition: transform .45s cubic-bezier(.2,.8,.2,1);
    }
    .shot:hover img.shot-img {
      transform: scale(1.05);
    }

    /* Hero Section matching media_1792931914132.png */
    .hero {
      position: relative;
      overflow: hidden;
      text-align: center;
      padding: 52px 0 0;
      min-height: 840px;
    }
    .hero-copy {
      position: relative;
      z-index: 5;
      width: min(100%, 54vw);
      max-width: 780px;
      margin: 0 auto;
      padding: 20px 20px 0;
    }
    .hero h1 {
      font-weight: 800;
      font-size: clamp(38px, 4.4vw, 70px);
      line-height: 1.08;
      letter-spacing: -.035em;
      text-wrap: balance;
      margin-bottom: 20px;
      color: var(--ink);
    }
    .hero h1 em {
      font-style: normal;
      color: var(--blue);
    }
    .hero-lead {
      margin: 0 auto 32px;
      max-width: 600px;
      font-size: clamp(16px, 1.35vw, 20px);
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
    .hero-actions .btn-primary {
      background: var(--blue);
      color: #fff;
      border-radius: 999px;
      height: 60px;
      padding: 0 36px;
      font-size: 18px;
      font-weight: 800;
      box-shadow: 0 10px 24px rgba(11, 92, 255, 0.28);
    }
    .hero-actions .btn-primary:hover {
      background: var(--blue-d);
      transform: translateY(-2px);
      box-shadow: 0 14px 32px rgba(11, 92, 255, 0.35);
    }
    .hero-actions .btn-soft {
      background: var(--soft);
      color: var(--blue);
      border-radius: 999px;
      height: 60px;
      padding: 0 32px;
      font-size: 18px;
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }
    .hero-actions .btn-soft:hover {
      background: var(--tint);
      transform: translateY(-2px);
    }

    /* Desktop Viewport (Exact 5-Card Placement) */
    @media (min-width: 1025px) {
      .hero-stage {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }
      .shot {
        position: absolute;
        overflow: hidden;
        pointer-events: auto;
        cursor: pointer;
        box-shadow: 0 20px 48px rgba(15, 19, 32, 0.09);
        transition: transform .4s cubic-bezier(.2,.8,.2,1), box-shadow .4s ease;
      }
      .shot:hover {
        transform: translateY(-6px) scale(1.02);
        box-shadow: 0 28px 64px rgba(15, 19, 32, 0.16);
      }
      .s1 {
        left: 0;
        top: 100px;
        width: min(19vw, 360px);
        height: 350px;
        border-radius: 0 72px 72px 0;
        background: linear-gradient(160deg, #f2e9dc, #dccdb8);
      }
      .s2 {
        left: 0;
        top: 480px;
        width: min(19vw, 370px);
        height: 380px;
        border-radius: 0 72px 72px 0;
        background: linear-gradient(160deg, #dfe8fb, #b9cdf3);
      }
      .s3 {
        right: 0;
        top: 70px;
        width: min(17.5vw, 340px);
        height: 350px;
        border-radius: 72px 0 0 72px;
        background: linear-gradient(160deg, #fbe9de, #f2cdb4);
      }
      .s4 {
        right: 0;
        top: 450px;
        width: min(17vw, 350px);
        height: 380px;
        border-radius: 72px 0 0 72px;
        background: linear-gradient(160deg, #e3f0fb, #bcd9f2);
      }
      .s5 {
        left: 50%;
        top: 400px;
        width: min(44vw, 760px);
        height: 440px;
        transform: translateX(-50%);
        border-radius: 160px 160px 0 0;
        background: linear-gradient(180deg, #eef2f8, #dfe6f1);
      }
    }

    /* Tablet & Mobile Hero Grid */
    @media (max-width: 1024px) {
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
        font-size: clamp(32px, 6vw, 48px);
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
        border-radius: 28px;
      }
    }

    /* Floating Cookie Pill Banner matching reference */
    .cookie {
      position: fixed;
      z-index: 60;
      left: 50%;
      bottom: 20px;
      transform: translateX(-50%);
      width: min(calc(100% - 32px), 860px);
      background: #ffffff;
      border-radius: 999px;
      box-shadow: 0 16px 48px rgba(15, 19, 32, 0.16);
      padding: 14px 26px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      border: 1px solid rgba(15, 19, 32, 0.06);
    }
    .cookie[hidden] { display: none; }
    .cookie p { font-size: 13.5px; font-weight: 600; color: #2b3142; line-height: 1.45; margin: 0; }
    .cookie .btn {
      background: var(--soft);
      color: var(--blue);
      height: 46px;
      padding: 0 32px;
      border-radius: 999px;
      border: none;
      font-weight: 800;
      font-size: 14px;
      cursor: pointer;
      flex-shrink: 0;
      transition: background .2s, color .2s;
    }
    .cookie .btn:hover {
      background: var(--blue);
      color: #ffffff;
    }
    @media (max-width: 680px) {
      .cookie {
        border-radius: 24px;
        flex-direction: column;
        align-items: stretch;
        padding: 18px 20px;
      }
      .cookie .btn { width: 100%; }
    }
'''

if hero_css_start != -1 and hero_css_end != -1:
    text = text[:hero_css_start] + perfect_first_page_css.strip() + '\n\n' + text[hero_css_end:]
    print("Replaced hero CSS with perfect first page styling!")
else:
    print("Could not find hero CSS boundaries, appending perfect_first_page_css")
    text = text.replace("additional_css = '''", "additional_css = '''\n" + perfect_first_page_css)

# Also ensure .shot img.shot-img padding: 10px is removed from anywhere else
text = text.replace("padding: 10px;", "padding: 0 !important;")

with open('scripts/build_full_website.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Saved scripts/build_full_website.py!")
