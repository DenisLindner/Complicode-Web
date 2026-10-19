import { getTranslations } from 'next-intl/server';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { getAccessToken, getRefreshToken } from '@/lib/server/session';

/** Header of the public pages; links to the app when there is a session. */
export async function PublicHeader() {
  const [t, accessToken, refreshToken] = await Promise.all([
    getTranslations('publicHeader'),
    getAccessToken(),
    getRefreshToken(),
  ]);
  const loggedIn = Boolean(accessToken ?? refreshToken);

  const links = [
    { href: { pathname: '/', hash: 'how-it-works' }, label: t('howItWorks') },
    { href: '/explore', label: t('examples') },
    { href: { pathname: '/', hash: 'pricing' }, label: t('pricing') },
    { href: { pathname: '/', hash: 'faq' }, label: t('faq') },
  ] as const;

  return (
    <header className="sticky top-0 z-40 header-scroll border-b bg-background/85 backdrop-blur supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label={t('homeAria')}>
          <Logo />
        </Link>
        <nav
          aria-label={t('sections')}
          className="hidden items-center gap-1 lg:flex"
        >
          {links.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>
        <nav
          aria-label={t('main')}
          className="flex items-center gap-1 sm:gap-1.5"
        >
          <Button
            asChild
            variant="ghost"
            className="hidden rounded-full sm:inline-flex lg:hidden"
          >
            <Link href="/explore">{t('explore')}</Link>
          </Button>
          <LocaleSwitcher />
          <span className="hidden sm:contents">
            <ThemeToggle />
          </span>
          {loggedIn ? (
            <Button asChild className="h-9 rounded-full px-4">
              <Link href="/app">{t('openApp')}</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" className="h-9 rounded-full">
                <Link href="/login">{t('login')}</Link>
              </Button>
              <Button asChild className="h-9 rounded-full px-4">
                <Link href="/signup">{t('signup')}</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
