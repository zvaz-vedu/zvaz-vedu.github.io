#!/usr/bin/env python3
"""
Format Typography (Czech Prepositions and Conjunctions)

Automatically replaces standard spaces after single-letter Czech prepositions
and conjunctions (k, s, v, z, o, u, a, i - case-insensitive) with non-breaking
spaces (\\u00A0) in content (*.md) and data (*.yaml, *.yml) files.

Safely ignores code blocks, inline code, HTML tags, HTML comments, URLs,
and YAML keys.
"""

import os
import re
import sys

PREP_PATTERN = re.compile(
    r'(?<=[\s\u00A0(„"\'\u201C\u201E\u2018\u201A\u00AB\u00BB\[{<>–—\-])([ksvzouaiKSVZOUAI])\s+|^([ksvzouaiKSVZOUAI])\s+',
    re.MULTILINE
)

def fix_prepositions(text: str) -> str:
    def repl(m):
        char = m.group(1) or m.group(2)
        return char + '\u00A0'
    
    # Run twice for consecutive single-letter words (e.g., "i v Praze")
    res = PREP_PATTERN.sub(repl, text)
    return PREP_PATTERN.sub(repl, res)

def process_file_content(content: str) -> str:
    placeholders = []
    
    def add_placeholder(match):
        idx = len(placeholders)
        placeholders.append(match.group(0))
        return f"__SAFE_PLACEHOLDER_{idx}__"

    # 1. Protect fenced code blocks (``` ... ``` or ~~~ ... ~~~)
    content = re.sub(r'(```[\s\S]*?```|~~~[\s\S]*?~~~)', add_placeholder, content)

    # 2. Protect inline code (`...`)
    content = re.sub(r'(`[^`\n]+`)', add_placeholder, content)

    # 3. Protect HTML comments
    content = re.sub(r'(<!--[\s\S]*?-->)', add_placeholder, content)

    # 4. Protect raw URLs (http:// or https://)
    content = re.sub(r'(https?://[^\s"\'<>)]+)', add_placeholder, content)

    # 5. Protect markdown link destinations: [text](URL)
    def protect_link_target(m):
        idx = len(placeholders)
        placeholders.append(m.group(2))
        return f"{m.group(1)}(__SAFE_PLACEHOLDER_{idx}__)"
    content = re.sub(r'(\[[^\]]*\])\(([^)]+)\)', protect_link_target, content)

    # 6. Protect HTML tags (<tag ...>)
    content = re.sub(r'(</?[a-zA-Z][^>]*>)', add_placeholder, content)

    # 7. Protect YAML keys in frontmatter or YAML files (e.g. "title: ")
    def protect_yaml_key(m):
        idx = len(placeholders)
        placeholders.append(m.group(1))
        return f"__SAFE_PLACEHOLDER_{idx}__{m.group(2)}"
    content = re.sub(r'(^[ \t]*[a-zA-Z0-9_-]+:)(\s+)', protect_yaml_key, content, flags=re.MULTILINE)

    # 8. Apply typography fix to all remaining text
    content = fix_prepositions(content)

    # 9. Restore placeholders in reverse order
    for idx in range(len(placeholders) - 1, -1, -1):
        content = content.replace(f"__SAFE_PLACEHOLDER_{idx}__", placeholders[idx])

    return content

def process_directory(directory: str, extensions: tuple) -> int:
    modified_count = 0
    for root, _, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(extensions):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        original = f.read()
                    
                    processed = process_file_content(original)
                    
                    if processed != original:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(processed)
                        print(f"Formatted: {filepath}")
                        modified_count += 1
                except Exception as e:
                    print(f"Error processing {filepath}: {e}", file=sys.stderr)
    return modified_count

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    content_dir = os.path.join(base_dir, 'content')
    data_dir = os.path.join(base_dir, 'data')

    total_modified = 0
    if os.path.isdir(content_dir):
        print(f"Processing content in {content_dir}...")
        total_modified += process_directory(content_dir, ('.md', '.markdown'))

    if os.path.isdir(data_dir):
        print(f"Processing data in {data_dir}...")
        total_modified += process_directory(data_dir, ('.yaml', '.yml'))

    print(f"\nDone! Modified {total_modified} files.")

if __name__ == '__main__':
    main()
