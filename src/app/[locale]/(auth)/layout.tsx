import { Check, Circle } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Link } from '@/i18n/navigation';

export default async function AuthLayout({
  children,
}: LayoutProps<'/[locale]'>) {
  const t = await getTranslations('authLayout');

  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="flex flex-col px-4 py-5 sm:px-8">
        <header className="flex items-center justify-between">
          <Link href="/" aria-label={t('homeAria')}>
            <Logo />
          </Link>
          <div className="flex items-center gap-1">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </header>
        <main className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">{children}</div>
        </main>
      </div>
      <ChallengePreview />
    </div>
  );
}

/** Decorative excerpt of a real generated challenge. */
async function ChallengePreview() {
  const t = await getTranslations('authLayout');
  const requirements = [
    { done: true, text: t('previewReq1') },
    { done: true, text: t('previewReq2') },
    { done: false, text: t('previewReq3') },
    { done: false, text: t('previewReq4') },
  ];

  return (
    <aside
      aria-hidden="true"
      className="relative hidden overflow-hidden border-l bg-muted/40 lg:flex lg:items-center lg:justify-center"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,color-mix(in_oklch,var(--primary)_18%,transparent),transparent_55%)]" />
      <div className="relative w-full max-w-md px-10">
        <p className="mb-6 text-3xl font-semibold tracking-tight text-balance">
          {t.rich('previewTitle', {
            highlight: (chunks) => <span className="text-brand">{chunks}</span>,
          })}
        </p>
        <div className="rounded-xl border bg-card shadow-sm">
          <div className="flex items-center gap-1.5 border-b px-4 py-3">
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
            <span className="ml-2 font-mono text-xs text-muted-foreground">
              ticketflow.md
            </span>
          </div>
          <div className="space-y-4 p-5">
            <div>
              <p className="font-mono text-xs text-muted-foreground">
                {t('previewMeta')}
              </p>
              <p className="mt-1 font-semibold">{t('previewName')}</p>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {t('previewRequirements')}
              </p>
              <ul className="space-y-2 text-sm">
                {requirements.map(({ done, text }) => (
                  <li key={text} className="flex items-start gap-2">
                    {done ? (
                      <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                    ) : (
                      <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className={done ? '' : 'text-muted-foreground'}>
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 font-mono text-xs">
              <span className="text-muted-foreground">
                {t('previewDeadline')}
              </span>
              <span>{t('previewDeadlineValue')}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
