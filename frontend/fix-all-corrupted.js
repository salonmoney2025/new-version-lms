const fs = require('fs');
const path = require('path');

// List of files that might have corrupted imports
const filesToCheck = [
  'app/(system)/reports/registered-students/page.tsx',
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
  'app/(system)/reports/student-fees/page.tsx',
  'app/(system)/reports/students-list/page.tsx',
  'app/(system)/reports/verify-student/page.tsx'
];

function fixFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf-8');

    // Check if file has corrupted import
    if (!content.includes('import { import Link from')) {
      return false;
    }

    console.log('Fixing:', filePath);

    // Split into lines
    const lines = content.split('\n');

    // Find where the corrupted import starts and the interface begins
    let interfaceIndex = -1;
    let corruptedStartIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('import { import Link from')) {
        corruptedStartIndex = i;
      }
      if (lines[i].includes('interface ') && lines[i].includes('{')) {
        interfaceIndex = i;
        break;
      }
    }

    if (interfaceIndex === -1 || corruptedStartIndex === -1) {
      console.log('  Could not find markers');
      return false;
    }

    // Standard correct imports
    const correctImports = [
      "'use client';",
      "",
      "import { useState } from 'react';",
      "import DashboardLayout from '@/components/layout/DashboardLayout';",
      "import ExportMenu from '@/components/export/ExportMenu';",
      "import {",
      "  Search,",
      "  Filter,",
      "  Download,",
      "  RefreshCw,",
      "  Eye,",
      "  Calendar,",
      "  TrendingUp,",
      "  Home",
      "} from 'lucide-react';",
      "import Link from 'next/link';",
      ""
    ];

    // Rebuild the file
    const newContent = correctImports.join('\n') + lines.slice(interfaceIndex).join('\n');

    fs.writeFileSync(filePath, newContent);
    console.log('  ✓ Fixed');
    return true;
  } catch (error) {
    console.log('  ✗ Error:', error.message);
    return false;
  }
}

console.log('Checking and fixing corrupted imports...\n');

let fixed = 0;
filesToCheck.forEach(file => {
  if (fixFile(file)) {
    fixed++;
  }
});

console.log('\nFixed', fixed, 'files');
