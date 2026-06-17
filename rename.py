import os
import re

directories = ['.github', 'apps', 'docs', 'notes', 'rust', 'script']
extensions = ('.ts', '.tsx', '.js', '.mjs', '.json', '.toml', '.md', '.rs', '.html', '.yml', 'Dockerfile', '.example')

replacements = [
    (re.compile(r'opencut'), 'dreamy'),
    (re.compile(r'OpenCut'), 'Dreamy'),
    (re.compile(r'OPENCUT'), 'DREAMY'),
]

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content
        for pattern, replacement in replacements:
            new_content = pattern.sub(replacement, new_content)
            
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
                f.write(new_content)
            print(f'Updated {filepath}')
    except Exception as e:
        print(f"Failed {filepath}: {e}")

for root, _, files in os.walk('.'):
    if 'node_modules' in root or '.git' in root or 'backup_cutflow' in root or '.next' in root or 'dist' in root or 'pkg' in root:
        continue
        
    for file in files:
        if file.endswith(extensions) or file in ['Dockerfile', 'Cargo.toml', 'package.json', 'wrangler.jsonc', 'README.md', 'turbo.json']:
            process_file(os.path.join(root, file))
