const fs = require('fs');
const file = 'src/app/page.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

let newLines = [];
let skip = false;

for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    if (skip) {
        if (line.includes('function ConsultationFormSection()')) {
            skip = false;
            newLines.push(line);
        }
        continue;
    }

    if (i === 1075) { // The extra closing div
        continue;
    }

    if (line.includes('}їРёСЃС‹РІР°РµРј')) {
        skip = true;
        // Fix the previous line which was `  );` and `}` was mangled
        newLines[newLines.length - 1] = '}';
        continue;
    }

    if (line.includes('rounded-2xl overflow-hidden shadow-2xl h-full relative group">') && i < 1000) {
        newLines.push('            </h2>');
        newLines.push('          </div>');
        newLines.push('          <div className="w-full md:w-[600px] h-[500px] bg-background border border-white/10 rounded-2xl overflow-hidden shadow-2xl h-full relative group">');
        continue;
    }

    newLines.push(line);
}

fs.writeFileSync(file, newLines.join('\n'), 'utf8');
console.log('Fixed page.tsx');
