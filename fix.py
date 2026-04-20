import os

file_path = r"c:\Users\рабочий\OneDrive\Desktop\Новая компания Винница\auto-europe-site\src\app\page.tsx"
# Windows path might have rabot instead of рабочий
file_path = "src/app/page.tsx"

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.read().split('\n')

new_lines = []
skip = False
for i, line in enumerate(lines):
    if skip:
        if 'function ConsultationFormSection()' in line:
            skip = False
            new_lines.append(line)
        continue

    if i == 1075: # line 1076 in view_file, which is the extra </div>
        # skip it
        continue
        
    if '}їРёСЃС‹РІР°РµРј' in line:
        skip = True
        new_lines[-1] = '}' # Fix the previous line since it was mangled
        continue

    if 'rounded-2xl overflow-hidden shadow-2xl h-full relative group">' in line and i < 1000:
        new_lines.append('            </h2>')
        new_lines.append('          </div>')
        new_lines.append('          <div className="w-full md:w-[600px] h-[500px] bg-background border border-white/10 rounded-2xl overflow-hidden shadow-2xl h-full relative group">')
        continue

    new_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(new_lines))
print("Fix applied successfully.")
