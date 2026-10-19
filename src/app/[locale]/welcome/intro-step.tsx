import {
  ArrowRight,
  Coins,
  FileText,
  Layers,
  RefreshCw,
  Rocket,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

export async function IntroStep({ firstName }: { firstName: string }) {
  const t = await getTranslations('onboarding.intro');
  const bold = {
    strong: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
  };

  const howItWorks = [
    { icon: Layers, title: t('howTitle1'), text: t('howText1') },
    { icon: FileText, title: t('howTitle2'), text: t('howText2') },
    { icon: Rocket, title: t('howTitle3'), text: t('howText3') },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-balance">
          {t('greeting', { name: firstName })}
        </h1>
        <p className="text-pretty text-muted-foreground">{t('lead')}</p>
      </div>

      <ol className="grid gap-3 sm:grid-cols-3">
        {howItWorks.map(({ icon: Icon, title, text }, index) => (
          <li key={title} className="rounded-xl border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="size-4.5" aria-hidden="true" />
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                0{index + 1}
              </span>
            </div>
            <p className="font-medium">{title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{text}</p>
          </li>
        ))}
      </ol>

      <div className="rounded-xl border bg-muted/50 p-4 sm:p-5">
        <p className="mb-3 font-medium">{t('creditsTitle')}</p>
        <ul className="space-y-2.5 text-sm">
          <li className="flex gap-2.5">
            <Coins
              className="mt-0.5 size-4 shrink-0 text-brand"
              aria-hidden="true"
            />
            <span>{t.rich('credits1', bold)}</span>
          </li>
          <li className="flex gap-2.5">
            <RefreshCw
              className="mt-0.5 size-4 shrink-0 text-brand"
              aria-hidden="true"
            />
            <span>{t.rich('credits2', bold)}</span>
          </li>
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          {t('telegramNote')}
        </p>
      </div>

      <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button asChild variant="ghost">
          <Link href="/app">{t('later')}</Link>
        </Button>
        <Button asChild size="lg">
          <Link href={{ pathname: '/welcome', query: { step: 'email' } }}>
            {t('start')}
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
