import sys
import os

file_path = "src/app/page.tsx"
with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

try:
    # Reverse the mojibake
    fixed_bytes = text.encode('cp1251')
    fixed_text = fixed_bytes.decode('utf-8')
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(fixed_text)
    print("Encoding fixed successfully.")
except Exception as e:
    print(f"Error: {e}")
