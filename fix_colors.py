import os
import re

path = r'c:\Users\rabot\OneDrive\Desktop\Новая компания Винница\auto-europe-site\src\app\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace specific tailwind classes
content = re.sub(r'to-orange-(\d+)', r'to-blue-\1', content)
content = re.sub(r'from-orange-(\d+)', r'from-blue-\1', content)
content = re.sub(r'via-orange-(\d+)', r'via-blue-\1', content)
content = re.sub(r'text-orange-(\d+)', r'text-blue-\1', content)
content = re.sub(r'bg-orange-(\d+)', r'bg-blue-\1', content)
content = re.sub(r'border-orange-(\d+)', r'border-blue-\1', content)
content = re.sub(r'to-yellow-500', r'to-cyan-400', content)

# Replace the specific orange rgba shadow
content = content.replace('rgba(234,88,12', 'rgba(59,130,246')

# There is also a hardcoded #401204 (deep red background) in line 500
content = content.replace('#401204', '#040b16')

# And some red-500 classes for icons/bg
content = content.replace('bg-red-500', 'bg-blue-600')
content = content.replace('text-red-500', 'text-blue-600')
content = content.replace('border-red-500', 'border-blue-600')
content = content.replace('bg-red-400', 'bg-blue-500')
content = content.replace('border-red-400', 'border-blue-500')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Replacements done in page.tsx')
