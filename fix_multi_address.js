const fs = require('fs');
const path = require('path');

const files = [
  'c:/Users/rabot/OneDrive/Desktop/Новая компания Винница/auto-europe-site/src/app/team/page.tsx',
  'c:/Users/rabot/OneDrive/Desktop/Новая компания Винница/auto-europe-site/src/app/reviews/page.tsx',
  'c:/Users/rabot/OneDrive/Desktop/Новая компания Винница/auto-europe-site/src/app/about/page.tsx'
];

const oldAddressRegex = /160019, Вологодская область,\s*<br \/>\s*город Вологда, ул\. Старое шоссе, д\.18/g;
const newAddress = '180006, Псковская область,<br />город Псков, ул. Леона Поземского, д. 125, офис 1';

files.forEach(fullPath => {
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let newContent = content.replace(oldAddressRegex, newAddress);
        
        if (content !== newContent) {
            fs.writeFileSync(fullPath, newContent, 'utf8');
            console.log(`Updated multi-line address in ${fullPath}`);
        } else {
             console.log(`Pattern not found in ${fullPath}`);
        }
    }
});
