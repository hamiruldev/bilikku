'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

export function Breadcrumb() {
  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);
  const { user } = useAuth()

  if (paths.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6 flex-wrap gap-1">


      {user?.isAdmin &&
        <Link
          href="/dashboard"
          className="flex items-center hover:text-foreground transition-colors"
        >
          <HomeIcon className="w-4 h-4 mr-1" />
          <span>Home</span>
        </Link>
      }

      {user?.isAdmin == false && user?.role == "guest" &&
        <Link
          href="/bilikku"
          className="flex items-center hover:text-foreground transition-colors"
        >
          <HomeIcon className="w-4 h-4 mr-1" />
          <span>Home</span>
        </Link>
      }

      {paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join('/')}`;
        const isLast = index === paths.length - 1;
        const isAction = path === 'new' || path === 'edit';

        return (
          <div key={path} className="flex items-center">
            <ChevronRightIcon className="w-4 h-4 mx-1" />
            {isLast ? (
              <span className="capitalize">
                {isAction ? path : path.replace(/-/g, ' ')}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-foreground transition-colors capitalize"
              >
                {path.replace(/-/g, ' ')}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
} 