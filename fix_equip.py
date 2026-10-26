with open('scripts/build_full_website.py', 'r', encoding='utf-8') as f:
    text = f.read()

equip_code = '''
new_equipment_section = f\'\'\'
  <!-- ==================== EQUIPMENT ==================== -->
  <section id="equipment" class="sec equip-sec">
    <div class="wrap">
      <div class="sec-head">
        <h2 data-i18n="sec_equip_title">Do‘kon va kassa uskunalari katalogi</h2>
        <p data-i18n="sec_equip_desc">Rasmiy kafolatli kassa texnikalari, skanerlar, sensorli monobloklar va sarf materiallari.</p>
      </div>
      {catalog_html}
    </div>
  </section>
\'\'\'

# 5. Replace Equipment section
'''

text = text.replace("# 5. Replace Equipment section", equip_code.strip() + '\n')

with open('scripts/build_full_website.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Added new_equipment_section definition!")
