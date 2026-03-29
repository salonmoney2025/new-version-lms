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

function checkNavigation(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  const hasHomeButton = content.includes('href="/dashboard"');
  const hasBackButton = content.includes('Back') || content.includes('ChevronLeft');
  const hasNavigation = hasHomeButton || hasBackButton;
  
  return {
    path: filePath,
    hasHomeButton,
    hasBackButton,
    hasNavigation
  };
}

const pages = getAllTsxFiles('./app');
const results = pages.map(checkNavigation);

console.log('Total pages:', results.length);

const missingNav = results.filter(r => !r.hasNavigation);
console.log('Pages missing navigation:', missingNav.length);

if (missingNav.length > 0) {
  console.log('\nPages that need Home/Back buttons:');
  missingNav.forEach(page => {
    console.log('  -', page.path);
  });
}
