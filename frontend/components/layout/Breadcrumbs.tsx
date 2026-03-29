'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs() {
  const pathname = usePathname();

  // Generate breadcrumb items from pathname
  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ name: 'Home', href: '/dashboard' }];

    let currentPath = '';
    paths.forEach((path) => {
      currentPath += `/${path}`;
      if (currentPath === '/dashboard') return;
      const name = path
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      breadcrumbs.push({ name, href: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className="flex items-center space-x-2 text-sm">
      {breadcrumbs.map((breadcrumb, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return (
          <div key={breadcrumb.href} className="flex items-center">
            {index === 0 && (
              <Home className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
            )}
            {index > 0 && (
              <ChevronRight className="w-4 h-4 mx-2 text-gray-400 dark:text-gray-600" />
            )}
            {isLast ? (
              <span className="font-medium text-gray-900 dark:text-white">
                {breadcrumb.name}
              </span>
            ) : (
              <Link
                href={breadcrumb.href}
                className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {breadcrumb.name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
