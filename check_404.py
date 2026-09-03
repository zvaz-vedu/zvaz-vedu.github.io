import os
from pathlib import Path
import re

files = list(Path('public').rglob('*.html'))
pattern = re.compile(r'src=[\'\"](/media[^\'\"]+\.webp)[\'\"]')
srcset_pattern = re.compile(r'(/media[^\s,\'\"]+\.webp)\s+\d+w')
missing = []

import urllib.parse
for f in files:
    content = f.read_text(encoding='utf-8')
    for img in pattern.findall(content):
        if img.startswith('/media/imgs/base/') or img.startswith('/media/imgs/partners/') or img.startswith('/media/imgs/orgs/'):
            continue
        decoded_img = urllib.parse.unquote(img)
        disk_path = 'static' + decoded_img
        if not os.path.exists(disk_path):
            missing.append(img)
            
    for match in srcset_pattern.findall(content):
        if match.startswith('/media/imgs/base/') or match.startswith('/media/imgs/partners/') or match.startswith('/media/imgs/orgs/'):
            continue
        decoded_match = urllib.parse.unquote(match)
        disk_path = 'static' + decoded_match
        if not os.path.exists(disk_path):
            missing.append(match)

if missing:
    print('404 Missing images:')
    for m in set(missing):
        print(m)
else:
    print('No 404 images found.')
