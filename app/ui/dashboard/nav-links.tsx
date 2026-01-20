'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Pre-Orders',
    href: '/dashboard/pre-orders',
    icon: DocumentDuplicateIcon,
  },
  { 
    name: 'Work Units', 
    href: '/dashboard/work-units', 
    icon: WrenchScrewdriverIcon 
  },
  { 
    name: 'Attendance', 
    href: '/dashboard/attendance', 
    icon: ClipboardDocumentCheckIcon 
  },
  { name: 'Users', href: '/dashboard/users', icon: UserGroupIcon },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href;
        
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-lg p-3 text-sm font-medium transition-colors md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-indigo-50 text-indigo-600': isActive,
                'text-slate-600 hover:bg-slate-50 hover:text-indigo-600': !isActive,
              },
            )}
          >
            <LinkIcon className="w-5" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}