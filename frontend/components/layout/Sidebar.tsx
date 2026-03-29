'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Settings,
  Users,
  User,
  Building2,
  CreditCard,
  Receipt,
  Key,
  FileText,
  HelpCircle,
  Mail,
  GraduationCap,
  Briefcase,
  BadgeCheck,
  IdCard,
  Bell,
  Gift,
  RefreshCw,
  Folders,
  BookOpen,
  Library,
  Vote,
  Calculator,
  FileBarChart,
  ChevronDown,
  ChevronRight,
  Plus,
  Eye,
  Edit,
  Clipboard,
  UserPlus,
  UserCog,
  Home,
  TrendingUp,
  List,
  Trash2,
  UserX,
  CheckCircle,
  FileCheck,
  BookCheck,
  FilePenLine,
  ClipboardList,
  FileSignature,
  HandshakeIcon,
} from 'lucide-react';

interface SubMenuItem {
  name: string;
  href: string;
  icon?: React.ElementType;
}

interface NavItem {
  name: string;
  href?: string;
  icon: React.ElementType;
  badge?: number;
  submenu?: SubMenuItem[];
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['system-settings']);

  useEffect(() => {
    // Fetch current user
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser(data.user);
        }
      })
      .catch(console.error);
  }, []);

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuName)
        ? prev.filter(m => m !== menuName)
        : [...prev, menuName]
    );
  };

  const isExpanded = (menuName: string) => expandedMenus.includes(menuName);
  const isActive = (href: string) => pathname === href;

  const navigationItems: NavItem[] = [
    { name: 'DASHBOARD', href: '/dashboard', icon: LayoutDashboard },
    {
      name: 'SYSTEM SETTINGS',
      icon: Settings,
      submenu: [
        { name: 'Add Campus', href: '/system-settings/add-campus', icon: Plus },
        { name: 'Manage Campuses', href: '/system-settings/manage-campuses', icon: Eye },
        { name: 'Manage Signatures', href: '/system-settings/manage-signatures', icon: Edit },
        { name: 'Manage Faculties', href: '/system-settings/manage-faculties', icon: Eye },
        { name: 'Manage Departments', href: '/system-settings/manage-departments', icon: Edit },
        { name: 'Add Course', href: '/system-settings/add-course', icon: Plus },
        { name: 'Course Rollover', href: '/system-settings/course-rollover', icon: RefreshCw },
        { name: 'SMS Templates', href: '/system-settings/sms-templates', icon: Mail },
      ],
    },
    {
      name: 'SYSTEM ADMINS',
      icon: Users,
      submenu: [
        { name: 'Add User', href: '/system-admins/add-user', icon: Plus },
        { name: 'Manage Users', href: '/system-admins/manage-users', icon: Users },
        { name: 'Reset User Password', href: '/system-admins/reset-password', icon: Key },
      ],
    },
    {
      name: 'BANKS',
      icon: Building2,
      submenu: [
        { name: 'Manage Bank Names', href: '/banks/manage-names', icon: Eye },
        { name: 'Add Bank', href: '/banks/add-bank', icon: Plus },
        { name: 'Manage Banks', href: '/banks/manage-banks', icon: Building2 },
      ],
    },
    {
      name: 'RECEIPT',
      icon: Receipt,
      submenu: [
        { name: 'Generate Receipt', href: '/receipt/generate', icon: Plus },
        { name: 'Payment Records', href: '/receipt/payment-records', icon: CreditCard },
        { name: 'Verify Payment', href: '/receipt/verify', icon: CheckCircle },
        { name: 'Receipt Reports', href: '/receipt/reports', icon: FileBarChart },
      ],
    },
    {
      name: 'APPLICATIONS',
      icon: FileText,
      submenu: [
        { name: 'Application Pins', href: '/applications/pins', icon: Key },
        { name: 'Applicant Counts', href: '/applications/counts', icon: ClipboardList },
        { name: 'Verified Applications', href: '/applications/verified', icon: CheckCircle },
        { name: 'View All Applications', href: '/applications', icon: FileCheck },
        { name: 'Few Other Examinations', href: '/applications/examinations', icon: BookCheck },
        { name: 'Edit Application Information', href: '/applications/edit', icon: FilePenLine },
        { name: 'Online Application List', href: '/applications/list', icon: ClipboardList },
        { name: 'Set Provisional Letter', href: '/applications/provisional-letter', icon: FileSignature },
        { name: 'Accept Offer Letter', href: '/applications/offer-letter', icon: HandshakeIcon },
      ],
    },
    {
      name: 'HELP DESK',
      icon: HelpCircle,
      submenu: [
        { name: 'Submit Ticket', href: '/help-desk/submit', icon: Plus },
        { name: 'View Tickets', href: '/help-desk/tickets', icon: Eye },
        { name: 'FAQ', href: '/help-desk/faq', icon: HelpCircle },
      ],
    },
    {
      name: 'LETTERS',
      icon: Mail,
      submenu: [
        { name: 'Acceptance Letter', href: '/letters/acceptance', icon: FileSignature },
        { name: 'Offer Letter', href: '/letters/offer', icon: HandshakeIcon },
        { name: 'Provisional Letter', href: '/letters/provisional', icon: FileCheck },
        { name: 'Matriculation Letter', href: '/letters/matriculation', icon: GraduationCap },
        { name: 'Character Reference', href: '/letters/character-reference', icon: FileText },
      ],
    },
    {
      name: 'STUDENT MANAGEMENT',
      icon: GraduationCap,
      submenu: [
        { name: 'Add Student', href: '/students/add', icon: UserPlus },
        { name: 'Edit Students Info', href: '/students', icon: Edit },
        { name: 'Manage Halls', href: '/students/halls', icon: Home },
        { name: 'Student Promotions', href: '/students/promotions', icon: TrendingUp },
        { name: 'Generate Class List', href: '/students/class-list', icon: List },
        { name: 'Reset Student Password', href: '/students/reset-password', icon: Key },
        { name: 'Delete Students Info', href: '/students/delete', icon: Trash2 },
        { name: 'Add Other Students', href: '/students/add-others', icon: UserCog },
        { name: 'Reset Other Students', href: '/students/reset-others', icon: UserX },
      ],
    },
    { name: 'BACK OFFICE', href: '/back-office', icon: Briefcase },
    {
      name: 'ID CARDS',
      icon: IdCard,
      submenu: [
        { name: 'Student ID Cards', href: '/id-cards/students', icon: GraduationCap },
        { name: 'Staff ID Cards', href: '/id-cards/staff', icon: BadgeCheck },
      ],
    },
    {
      name: 'NOTIFICATIONS',
      icon: Bell,
      submenu: [
        { name: 'All Notifications', href: '/notifications', icon: Bell },
        { name: 'Notification Preferences', href: '/notifications/preferences', icon: Settings },
      ],
    },
    { name: 'STAFF BENEFIT', href: '/staff-benefit', icon: Gift },
    { name: 'MANAGE REVERSALS', href: '/manage-reversals', icon: RefreshCw },
    { name: 'HR MANAGEMENT', href: '/hr-management', icon: Users },
    { name: 'FILES MANAGEMENT', href: '/files-management', icon: Folders },
    { name: 'MATRICULATION', href: '/matriculation', icon: Clipboard },
    { name: 'EXAMINATIONS', href: '/examinations', icon: FileText },
    { name: 'GRADUATION', href: '/graduation', icon: GraduationCap },
    { name: 'BATCH TRANSFER', href: '/batch-transfer', icon: RefreshCw },
    { name: 'LIBRARY MANAGEMENT', href: '/library', icon: Library },
    { name: 'SU ELECTIONS', href: '/su-elections', icon: Vote },
    { name: 'RECONCILIATION', href: '/reconciliation', icon: Calculator },
    {
      name: 'REPORTS',
      icon: FileBarChart,
      submenu: [
        { name: 'Access Log', href: '/reports/access-log', icon: Eye },
        { name: 'View Employee List', href: '/reports/employees', icon: Users },
        { name: 'System Admin Users', href: '/reports/admin-users', icon: UserCog },
        { name: 'View Faculties', href: '/reports/faculties', icon: Building2 },
        { name: 'View Departments', href: '/reports/departments', icon: Folders },
        { name: 'View Courses', href: '/reports/courses', icon: BookOpen },
        { name: 'View Module Assignments', href: '/reports/module-assignments', icon: ClipboardList },
        { name: 'View Student List', href: '/reports/students-list', icon: GraduationCap },
        { name: 'Verify Student', href: '/reports/verify-student', icon: CheckCircle },
        { name: 'Online Applications', href: '/reports/online-applications', icon: FileText },
        { name: 'List of Fees Accounts', href: '/reports/fees-accounts', icon: CreditCard },
        { name: 'Admission Reports', href: '/reports/admission', icon: FileBarChart },
        { name: 'Fees Payment Reports', href: '/reports/fees-payments', icon: Receipt },
        { name: 'Students Fees Reports', href: '/reports/student-fees', icon: FileBarChart },
        { name: 'Fees Payments History', href: '/reports/fees-history', icon: Clipboard },
        { name: 'Applicants Fees Payments', href: '/reports/applicants-fees', icon: CreditCard },
        { name: 'Applicants Payments History', href: '/reports/applicants-history', icon: Clipboard },
        { name: 'Open Bank Payments', href: '/reports/bank-payments', icon: Building2 },
        { name: 'Other Payment Reports', href: '/reports/other-payments', icon: Receipt },
        { name: 'Pin Sales Statements', href: '/reports/pin-sales', icon: Key },
        { name: 'Business Center Reports', href: '/reports/business-center', icon: Briefcase },
        { name: 'View Registered Students', href: '/reports/registered-students', icon: GraduationCap },
        { name: 'Library Books', href: '/reports/library-books', icon: BookOpen },
        { name: 'Library eBooks', href: '/reports/library-ebooks', icon: Library },
        { name: 'Book Check In/Out', href: '/reports/book-checkin-out', icon: ClipboardList },
      ],
    },
    {
      name: 'SETTINGS',
      icon: Settings,
      submenu: [
        { name: 'Profile', href: '/settings/profile', icon: User },
        { name: 'Change Password', href: '/settings/change-password', icon: Key },
        { name: 'System Preferences', href: '/settings/preferences', icon: Settings },
      ],
    },
  ];

  return (
    <div className="w-64 bg-black flex flex-col h-screen overflow-y-auto">
      {/* Welcome Section */}
      <div className="bg-portal-teal-600 px-4 py-5 flex items-center space-x-3 shadow-lg">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md">
          <GraduationCap className="w-7 h-7 text-portal-teal-600" />
        </div>
        <div>
          <p className="text-xs font-medium text-teal-100 uppercase tracking-wide">Welcome</p>
          <p className="text-base font-bold text-white">
            {user?.name || 'ADMIN'}
          </p>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-2">
        {navigationItems.map((item) => (
          <div key={item.name}>
            {/* Main Menu Item */}
            {item.submenu ? (
              <button
                onClick={() => toggleMenu(item.name)}
                className={`w-full flex items-center justify-between px-4 py-3 text-white hover:bg-portal-dark transition-colors ${
                  isExpanded(item.name) ? 'bg-portal-dark' : ''
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">{item.name}</span>
                </div>
                {isExpanded(item.name) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            ) : (
              <Link
                href={item.href!}
                className={`flex items-center justify-between px-4 py-3 text-white hover:bg-portal-dark transition-colors ${
                  isActive(item.href!) ? 'bg-portal-dark' : ''
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">{item.name}</span>
                </div>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            )}

            {/* Submenu Items */}
            {item.submenu && isExpanded(item.name) && (
              <div className="bg-black bg-opacity-20">
                {item.submenu.map((subItem) => (
                  <Link
                    key={subItem.name}
                    href={subItem.href}
                    className={`flex items-center space-x-3 px-12 py-2.5 text-white text-sm hover:bg-black hover:bg-opacity-30 transition-colors ${
                      isActive(subItem.href) ? 'bg-black bg-opacity-40' : ''
                    }`}
                  >
                    {subItem.icon && <subItem.icon className="w-4 h-4 flex-shrink-0" />}
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis">{subItem.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
