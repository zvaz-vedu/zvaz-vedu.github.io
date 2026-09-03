import re

with open('content/o-nas/_index.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern for <img src="...aboutX.webp" alt="...">
pattern = r'<img src="/media/imgs/about/about(\d).webp" alt="([^"]+)">'

def replacer(match):
    idx = match.group(1)
    alt = match.group(2)
    return f'<img src="/media/imgs/about/about{idx}-sm.webp" srcset="/media/imgs/about/about{idx}-sm.webp 600w, /media/imgs/about/about{idx}-md.webp 1200w, /media/imgs/about/about{idx}-hd.webp 1920w" sizes="(max-width: 800px) 100vw, 30vw" alt="{alt}">'

new_content = re.sub(pattern, replacer, content)

with open('content/o-nas/_index.md', 'w', encoding='utf-8') as f:
    f.write(new_content)
print("Updated content/o-nas/_index.md")
