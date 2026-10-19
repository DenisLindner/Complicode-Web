import { getTranslations } from 'next-intl/server';
import { Logo } from '@/components/logo';
import { Link } from '@/i18n/navigation';

export async function SiteFooter() {
  const t = await getTranslations('footer');

  const columns = [
    {
      title: t('product'),
      links: [
        {
          href: { pathname: '/', hash: 'how-it-works' },
          label: t('howItWorks'),
        },
        { href: '/explore', label: t('explore') },
        { href: { pathname: '/', hash: 'pricing' }, label: t('pricing') },
        { href: { pathname: '/', hash: 'faq' }, label: t('faq') },
      ],
    },
    {
      title: t('account'),
      links: [
        { href: '/signup', label: t('signup') },
        { href: '/login', label: t('login') },
      ],
    },
  ] as const;

  return (
    <footer className="overflow-hidden border-t">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 pt-14 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] sm:px-6">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            {t('tagline')}
          </p>
        </div>
        {columns.map(({ title, links }) => (
          <nav key={title} aria-label={title} className="space-y-3 text-sm">
            <p className="font-medium">{title}</p>
            <ul className="space-y-2">
              {links.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="mx-auto w-full max-w-6xl px-4 pt-10 text-xs text-muted-foreground sm:px-6">
        © Complicode
      </div>
      <p
        aria-hidden="true"
        className="mx-auto -mb-[0.22em] max-w-6xl px-2 pt-4 text-center font-heading text-[clamp(4rem,17vw,13.5rem)] leading-none font-bold tracking-[-0.06em] text-foreground/[0.06] select-none"
      >
        complicode
      </p>
    </footer>
  );
}
