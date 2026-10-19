import { ArrowRight, Coins, Gift } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { DesktopNav, MobileNav } from '@/components/app-nav';
import { CommandMenu } from '@/components/command-menu';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserMenu } from '@/components/user-menu';
import { Link } from '@/i18n/navigation';
import { getStacks } from '@/lib/server/challenges';
import { requireUser } from '@/lib/server/dal';

export default async function AppLayout({
  children,
}: LayoutProps<'/[locale]/app'>) {
  const [user, stacks, t] = await Promise.all([
    requireUser(),
    getStacks().catch(() => []),
    getTranslations('appLayout'),
  ]);

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-backdrop-filter:bg-background/70">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/app" aria-label={t('homeAria')}>
              <Logo />
            </Link>
            <DesktopNav />
          </div>
          <div className="flex items-center gap-1.5">
            <CommandMenu
              stacks={stacks.map(({ slug, name }) => ({ slug, name }))}
            />
            <Link
              href="/app/credits"
              className="mr-1 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-xs transition-colors hover:border-primary/50"
              title={t('creditsTitle')}
            >
              <Coins className="size-3.5 text-brand" aria-hidden="true" />
              {user.credits}
              <span className="sr-only">{t('creditsSr')}</span>
            </Link>
            <LocaleSwitcher />
            <ThemeToggle />
            <UserMenu name={user.name} email={user.email} />
          </div>
        </div>
      </header>
      {!user.verified && (
        <VerifyBanner message={t('verifyBanner')} action={t('verifyLink')} />
      )}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-8 pb-28 sm:px-6 md:pb-12">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}

function VerifyBanner({
  message,
  action,
}: {
  message: string;
  action: string;
}) {
  return (
    <div className="border-b bg-accent text-accent-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-2.5 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="flex items-center gap-2">
          <Gift className="size-4 shrink-0" aria-hidden="true" />
          {message}
        </p>
        <Link
          href="/welcome"
          className="inline-flex items-center gap-1 font-medium underline-offset-4 hover:underline"
        >
          {action}
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
