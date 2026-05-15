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

// Define replacements
const replacements = [
    // Old address found in the wild from local server check
    { old: /160019, город Вологда, ул\. Старое шоссе, д\.18/gi, new: '180006, Псковская область, город Псков, ул. Леона Поземского, д. 125, офис 1' },
    
    // Brand name replacements
    { old: /ОРЕОН/g, new: 'ЛТС' },
    { old: /Ореон/g, new: 'Лтс' },
    { old: /oreon/gi, new: 'lts' }, // For URLs, links, or specific metadata
    
    // A specific fix for the api template message
    { old: /ЛТСAuto/g, new: 'LTSAuto' }, 
];

console.log('Starting secondary company data replace script (Brand & Address)...');

allFiles.forEach(fullPath => {
    let content = fs.readFileSync(fullPath, 'utf8');
    let originalContent = content;
    
    replacements.forEach(rep => {
        content = content.replace(rep.old, rep.new);
    });
    
    if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
    }
});

console.log('Done replacing secondary company data.');
