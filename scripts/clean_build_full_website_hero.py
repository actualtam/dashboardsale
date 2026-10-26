with open('scripts/build_full_website.py', 'r', encoding='utf-8') as f:
    text = f.read()

start_marker = "additional_css = '''"
end_marker = "/* ==================== THEME VARIABLES ==================== */"

start_idx = text.find(start_marker)
end_idx = text.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print(f"Error: Markers not found! start_idx={start_idx}, end_idx={end_idx}")
    exit(1)

clean_hero_and_services_css = '''additional_css = \'\'\'
    /* ==================== 1. PERFECT FIRST PAGE (HERO MOCKUP ACCURACY) ==================== */
    :root {
      --wrap: 1280px !important;
    }
    .wrap {
      max-width: 1280px !important;
      width: 100% !important;
    }

    /* 3D Shot Images in Hero (Full bleed, no padding, ultra crisp matching media_1792931914132.png) */
    .shot img.shot-img {
      width: 100%;
      height: 100%;
      object-fit: cover !important;
      padding: 0 !important;
      margin: 0 !important;
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
      padding: 64px 0 0;
      min-height: 860px;
    }
    .hero-copy {
      position: relative;
      z-index: 5;
      width: min(100%, 54vw);
      max-width: 800px;
      margin: 0 auto;
      padding: 24px 20px 0;
    }
    .hero h1 {
      font-weight: 800;
      font-size: clamp(38px, 4.4vw, 76px);
      line-height: 1.06;
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
      margin: 28px auto 0;
      max-width: 620px;
      font-size: clamp(16px, 1.4vw, 21px);
      line-height: 1.55;
      font-weight: 600;
      color: var(--mute);
      text-wrap: balance;
    }
    .hero-actions {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 18px;
      margin-top: 40px;
      flex-wrap: wrap;
    }
    .hero-actions .btn-primary {
      background: var(--blue);
      color: #fff;
      border-radius: 999px;
      height: 60px;
      padding: 0 38px;
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
      padding: 0 34px;
      font-size: 18px;
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      gap: 12px;
    }
    .hero-actions .btn-soft:hover {
      background: var(--tint);
      transform: translateY(-2px);
    }

    /* Desktop Viewport (Exact 5-Card Placement matching reference) */
    @media (min-width: 1101px) {
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
        top: 110px;
        width: min(19vw, 360px);
        height: 360px;
        border-radius: 0 72px 72px 0;
        background: linear-gradient(160deg, #f2e9dc, #dccdb8);
      }
      .s2 {
        left: 0;
        top: 520px;
        width: min(20vw, 384px);
        height: 380px;
        border-radius: 0 72px 72px 0;
        background: linear-gradient(160deg, #dfe8fb, #b9cdf3);
      }
      .s3 {
        right: 0;
        top: 70px;
        width: min(17.5vw, 340px);
        height: 360px;
        border-radius: 72px 0 0 72px;
        background: linear-gradient(160deg, #fbe9de, #f2cdb4);
      }
      .s4 {
        right: 0;
        top: 480px;
        width: min(17vw, 380px);
        height: 400px;
        border-radius: 72px 0 0 72px;
        background: linear-gradient(160deg, #e3f0fb, #bcd9f2);
      }
      .s5 {
        left: 50%;
        top: 540px;
        width: min(42vw, 780px);
        height: 360px;
        transform: translateX(-50%);
        border-radius: 160px 160px 0 0;
        background: linear-gradient(180deg, #eef2f8, #dfe6f1);
      }
    }

    /* Tablet & Mobile Hero Grid */
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
      width: min(calc(100% - 32px), 880px);
      background: #ffffff;
      border-radius: 999px;
      box-shadow: 0 16px 50px rgba(15, 19, 32, 0.18);
      padding: 16px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      border: 1px solid rgba(15, 19, 32, 0.06);
    }
    .cookie[hidden] { display: none; }
    .cookie p { font-size: 14.5px; font-weight: 600; color: #2b3142; line-height: 1.45; margin: 0; }
    .cookie .btn {
      background: var(--soft);
      color: var(--blue);
      height: 48px;
      padding: 0 34px;
      border-radius: 999px;
      border: none;
      font-weight: 800;
      font-size: 15px;
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

    /* ==================== 2. SERVICES 3D ICON TILES & PADDED VISUALS ==================== */
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

    /* Telegram WebApp Safe Areas */
    body { padding-top: env(safe-area-inset-top); padding-bottom: env(safe-area-inset-bottom); }

'''

new_text = text[:start_idx] + clean_hero_and_services_css + text[end_idx:]

with open('scripts/build_full_website.py', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("build_full_website.py successfully updated with clean Hero and Services CSS!")
