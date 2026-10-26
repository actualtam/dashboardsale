with open('scripts/build_full_website.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if "output_html.replace('</head>'" in line:
        new_lines.append("output_html = output_html.replace('</head>', '<style>\\n' + additional_css + '\\n</style>\\n<script src=\"https://telegram.org/js/telegram-web-app.js\"></script>\\n</head>')\n")
    else:
        new_lines.append(line)

with open('scripts/build_full_website.py', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Syntax fixed successfully!")
