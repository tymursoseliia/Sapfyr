const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'rabot', 'OneDrive', 'Desktop', 'Новая компания Винница', 'auto-europe-site', 'src', 'app', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/to-orange-(\d+)/g, 'to-blue-$1');
content = content.replace(/from-orange-(\d+)/g, 'from-blue-$1');
content = content.replace(/via-orange-(\d+)/g, 'via-blue-$1');
content = content.replace(/text-orange-(\d+)/g, 'text-blue-$1');
content = content.replace(/bg-orange-(\d+)/g, 'bg-blue-$1');
content = content.replace(/border-orange-(\d+)/g, 'border-blue-$1');
content = content.replace(/to-yellow-500/g, 'to-cyan-400');

// Replace the specific orange rgba shadow
content = content.replace(/rgba\(234,88,12/g, 'rgba(59,130,246');

// There is also a hardcoded #401204 (deep red background) in line 500
content = content.replace(/#401204/g, '#040b16');

// And some red-500 classes for icons/bg
content = content.replace(/bg-red-500/g, 'bg-blue-600');
content = content.replace(/text-red-500/g, 'text-blue-600');
content = content.replace(/border-red-500/g, 'border-blue-600');
content = content.replace(/bg-red-400/g, 'bg-blue-500');
content = content.replace(/border-red-400/g, 'border-blue-500');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Replacements done in page.tsx');
