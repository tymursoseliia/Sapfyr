const fs = require('fs');
const file = 'src/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace('    </section>\n}', '    </section>\n  );\n}');
content = content.replace('    </section>\r\n}', '    </section>\r\n  );\r\n}');
fs.writeFileSync(file, content, 'utf8');
console.log('Fixed missing return close.');
