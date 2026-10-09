'use client';

import { FileText, House, type LucideIcon, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/app', label: 'Início', icon: House },
  { href: '/app/gerar', label: 'Gerar desafio', icon: Sparkles },
  { href: '/app/desafios', label: 'Meus desafios', icon: FileText },
];

function useIsActive() {
  const pathname = usePathname();
  return (href: string) =>
    href === '/app'
      ? pathname === '/app'
      : pathname === href || pathname.startsWith(`${href}/`);
}

/** Links in the header, from the md breakpoint up. */
export function DesktopNav() {
  const isActive = useIsActive();

  return (
    <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
      {NAV_ITEMS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          aria-current={isActive(href) ? 'page' : undefined}
          className={cn(
            'rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
            isActive(href) && 'bg-muted font-medium text-foreground',
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

/** Tab bar fixed at the bottom on phones. */
export function MobileNav() {
  const isActive = useIsActive();

  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="grid grid-cols-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={isActive(href) ? 'page' : undefined}
              className={cn(
                'flex flex-col items-center gap-1 py-2.5 text-[11px] text-muted-foreground',
                isActive(href) && 'font-medium text-brand',
              )}
            >
              <Icon className="size-5" aria-hidden="true" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
