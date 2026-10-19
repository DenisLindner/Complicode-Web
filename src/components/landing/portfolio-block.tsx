import { Copy, FileDown, Link2, ListChecks } from 'lucide-react';
import { useTranslations } from 'next-intl';

const CARD =
  'reveal rounded-[1.5rem] bg-card p-6 text-card-foreground shadow-[0_24px_48px_-24px_rgb(0_0_0/0.6)] ring-1 ring-white/10';

/** Dark block: what happens after the briefing (export, share, track). */
export function PortfolioBlock() {
  const t = useTranslations('landing.portfolio');

  const readme = [
    {
      text: t('readmeTitle'),
      className: 'text-espresso-foreground font-semibold',
    },
    { text: t('readmeMeta'), className: 'text-espresso-muted' },
    { text: '', className: '' },
    { text: t('readmeContext'), className: 'text-primary' },
    { text: t('readmeCtx1'), className: 'text-espresso-muted' },
    { text: t('readmeCtx2'), className: 'text-espresso-muted' },
    { text: '', className: '' },
    { text: t('readmeRequirements'), className: 'text-primary' },
    { text: t('readmeReq1'), className: 'text-espresso-foreground' },
    { text: t('readmeReq2'), className: 'text-espresso-foreground' },
    { text: t('readmeReq3'), className: 'text-espresso-muted' },
  ];

  return (
    <section className="px-2 sm:px-4">
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-espresso px-5 py-20 text-espresso-foreground sm:px-10 lg:py-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(700px_circle_at_85%_0%,color-mix(in_oklch,var(--primary)_28%,transparent),transparent_70%)]" />
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold tracking-[-0.025em] text-balance sm:text-5xl">
              {t.rich('title', {
                accent: (chunks) => (
                  <span className="text-primary">{chunks}</span>
                ),
              })}
            </h2>
            <p className="mt-4 text-lg text-pretty text-espresso-muted">
              {t('lead')}
            </p>
          </div>

          <div className="mt-14 grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            <div className="reveal overflow-hidden rounded-[1.5rem] bg-[color-mix(in_oklch,var(--espresso),black_35%)] shadow-[0_24px_48px_-24px_rgb(0_0_0/0.7)] ring-1 ring-white/15">
              <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.04] px-5 py-3">
                <span aria-hidden="true" className="flex gap-1.5">
                  <span className="size-2.5 rounded-full bg-white/20" />
                  <span className="size-2.5 rounded-full bg-white/20" />
                  <span className="size-2.5 rounded-full bg-primary" />
                </span>
                <span className="font-mono text-xs text-espresso-muted">
                  README.md
                </span>
                <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary">
                  <FileDown className="size-3.5" aria-hidden="true" />
                  {t('exported')}
                </span>
              </div>
              <pre
                aria-label={t('readmeAria')}
                className="overflow-x-auto p-6 font-mono text-[13px] leading-relaxed"
              >
                {readme.map(({ text, className }, index) => (
                  <span key={index} className={`block ${className}`}>
                    {text || ' '}
                  </span>
                ))}
              </pre>
            </div>

            <div className="grid gap-4">
              <div className={CARD}>
                <span className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Link2 className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-xl font-semibold">{t('linkTitle')}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t('linkText')}
                </p>
                <div
                  aria-hidden="true"
                  className="mt-5 flex items-center justify-between gap-3 rounded-full border bg-muted py-1.5 pr-1.5 pl-4 font-mono text-xs"
                >
                  <span className="truncate text-muted-foreground">
                    …/c/8f3k2a
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 font-sans font-medium text-primary-foreground">
                    <Copy className="size-3" />
                    {t('linkCopy')}
                  </span>
                </div>
              </div>

              <div className={CARD}>
                <span className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <ListChecks className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-xl font-semibold">
                  {t('progressTitle')}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t('progressText')}
                </p>
                <div aria-hidden="true" className="mt-5">
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-[62%] reveal-grow rounded-full bg-primary" />
                  </div>
                  <p className="mt-2 font-mono text-xs text-muted-foreground">
                    {t('progressCount')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
