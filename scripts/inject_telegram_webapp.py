import re
import os

print("Injecting Telegram WebApp SDK and logic...")

# 1. Update scripts/build_full_website.py
with open('scripts/build_full_website.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Add Telegram WebApp SDK in <head>
sdk_tag = '<script src="https://telegram.org/js/telegram-web-app.js"></script>'
if sdk_tag not in text:
    text = text.replace('additional_css = \'\'\'', f"additional_css = \'\'\'\n    /* Telegram WebApp Safe Areas */\n    body {{ padding-top: env(safe-area-inset-top); padding-bottom: env(safe-area-inset-bottom); }}\n")

# Add WebApp JS logic
webapp_js = '''
  // ==================== TELEGRAM MINI APP INITIALIZATION ====================
  const isTelegramWebApp = typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp && !!window.Telegram.WebApp.initData;
  if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    try {
      tg.ready();
      tg.expand();
      
      // Auto-sync theme with Telegram client
      if (tg.colorScheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeUI('dark');
      } else if (tg.colorScheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        updateThemeUI('light');
      }

      tg.onEvent('themeChanged', function() {
        const theme = tg.colorScheme === 'dark' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('ds_theme', theme);
        updateThemeUI(theme);
      });

      // Set header color
      if (tg.setHeaderColor) {
        tg.setHeaderColor('#0b5cff');
      }
    } catch(e) {
      console.log('Telegram WebApp init note:', e);
    }
  }

  function triggerTgHaptic(type = 'light') {
    try {
      if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
        if (type === 'success' || type === 'error' || type === 'warning') {
          window.Telegram.WebApp.HapticFeedback.notificationOccurred(type);
        } else {
          window.Telegram.WebApp.HapticFeedback.impactOccurred(type);
        }
      }
    } catch(e) {}
  }
'''

# Update submitProductOrder to handle Telegram WebApp sendData
old_submit_target = "function submitProductOrder(e) {"
new_submit_logic = '''function submitProductOrder(e) {
    e.preventDefault();
    const name = document.getElementById('orderCustName').value.trim();
    const phone = document.getElementById('orderCustPhone').value.trim();
    const comment = document.getElementById('orderCustComment').value.trim();

    if (!name || !phone) {
      alert('Iltimos, ismingiz va telefon raqamingizni kiriting!');
      return;
    }

    triggerTgHaptic('success');

    // If inside Telegram WebApp
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData) {
      const tg = window.Telegram.WebApp;
      const orderData = {
        action: 'order',
        product: currentOrderProduct.name,
        price: currentOrderProduct.price,
        customerName: name,
        customerPhone: phone,
        comment: comment
      };
      
      try {
        tg.sendData(JSON.stringify(orderData));
      } catch(e) {}

      // Also call local API in background
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          notes: `[TG MiniApp] Mahsulot: ${currentOrderProduct.name} (${currentOrderProduct.price}). Izoh: ${comment}`
        })
      }).catch(() => {});

      if (tg.showAlert) {
        tg.showAlert(`Rahmat, ${name}! Buyurtmangiz qabul qilindi. Tez orada siz bilan bog‘lanamiz.`);
      } else {
        alert(`Rahmat, ${name}! Buyurtmangiz qabul qilindi.`);
      }
      closeProductOrder();
      return;
    }
'''

if old_submit_target in text and "triggerTgHaptic('success');" not in text:
    text = text.replace(old_submit_target, new_submit_logic)

# Insert webapp_js into scripts_js
if "isTelegramWebApp" not in text:
    text = text.replace("scripts_js = '''", f"scripts_js = '''\n{webapp_js}\n")

# Insert SDK tag into base_html head replacement
if sdk_tag not in text:
    text = text.replace("</head>", f"  {sdk_tag}\n</head>")

with open('scripts/build_full_website.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("build_full_website.py updated with Telegram WebApp SDK!")
