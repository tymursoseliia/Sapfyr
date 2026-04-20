const fs = require('fs');
const path = require('path');

const projectDir = path.join('c:', 'Users', 'rabot', 'OneDrive', 'Desktop', 'Новая компания Винница', 'auto-europe-site', 'src', 'app');
const filesToUpdate = ['page.tsx', 'about/page.tsx', 'reviews/page.tsx', 'team/page.tsx'];

// Define replacements
const replacements = [
    { old: /ИНН 3525313619/gi, new: 'ИНН 7839037300' },
    { old: /ОГРН 1133525016598/gi, new: 'ОГРН 1157847180480' },
    { old: /ОГРН 11635250882*1*[238]/gi, new: 'ОГРН 1157847180480' }, // wildcard match since OGRN was likely wrong before or variable
    { old: /КПП 352501001/gi, new: 'КПП 602701001' },
    
    // Address replacements (accounting for potential format variations)
    { old: /г\. Вологда, ул\. Гагарина д\. 81 оф\. 6/gi, new: '180006, Псковская область, город Псков, ул. Леона Поземского, д. 125, офис 1' },
    { old: /г\. Вологда, ул\. Гагарина, д\. 81, оф\. 6/gi, new: '180006, Псковская область, город Псков, ул. Леона Поземского, д. 125, офис 1' },
    
    // Name replacements
    { old: /ООО "ФЛИВ-АВТО"/g, new: 'ООО "ЛТС"' },
    { old: /ООО «ФЛИВ-АВТО»/g, new: 'ООО «ЛТС»' },
    { old: /ООО "ФЛИТ-АВТО"/gi, new: 'ООО "ЛТС"' },
    { old: /ООО «ФЛИТ-АВТО»/gi, new: 'ООО «ЛТС»' },
    { old: /ФЛИТ-АВТО/g, new: 'ЛТС' },
    
    // Director replacement
    { old: /Тарханов Семен Александрович/gi, new: 'Поздняков Александр Сергеевич' },
    { old: /Тарханова Семена Александровича/gi, new: 'Позднякова Александра Сергеевича' }
];

console.log('Starting company data replace script...');

filesToUpdate.forEach(file => {
    const fullPath = path.join(projectDir, file);
    if (!fs.existsSync(fullPath)) {
        console.log(`File not found: ${fullPath}`);
        return;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    let originalContent = content;
    
    replacements.forEach(rep => {
        content = content.replace(rep.old, rep.new);
    });
    
    // Try catching any lingering "ОГРН " followed by 13 digits
    content = content.replace(/ОГРН \d{13}/g, 'ОГРН 1157847180480');
    
    if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${file}`);
    } else {
        console.log(`No changes needed in ${file} (or patterns didn't match perfectly).`);
    }
});

console.log('Done replacing company data.');
