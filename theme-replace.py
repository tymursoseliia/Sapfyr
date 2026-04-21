import os
import re

REPLACEMENTS = {
    r'\btext-white/90\b': 'text-gray-800',
    r'\btext-white/80\b': 'text-gray-700',
    r'\btext-white/70\b': 'text-gray-600',
    r'\btext-white/60\b': 'text-gray-500',
    r'\btext-white/50\b': 'text-gray-500',
    r'\btext-white/40\b': 'text-gray-400',
    r'\btext-white/30\b': 'text-gray-400',
    r'\btext-white/20\b': 'text-gray-300',
    r'\btext-white/10\b': 'text-gray-200',
    r'\btext-white/5\b': 'text-gray-100',
    r'\btext-white\b': 'text-gray-900',
    r'\bbg-white/20\b': 'bg-gray-300',
    r'\bbg-white/10\b': 'bg-gray-200',
    r'\bbg-white/5\b': 'bg-gray-100',
    r'\bborder-white/20\b': 'border-gray-300',
    r'\bborder-white/10\b': 'border-gray-200',
    r'\bborder-white/5\b': 'border-gray-100',
    r'\bbg-black/40\b': 'bg-white',
    r'\bhover:text-white\b': 'hover:text-gray-900',
    r'\bhover:text-white/80\b': 'hover:text-gray-700',
    r'\bhover:text-white/70\b': 'hover:text-gray-600',
    r'\bgroup-hover:text-white\b': 'group-hover:text-gray-900',
    r'\bhover:bg-white/10\b': 'hover:bg-gray-200',
    r'\bhover:bg-white/20\b': 'hover:bg-gray-300',
    r'\bplaceholder:text-white/30\b': 'placeholder:text-gray-400',
}

DIRS = ['src/app', 'src/components']

def process_file(filepath):
    if not filepath.endswith(('.tsx', '.ts')):
        return
    if 'Header.tsx' in filepath or 'Footer.tsx' in filepath:
        return
    
    with open(filepath, 'r') as f:
        content = f.read()
    
    original = content
    # Process longest first to avoid partial replacements (though \b prevents it)
    keys = sorted(REPLACEMENTS.keys(), key=len, reverse=True)
    
    for key in keys:
        content = re.sub(key, REPLACEMENTS[key], content)
        
    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")

for d in DIRS:
    for root, dirs, files in os.walk(d):
        for file in files:
            process_file(os.path.join(root, file))
