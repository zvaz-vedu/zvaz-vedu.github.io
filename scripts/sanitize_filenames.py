import os
import re
import urllib.parse
import unicodedata

def slugify_filename(name):
    # Normalize to NFC to combine base characters and diacritics (e.g. z + caron -> ž)
    name = unicodedata.normalize('NFC', name)
    # Replace spaces with underscores
    name = name.replace(' ', '_')
    # Remove any character that is NOT a word character (\w), a dot (.), or a hyphen (-)
    # \w includes a-z, A-Z, 0-9, _, and unicode letters (like á, č, ě...)
    name = re.sub(r'[^\w.-]', '', name)
    # Remove multiple underscores
    name = re.sub(r'_+', '_', name)
    return name

def main():
    base_dirs = ["static/media/imgs", "content"]
    renames = {} # {old_name: new_name} for exact replacement
    
    # 1. Rename files
    for base_dir in base_dirs:
        if not os.path.exists(base_dir):
            continue
        for root, dirs, files in os.walk(base_dir, topdown=False):
            for name in files:
                new_name = slugify_filename(name)
                if new_name != name:
                    old_path = os.path.join(root, name)
                    new_path = os.path.join(root, new_name)
                    os.rename(old_path, new_path)
                    renames[name] = new_name
                    try:
                        print(f"Renamed file: {name} -> {new_name}".encode('utf-8').decode('cp1250', 'replace'))
                    except:
                        pass

            for name in dirs:
                new_name = slugify_filename(name)
                if new_name != name:
                    old_path = os.path.join(root, name)
                    new_path = os.path.join(root, new_name)
                    os.rename(old_path, new_path)
                    renames[name] = new_name
                    try:
                        print(f"Renamed dir: {name} -> {new_name}".encode('utf-8').decode('cp1250', 'replace'))
                    except:
                        pass

    if not renames:
        print("No files to sanitize found.")
        return

    # 2. Update content, data, layouts
    dirs_to_update = ['content', 'data', 'layouts', 'static/css']
    
    for update_dir in dirs_to_update:
        if not os.path.exists(update_dir):
            continue
        for root, dirs, files in os.walk(update_dir):
            for file in files:
                if file.endswith(('.md', '.html', '.yml', '.yaml', '.json', '.toml', '.css')):
                    filepath = os.path.join(root, file)
                    with open(filepath, 'r', encoding='utf-8') as f:
                        try:
                            content = f.read()
                        except UnicodeDecodeError:
                            continue
                    
                    new_content = content
                    for old_name, new_name in sorted(renames.items(), key=lambda x: len(x[0]), reverse=True):
                        old_name_encoded = urllib.parse.quote(old_name)
                        if old_name in new_content:
                            new_content = new_content.replace(old_name, new_name)
                        if old_name_encoded in new_content and old_name_encoded != old_name:
                            new_content = new_content.replace(old_name_encoded, new_name)
                    
                    if new_content != content:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Updated references in: {filepath}")

if __name__ == '__main__':
    main()
