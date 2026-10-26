import json
import os
import re

print("Enhancing standalone service pages with interactive professional presentation...")

with open('scripts/generate_standalone_service_pages.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Add presentation styles to service_css
pres_css = '''
/* Interactive Presentation Stepper Styles */
.svc-presentation-sec {
  padding: 64px 0;
  background: #090d16;
  color: #fff;
  border-top: 1px solid rgba(255,255,255,0.08);
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.svc-pres-head {
  text-align: center;
  max-width: 840px;
  margin: 0 auto 40px;
}
.svc-pres-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 18px;
  border-radius: 999px;
  background: rgba(11,92,255,0.18);
  color: #3b82f6;
  font-size: 13.5px;
  font-weight: 700;
  margin-bottom: 14px;
  border: 1px solid rgba(11,92,255,0.3);
}
.svc-pres-title {
  font-size: clamp(26px, 4vw, 38px);
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 12px;
  line-height: 1.22;
}
.svc-pres-sub {
  font-size: 16px;
  color: #94a3b8;
  line-height: 1.6;
}

.svc-pres-grid {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 50px;
  align-items: center;
}
@media (max-width: 960px) {
  .svc-pres-grid {
    grid-template-columns: 1fr;
    gap: 36px;
  }
}

/* Smartphone Device Mockup */
.device-frame-wrap {
  position: relative;
  max-width: 360px;
  margin: 0 auto;
}
.device-phone {
  background: #181f2f;
  border-radius: 44px;
  padding: 12px;
  box-shadow: 0 30px 70px rgba(0,0,0,0.7), 0 0 0 2px rgba(255,255,255,0.12), inset 0 0 0 2px #0c101a;
  position: relative;
}
.device-speaker {
  width: 90px;
  height: 18px;
  background: #090d16;
  border-radius: 0 0 12px 12px;
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
}
.device-screen-box {
  border-radius: 34px;
  overflow: hidden;
  background: #000;
  position: relative;
  aspect-ratio: 459 / 1024;
}
.pres-screen-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: none;
  opacity: 0;
  transition: opacity 0.35s ease, transform 0.35s ease;
  transform: scale(0.98);
}
.pres-screen-img.active {
  display: block;
  opacity: 1;
  transform: scale(1);
}

/* Stepper items */
.pres-stepper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.pres-step-item {
  background: rgba(255,255,255,0.03);
  border: 1.5px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  padding: 22px;
  cursor: pointer;
  text-align: left;
  transition: all 0.25s ease;
  display: flex;
  gap: 18px;
}
.pres-step-item:hover {
  background: rgba(255,255,255,0.06);
  border-color: rgba(11,92,255,0.4);
}
.pres-step-item.active {
  background: rgba(11,92,255,0.14);
  border-color: #0b5cff;
  box-shadow: 0 10px 28px rgba(11,92,255,0.22);
}
.pres-step-num {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(255,255,255,0.08);
  color: #fff;
  font-size: 18px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
}
.pres-step-item.active .pres-step-num {
  background: #0b5cff;
  color: #fff;
  box-shadow: 0 4px 14px rgba(11,92,255,0.4);
}
.pres-step-content h4 {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 6px;
}
.pres-step-content p {
  font-size: 14px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
}
.pres-step-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}
.pres-tag {
  font-size: 11.5px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(255,255,255,0.06);
  color: #cbd5e1;
}
.pres-step-item.active .pres-tag {
  background: rgba(11,92,255,0.25);
  color: #93c5fd;
}
.pres-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding-top: 14px;
}
.pres-nav-btn {
  padding: 10px 18px;
  border-radius: 10px;
  background: rgba(255,255,255,0.08);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  border: 1px solid rgba(255,255,255,0.12);
  cursor: pointer;
  transition: all 0.2s;
}
.pres-nav-btn:hover {
  background: #0b5cff;
  border-color: #0b5cff;
}
'''

# Inject presentation section into template
if 'svc-presentation-sec' not in text:
    text = text.replace('/* Service Pages Shared Styles */', pres_css + '\n/* Service Pages Shared Styles */')

# Add specific presentation data for TGShop and other services
TGSHOP_PRES_HTML = '''
    <!-- ==================== INTERACTIVE PRESENTATION ==================== -->
    <section id="presentation" class="svc-presentation-sec">
      <div class="wrap">
        <div class="svc-pres-head">
          <span class="svc-pres-badge">✨ Jonli Prezentatsiya</span>
          <h2 class="svc-pres-title">Telegram Mini App (TGShop) Ekotizimi Qanday Ishlaydi?</h2>
          <p class="svc-pres-sub">Quyidagi 4 ta bosqichni bosing va mijoz sizning Telegram do‘koningizda tovar tanlashidan tortib, yetkazib berilguncha bo‘lgan professional jarayonni jonli ko‘ring:</p>
        </div>

        <div class="svc-pres-grid">
          <!-- Left: Phone Device Frame -->
          <div class="device-frame-wrap">
            <div class="device-phone">
              <div class="device-speaker"></div>
              <div class="device-screen-box">
                <img id="presImg1" src="/images/services/tgshop-steps/step1-catalog.png" alt="1-bosqich: Katalog va qidiruv" class="pres-screen-img active"/>
                <img id="presImg2" src="/images/services/tgshop-steps/step2-variants.png" alt="2-bosqich: Rang va o‘lcham tanlovi" class="pres-screen-img"/>
                <img id="presImg3" src="/images/services/tgshop-steps/step3-checkout.png" alt="3-bosqich: Dastavka va to‘lov" class="pres-screen-img"/>
                <img id="presImg4" src="/images/services/tgshop-steps/step4-tracking.png" alt="4-bosqich: Buyurtma kuzatuv" class="pres-screen-img"/>
              </div>
            </div>
            <div style="text-align:center;margin-top:14px;font-size:12.5px;color:#94a3b8;">
              <span id="presStepCounter">1-bosqich / 4 ta bosqich</span>
            </div>
          </div>

          <!-- Right: Interactive Stepper -->
          <div class="pres-stepper">
            <div class="pres-step-item active" data-step="1" onclick="switchPresStep(1)">
              <div class="pres-step-num">1</div>
              <div class="pres-step-content">
                <h4>Katalog va Mahsulotlar Vitrinasi</h4>
                <p>Telegram WebApp ochilishi bilan xaridor oldida yuqori sifatli qorong‘u (luxury dark) dizayndagi tovarlar katalogi, qulay toifalar (Outerwear, Footwear, Denim), narx filtrlari va qidiruv chiqadi. Hech qanday ilova yuklash shart emas.</p>
                <div class="pres-step-tags">
                  <span class="pres-tag">Telegram WebApp</span>
                  <span class="pres-tag">Katalog & Qidiruv</span>
                  <span class="pres-tag">Filtrlar</span>
                  <span class="pres-tag">In-Stock Only</span>
                </div>
              </div>
            </div>

            <div class="pres-step-item" data-step="2" onclick="switchPresStep(2)">
              <div class="pres-step-num">2</div>
              <div class="pres-step-content">
                <h4>Rang, Narx va O‘lchov Tanlovi</h4>
                <p>Mahsulot ichiga kirilganda xaridor tovar fotosurati, tavsifi, narxi, mavjud ranglar palitrasi (Shade: Black) va o‘lchamlarni ([XS], [S], [M], [L], [XL], [2XL]) bitta tegishda tanlaydi va savatga qo‘shadi.</p>
                <div class="pres-step-tags">
                  <span class="pres-tag">Ranglar tanlovi</span>
                  <span class="pres-tag">O‘lcham [XS-2XL]</span>
                  <span class="pres-tag">Tovar xususiyatlari</span>
                  <span class="pres-tag">Qoldiqlar nazorati</span>
                </div>
              </div>
            </div>

            <div class="pres-step-item" data-step="3" onclick="switchPresStep(3)">
              <div class="pres-step-num">3</div>
              <div class="pres-step-content">
                <h4>Yetkazib Berish va To‘lov Tanlovlari</h4>
                <p>Buyurtmani rasmiylashtirishda xaridor ismi, telefoni, yetkazib berish usuli (Courier Delivery / Store Pickup), manzil va to‘lov turi (Cash on Delivery / Click / Payme / Card Transfer) tanlanadi. Dastavka narxi avtomatik hisoblanadi.</p>
                <div class="pres-step-tags">
                  <span class="pres-tag">Courier Delivery</span>
                  <span class="pres-tag">Store Pickup</span>
                  <span class="pres-tag">Click & Payme</span>
                  <span class="pres-tag">Naqd to‘lov</span>
                </div>
              </div>
            </div>

            <div class="pres-step-item" data-step="4" onclick="switchPresStep(4)">
              <div class="pres-step-num">4</div>
              <div class="pres-step-content">
                <h4>Berilgan Zakaz Yetib Kelish Holati (Real-time Tracking)</h4>
                <p>Buyurtma berilgach, mijoz Telegramda buyurtmaning real-vaqt holatini kuzatib boradi: ❶ Placed (Qabul qilindi) → ❷ Paid / Unpaid (To‘landi) → ❸ Packed (Qadoqlandi) → ❹ Dispatched (Kuryerga berildi) → ❺ Delivered (Yetkazildi). Bitta tugma bilan buyurtmani takrorlash imkoniyati.</p>
                <div class="pres-step-tags">
                  <span class="pres-tag">Real-Time Tracking</span>
                  <span class="pres-tag">5 ta status</span>
                  <span class="pres-tag">Push-xabarnoma</span>
                  <span class="pres-tag">Takroriy buyurtma</span>
                </div>
              </div>
            </div>

            <div class="pres-controls">
              <button class="pres-nav-btn" onclick="prevPresStep()">← Oldingi qadam</button>
              <a href="#apply-section" class="btn btn-sm btn-p" style="padding:10px 20px;">Ushbu tizimga ariza qoldirish</a>
              <button class="pres-nav-btn" onclick="nextPresStep()">Keyingi qadam →</button>
            </div>
          </div>
        </div>
      </div>
    </section>
'''

# Presentation JS logic
pres_js = '''
  let currentPresStep = 1;
  function switchPresStep(step) {
    currentPresStep = step;
    for (let i = 1; i <= 4; i++) {
      const img = document.getElementById('presImg' + i);
      if (img) img.classList.toggle('active', i === step);
    }
    document.querySelectorAll('.pres-step-item').forEach(item => {
      const s = parseInt(item.getAttribute('data-step') || '1');
      item.classList.toggle('active', s === step);
    });
    const counter = document.getElementById('presStepCounter');
    if (counter) counter.textContent = step + '-bosqich / 4 ta bosqich';
  }

  function nextPresStep() {
    let next = currentPresStep + 1;
    if (next > 4) next = 1;
    switchPresStep(next);
  }

  function prevPresStep() {
    let prev = currentPresStep - 1;
    if (prev < 1) prev = 4;
    switchPresStep(prev);
  }
'''

with open('scripts/generate_standalone_service_pages.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Saved presentation system styles in generator.")
