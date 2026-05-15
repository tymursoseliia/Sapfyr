import os

file_path = 'src/app/page.tsx'
with open(file_path, 'rb') as f:
    data = f.read()

print(f"File size: {len(data)} bytes")

try:
    context = data[75850:75950]
    print('Context around index 75903 (approx 50 bytes before and after):')
    print(context)
    
    print('\nDecoded as cp1251:')
    print(context.decode('cp1251', errors='replace'))
    
    print('\nDecoded as utf-8 (with replacement):')
    print(context.decode('utf-8', errors='replace'))
    
except Exception as e:
    print('Error:', e)
