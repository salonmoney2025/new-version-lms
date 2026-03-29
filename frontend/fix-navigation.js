const fs = require('fs');
const path = require('path');

const pagesToFix = [
  'app/(academic)/courses/page.tsx',
  'app/(academic)/courses/rollover/page.tsx',
  'app/(academic)/departments/manage/page.tsx',
  'app/(academic)/examinations/page.tsx',
  'app/(academic)/faculties/manage/page.tsx',
  'app/(academic)/programs/manage/page.tsx',
  'app/(administrative)/hr-management/page.tsx',
  'app/(administrative)/staff/dashboard/page.tsx',
  'app/(administrative)/staff-id-cards/page.tsx',
  'app/(administrative)/student-id-cards/page.tsx',
  'app/(administrative)/user-management/page.tsx',
  'app/(dashboard)/student-portal/dashboard/page.tsx',
  'app/(financial)/finance/dashboard/page.tsx',
  'app/(financial)/receipt/payment-records/page.tsx',
  'app/(operations)/admissions/applicant-counts/detailed/page.tsx',
  'app/(operations)/admissions/applicant-counts/page.tsx',
  'app/(operations)/back-office/reset-application/page.tsx',
  'app/(operations)/help-desk/faq/page.tsx',
  'app/(operations)/help-desk/page.tsx',
  'app/(operations)/help-desk/submit/page.tsx',
  'app/(operations)/help-desk/tickets/page.tsx',
  'app/(operations)/matriculation/page.tsx',
  'app/(operations)/notifications/page.tsx',
  'app/(operations)/pins/block-pins/page.tsx',
  'app/(system)/admin-users/page.tsx',
  'app/(system)/reports/access-log/page.tsx',
  'app/(system)/reports/admin-users/page.tsx',
  'app/(system)/reports/admission/page.tsx',
  'app/(system)/reports/courses/page.tsx',
  'app/(system)/reports/departments/page.tsx',
  'app/(system)/reports/employees/page.tsx',
  'app/(system)/reports/faculties/page.tsx',
  'app/(system)/reports/fees-accounts/page.tsx',
  'app/(system)/reports/fees-payments/page.tsx',
  'app/(system)/reports/library-books/page.tsx',
  'app/(system)/reports/library-ebooks/page.tsx',
  'app/(system)/reports/module-assignments/page.tsx',
  'app/(system)/reports/online-applications/page.tsx',
  'app/(system)/reports/registered-students/page.tsx',
  'app/(system)/reports/student-fees/page.tsx',
  'app/(system)/reports/students-list/page.tsx',
  'app/(system)/reports/verify-student/page.tsx',
  'app/admin-dashboard/page.tsx'
];

function addHomeButton(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Skip if already has navigation
    if (content.includes('href="/dashboard"')) {
      console.log('SKIP:', filePath, '- already has navigation');
      return false;
    }

    // Add Home import to lucide-react if not present
    if (!content.includes('Home')) {
      const lucideImportRegex = /from\s+['"]lucide-react['"];/;
      const match = content.match(lucideImportRegex);

      if (match) {
        const importStatement = match[0];
        const newImport = importStatement.replace(/}\s*from/, ', Home } from');
        content = content.replace(importStatement, newImport);
      } else {
        // Add lucide-react import after other imports
        const firstImportEnd = content.indexOf("';") + 2;
        content = content.slice(0, firstImportEnd) + "\nimport { Home } from 'lucide-react';" + content.slice(firstImportEnd);
      }
    }

    // Add Link import if not present
    if (!content.includes("from 'next/link'") && !content.includes('from "next/link"')) {
      const lastImportIndex = content.lastIndexOf("import ");
      const lineEnd = content.indexOf("\n", lastImportIndex) + 1;
      content = content.slice(0, lineEnd) + "import Link from 'next/link';\n" + content.slice(lineEnd);
    }

    // Find the first h1 tag and add Home button after its parent div
    const h1Match = content.match(/<h1[^>]*>[\s\S]*?<\/h1>/);

    if (h1Match) {
      const h1End = content.indexOf(h1Match[0]) + h1Match[0].length;
      let closingDivIndex = content.indexOf('</div>', h1End);

      if (closingDivIndex > h1End) {
        const homeButton = `
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded flex items-center space-x-2 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>`;

        // Find the next closing div after the h1
        content = content.slice(0, closingDivIndex) + homeButton + '\n          ' + content.slice(closingDivIndex);

        fs.writeFileSync(filePath, content);
        console.log('FIXED:', filePath);
        return true;
      }
    }

    console.log('WARN:', filePath, '- could not find h1 tag');
    return false;
  } catch (error) {
    console.log('ERROR:', filePath, '-', error.message);
    return false;
  }
}

console.log('Starting to fix', pagesToFix.length, 'pages...\n');

let fixed = 0;
pagesToFix.forEach(page => {
  if (addHomeButton(page)) {
    fixed++;
  }
});

console.log('\nFixed', fixed, 'pages');
