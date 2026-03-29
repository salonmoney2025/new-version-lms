const fs = require('fs');
const path = require('path');

// Common lucide-react icon names
const validLucideIcons = new Set([
  'Users', 'User', 'BookOpen', 'Building2', 'CheckCircle', 'XCircle',
  'Mail', 'Phone', 'Calendar', 'Clock', 'DollarSign', 'CreditCard',
  'GraduationCap', 'Award', 'FileText', 'Download', 'Upload',
  'Search', 'Filter', 'Edit', 'Trash2', 'Plus', 'Eye', 'AlertCircle',
  'Info', 'Bell', 'Home', 'RefreshCw', 'LayoutDashboard', 'ArrowLeft',
  'ArrowRight', 'Save', 'X', 'Lock', 'Unlock', 'Send', 'Printer',
  'Settings', 'Shield', 'Key', 'Activity', 'TrendingUp', 'BarChart3',
  'Briefcase', 'Building', 'MapPin', 'Target', 'AlertTriangle',
  'Loader2', 'EyeOff', 'Hash', 'Copy', 'ArrowUpRight', 'Receipt',
  'UserPlus', 'UserCheck', 'LifeBuoy', 'Headphones', 'MessageSquare',
  'Tag', 'ArrowUpCircle', 'Zap', 'FileCheck', 'Ticket', 'Check',
  'CheckCheck', 'RotateCcw', 'PieChart'
]);

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

function fixMissingIcons(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Find all icon components used in JSX
  const usedIcons = new Set();
  const iconMatches = content.match(/<([A-Z][a-zA-Z0-9]*)\s/g) || [];

  iconMatches.forEach(match => {
    const iconName = match.slice(1, -1);
    if (validLucideIcons.has(iconName)) {
      usedIcons.add(iconName);
    }
  });

  if (usedIcons.size === 0) return false;

  // Find lucide-react import
  const lucideImportMatch = content.match(/import\s*{([^}]+)}\s*from\s+['"]lucide-react['"]/);

  if (!lucideImportMatch) {
    // No lucide-react import, skip this file
    return false;
  }

  const existingImports = new Set();
  const imports = lucideImportMatch[1].split(',').map(s => s.trim()).filter(s => s.length > 0);
  imports.forEach(imp => existingImports.add(imp));

  const missingIcons = Array.from(usedIcons).filter(icon => !existingImports.has(icon));

  if (missingIcons.length === 0) return false;

  console.log('FIXING:', filePath);
  console.log('  Adding:', missingIcons.join(', '));

  // Add missing icons to the import
  const allImports = [...imports, ...missingIcons].sort();
  const newImportStatement = `import {\n  ${allImports.join(',\n  ')}\n} from 'lucide-react';`;

  content = content.replace(lucideImportMatch[0], newImportStatement);

  fs.writeFileSync(filePath, content);
  return true;
}

console.log('Fixing missing icon imports across all pages...\n');

const pages = getAllTsxFiles('./app');
let fixed = 0;

pages.forEach(page => {
  if (fixMissingIcons(page)) {
    fixed++;
  }
});

console.log(`\n✓ Fixed ${fixed} files`);
