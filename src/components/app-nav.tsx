'use client';

import {
  Coins,
  FileText,
  House,
  type LucideIcon,
  Sparkles,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import type { AppPathname } from '@/i18n/routing';
import { cn } from '@/lib/utils';

type NavPath = Extract<
  AppPathname,
  '/app' | '/app/generate' | '/app/challenges' | '/app/credits'
>;

interface NavItem {
  href: NavPath;
  /** Keys of the `nav` messages. */
  label: 'home' | 'generate' | 'challenges' | 'credits';
  /** Label in the mobile tab bar. */
  shortLabel:
    'homeShort' | 'generateShort' | 'challengesShort' | 'creditsShort';
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/app', label: 'home', shortLabel: 'homeShort', icon: House },
  {
    href: '/app/generate',
    label: 'generate',
    shortLabel: 'generateShort',
    icon: Sparkles,
  },
  {
    href: '/app/challenges',
    label: 'challenges',
    shortLabel: 'challengesShort',
    icon: FileText,
  },
  {
    href: '/app/credits',
    label: 'credits',
    shortLabel: 'creditsShort',
    icon: Coins,
  },
];

/** `usePathname` answers with the canonical page name, whatever the language. */
function useIsActive() {
  const pathname = usePathname();
  return (href: NavPath) =>
    href === '/app'
      ? pathname === '/app'
      : pathname === href || pathname.startsWith(`${href}/`);
}

/** Links in the header, from the md breakpoint up. */
export function DesktopNav() {
  const t = useTranslations('nav');
  const isActive = useIsActive();

  return (
    <nav
      aria-label={t('ariaMain')}
      className="hidden items-center gap-1 md:flex"
    >
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
          {t(label)}
        </Link>
      ))}
    </nav>
  );
}

/** Tab bar fixed at the bottom on phones. */
export function MobileNav() {
  const t = useTranslations('nav');
  const isActive = useIsActive();

  return (
    <nav
      aria-label={t('ariaMain')}
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="grid grid-cols-4">
        {NAV_ITEMS.map(({ href, shortLabel, icon: Icon }) => (
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
              {t(shortLabel)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
