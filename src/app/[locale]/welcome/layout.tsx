import { getTranslations } from 'next-intl/server';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserMenu } from '@/components/user-menu';
import { Link } from '@/i18n/navigation';
import { requireUser } from '@/lib/server/dal';

export default async function OnboardingLayout({
  children,
}: LayoutProps<'/[locale]/welcome'>) {
  const [user, t] = await Promise.all([
    requireUser(),
    getTranslations('onboarding'),
  ]);

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-4 sm:px-6">
        <Link href="/app" aria-label={t('homeAria')}>
          <Logo />
        </Link>
        <div className="flex items-center gap-1.5">
          <LocaleSwitcher />
          <ThemeToggle />
          <UserMenu name={user.name} email={user.email} />
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-6 pb-16 sm:px-6 sm:pt-10">
        {children}
      </main>
    </div>
  );
}
