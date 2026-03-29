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

function checkForms(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  const hasForm = content.includes('<form') || content.includes('onSubmit');
  const hasSubmitButton = content.includes('type="submit"') || content.includes("type='submit'");
  const hasUploadButton = content.includes('type="file"') || content.includes("type='file'") || content.includes('<Upload');
  const hasButtonClickHandler = content.includes('onClick=');

  let issues = [];

  if (hasForm && !hasSubmitButton) {
    issues.push('Form without submit button');
  }

  if (hasUploadButton) {
    const hasFileInput = content.includes('type="file"') || content.includes("type='file'");
    if (!hasFileInput) {
      issues.push('Upload button without file input');
    }
  }

  // Check for buttons without handlers
  const buttonMatches = content.match(/<button[^>]*>/g) || [];
  const buttonsWithoutHandlers = buttonMatches.filter(btn =>
    !btn.includes('onClick') &&
    !btn.includes('type="submit"') &&
    !btn.includes("type='submit'") &&
    !btn.includes('disabled')
  );

  if (buttonsWithoutHandlers.length > 0) {
    issues.push(`${buttonsWithoutHandlers.length} button(s) without handlers`);
  }

  return {
    path: filePath,
    hasForm,
    hasSubmitButton,
    hasUploadButton,
    hasButtonClickHandler,
    issues
  };
}

const pages = getAllTsxFiles('./app');
const results = pages.map(checkForms);

console.log('\n=== Form and Button Check Results ===\n');
console.log('Total pages:', results.length);

const pagesWithForms = results.filter(r => r.hasForm);
console.log('Pages with forms:', pagesWithForms.length);

const pagesWithUpload = results.filter(r => r.hasUploadButton);
console.log('Pages with upload:', pagesWithUpload.length);

const pagesWithIssues = results.filter(r => r.issues.length > 0);
console.log('Pages with potential issues:', pagesWithIssues.length);

if (pagesWithIssues.length > 0) {
  console.log('\nPages with potential issues:\n');
  pagesWithIssues.forEach(page => {
    console.log('  ' + page.path);
    page.issues.forEach(issue => {
      console.log('    - ' + issue);
    });
  });
}

fs.writeFileSync('form-check-report.json', JSON.stringify(results, null, 2));
console.log('\nDetailed report saved to form-check-report.json');
