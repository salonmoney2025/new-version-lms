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

function checkMissingIcons(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Find all icon components used in JSX (capitalized components from lucide-react)
  const usedIcons = new Set();
  const iconMatches = content.match(/<([A-Z][a-zA-Z0-9]*)\s/g) || [];

  iconMatches.forEach(match => {
    const iconName = match.slice(1, -1); // Remove < and space
    // Filter out common React components that aren't icons
    if (!['Link', 'DashboardLayout', 'ExportMenu'].includes(iconName)) {
      usedIcons.add(iconName);
    }
  });

  // Find lucide-react imports
  const lucideImportMatch = content.match(/import\s*{([^}]+)}\s*from\s+['"]lucide-react['"]/);

  if (!lucideImportMatch && usedIcons.size > 0) {
    return {
      file: filePath,
      missing: Array.from(usedIcons),
      hasLucideImport: false
    };
  }

  if (lucideImportMatch) {
    const importedIcons = new Set();
    const imports = lucideImportMatch[1].split(',').map(s => s.trim());
    imports.forEach(imp => importedIcons.add(imp));

    const missing = Array.from(usedIcons).filter(icon => !importedIcons.has(icon));

    if (missing.length > 0) {
      return {
        file: filePath,
        missing,
        hasLucideImport: true,
        currentImports: Array.from(importedIcons)
      };
    }
  }

  return null;
}

console.log('Checking for missing icon imports...\n');

const pages = getAllTsxFiles('./app');
const issues = [];

pages.forEach(page => {
  const result = checkMissingIcons(page);
  if (result) {
    issues.push(result);
  }
});

if (issues.length === 0) {
  console.log('✓ No missing icon imports found!');
} else {
  console.log(`Found ${issues.length} file(s) with missing icon imports:\n`);

  issues.forEach(issue => {
    console.log(`FILE: ${issue.file}`);
    console.log(`  Missing icons: ${issue.missing.join(', ')}`);
    if (issue.hasLucideImport) {
      console.log(`  Current imports: ${issue.currentImports.join(', ')}`);
    } else {
      console.log('  No lucide-react import found!');
    }
    console.log('');
  });
}

// Save detailed report
fs.writeFileSync('missing-icons-report.json', JSON.stringify(issues, null, 2));
console.log('\nDetailed report saved to missing-icons-report.json');
