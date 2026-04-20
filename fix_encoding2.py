import sys
import os

file_path = "src/app/page.tsx"
with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

out = bytearray()
for c in text:
    try:
        out += c.encode('cp1251')
    except UnicodeEncodeError:
        # If it's an undefined character in cp1251 but its ord is < 256
        # it probably was preserved as a Latin1/control character by the editor
        if ord(c) < 256:
            out.append(ord(c))
        else:
            # If it cannot map and is > 255, it's something the editor added or replaced.
            # We'll just append it as is, or skip? We shouldn't skip, it will break UTF-8.
            # Let's hope it's <256
            out += c.encode('utf-8')

try:
    fixed_text = out.decode('utf-8')
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(fixed_text)
    print("Encoding fixed successfully.")
except Exception as e:
    print(f"Error decoding out bytes to utf-8: {e}")
