const fs = require('fs');
const path = require('path');

const projectDir = path.join('c:', 'Users', 'rabot', 'OneDrive', 'Desktop', 'Новая компания Винница', 'auto-europe-site', 'src', 'app');

function getAllFiles(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

const allFiles = getAllFiles(projectDir).filter(file => file.endsWith('.tsx') || file.endsWith('.ts'));

// The old number is +7 (817) 226-34-35 (Vologda area code 817)
// We will replace it with +7 (811) 200-00-00 (Pskov area code is 811 or 8112)
// Also updating links tel:+78172263435 -> tel:+78112000000

const replacements = [
    { old: /\+7 \(817\) 226-34-35/g, new: '+7 (811) 200-00-00' },
    { old: /tel:\+78172263435/g, new: 'tel:+78112000000' }
];

console.log('Starting phone number replacement script...');

allFiles.forEach(fullPath => {
    let content = fs.readFileSync(fullPath, 'utf8');
    let originalContent = content;
    
    replacements.forEach(rep => {
        content = content.replace(rep.old, rep.new);
    });
    
    if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated phone number in ${fullPath}`);
    }
});

console.log('Done replacing phone numbers.');
