import os
import re

public_dir = os.path.join(os.getcwd(), 'public')

img_tag_pattern = re.compile(r'<img[^>]+>')
src_pattern = re.compile(r'src=["\']([^"\']+\.webp)["\']')
srcset_pattern = re.compile(r'srcset=')

found = False
for root, dirs, files in os.walk(public_dir):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            img_tags = img_tag_pattern.findall(content)
            for tag in img_tags:
                src_match = src_pattern.search(tag)
                if src_match:
                    src = src_match.group(1)
                    if not srcset_pattern.search(tag):
                        # Filter out known small graphics
                        if '/media/imgs/base/' not in src and '/media/imgs/partners/' not in src and 'vystrcil-transparent.webp' not in src and '/media/imgs/persons/' not in src and '/media/imgs/orgs/' not in src:
                            print(f"[{file}] Missing srcset: {tag}")
                            found = True

if not found:
    print("All relevant .webp images have srcset!")
