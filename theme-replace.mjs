import fs from 'fs';
import path from 'path';

const REPLACEMENTS = {
  // Text colors
  'text-white/90': 'text-gray-800',
  'text-white/80': 'text-gray-700',
  'text-white/70': 'text-gray-600',
  'text-white/60': 'text-gray-500',
  'text-white/50': 'text-gray-500',
  'text-white/40': 'text-gray-400',
  'text-white/30': 'text-gray-400',
  'text-white/20': 'text-gray-300',
  'text-white/10': 'text-gray-200',
  'text-white/5': 'text-gray-100',
  
  // Explicitly match exactly text-white with word boundaries to avoid matching text-white/50
  '\\btext-white\\b': 'text-gray-900',

  // Background colors
  'bg-white/20': 'bg-gray-300',
  'bg-white/10': 'bg-gray-200',
  'bg-white/5': 'bg-gray-100',
  
  // Border colors
  'border-white/20': 'border-gray-300',
  'border-white/10': 'border-gray-200',
  'border-white/5': 'border-gray-100',
  
  // Specific backgrounds for inputs and panels
  'bg-black/40': 'bg-white',
  
  // Hover states
  'hover:text-white\\b': 'hover:text-gray-900',
  'hover:text-white/80': 'hover:text-gray-700',
  'hover:text-white/70': 'hover:text-gray-600',
  'group-hover:text-white\\b': 'group-hover:text-gray-900',
  'hover:bg-white/10': 'hover:bg-gray-200',
  'hover:bg-white/20': 'hover:bg-gray-300',
  
  // Placeholders
  'placeholder:text-white/30': 'placeholder:text-gray-400',
};

const DIRS_TO_SCAN = ['src/app', 'src/components'];

function processFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  // Exclude Header and Footer since we manually updated them
  if (filePath.endsWith('Header.tsx') || filePath.endsWith('Footer.tsx')) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  for (const [find, replace] of Object.entries(REPLACEMENTS)) {
    // We use a regex with global flag. For classes with '/', we need to escape it if it was a regex literal,
    // but here we are building from string. Let's make sure it's safe.
    // If 'find' doesn't start with \b, we prepend it to ensure we don't partial match, except it already has \b
    let patternStr = find;
    if (!patternStr.startsWith('\\b')) {
       // Only add boundary if it doesn't end with a slash or number... actually just a simple string replace is safer,
       // but we need to avoid replacing `text-white` inside `text-white/50`.
       // Since we are iterating object entries, if we sort by length descending, it avoids this issue without boundaries!
    }
  }

  // A safer approach: sort by length descending to replace text-white/90 before text-white
  const sortedKeys = Object.keys(REPLACEMENTS).sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    let regexPattern;
    if (key.includes('\\b')) {
      regexPattern = new RegExp(key, 'g');
    } else {
      // Escape slashes and dots if any
      const escapedKey = key.replace(/([\/])/g, '\\$1');
      // Adding word boundaries around Tailwind classes is tricky due to slashes and colons.
      // We will rely on length sorting! `text-white/90` is replaced before `text-white`.
      // For `text-white`, we already use `\btext-white\b` which handles the word boundary.
      regexPattern = new RegExp(escapedKey, 'g');
    }
    content = content.replace(regexPattern, REPLACEMENTS[key]);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function scanDir(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else {
      processFile(fullPath);
    }
  }
}

for (const dir of DIRS_TO_SCAN) {
  scanDir(dir);
}
