const fs = require('fs');

const filePath = 'app/(system)/reports/access-log/page.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Replace the corrupted import section
const correctImports = `'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ExportMenu from '@/components/export/ExportMenu';
import {
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Clock,
  MapPin,
  Monitor,
  RefreshCw,
  Eye,
  TrendingUp,
  Activity,
  Home
} from 'lucide-react';
import Link from 'next/link';`;

// Find and replace the corrupted import section
const lines = content.split('\n');
const interfaceIndex = lines.findIndex(line => line.includes('interface AccessLogEntry'));

if (interfaceIndex > 0) {
  // Replace everything before the interface
  const newContent = correctImports + '\n\n' + lines.slice(interfaceIndex).join('\n');
  fs.writeFileSync(filePath, newContent);
  console.log('Fixed access-log page imports!');
} else {
  console.log('Could not find interface declaration');
}
