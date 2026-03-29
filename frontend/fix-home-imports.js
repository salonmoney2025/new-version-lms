const fs = require('fs');
const path = require('path');

function getAllTsxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllTsxFiles(filePath, fileList);
    } else if (file === 'page.tsx') {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function fixHomeImport(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Skip if doesn't have Home button
    if (!content.includes('<Home className="w-4 h-4"')) {
      return false;
    }

    // Check if Home is imported from lucide-react
    const lucideImportMatch = content.match(/import\s*{([^}]+)}\s*from\s+['"]lucide-react['"]/);

    if (lucideImportMatch) {
      const imports = lucideImportMatch[1];

      // If Home is not in the imports, add it
      if (!imports.includes('Home')) {
        const newImports = imports.trim() + ', Home';
        const newImportStatement = `import { ${newImports} } from 'lucide-react'`;
        content = content.replace(lucideImportMatch[0], newImportStatement);

        fs.writeFileSync(filePath, content);
        console.log('FIXED:', filePath);
        return true;
      }
    }

    return false;
  } catch (error) {
    console.log('ERROR:', filePath, '-', error.message);
    return false;
  }
}

const pages = getAllTsxFiles('./app');
let fixed = 0;

pages.forEach(page => {
  if (fixHomeImport(page)) {
    fixed++;
  }
});

console.log('Fixed', fixed, 'import statements');
