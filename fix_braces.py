with open('scripts/generate_standalone_service_pages.py', 'r', encoding='utf-8') as f:
    text = f.read()

bad_tg = '''  <script>
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      try {
        tg.ready();
        tg.expand();
        if (tg.BackButton) {
          tg.BackButton.show();
          tg.BackButton.onClick(function() {
            window.location.href = 'dashboardsale.html';
          });
        }
        if (tg.colorScheme === 'dark') {
          document.documentElement.setAttribute('data-theme', 'dark');
        }
      } catch(e) {}
    }
  </script>'''

good_tg = '''  <script>
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {{
      const tg = window.Telegram.WebApp;
      try {{
        tg.ready();
        tg.expand();
        if (tg.BackButton) {{
          tg.BackButton.show();
          tg.BackButton.onClick(function() {{
            window.location.href = 'dashboardsale.html';
          }});
        }}
        if (tg.colorScheme === 'dark') {{
          document.documentElement.setAttribute('data-theme', 'dark');
        }}
      }} catch(e) {{}}
    }}
  </script>'''

text = text.replace(bad_tg, good_tg)

with open('scripts/generate_standalone_service_pages.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Braces escaped for f-string!")
