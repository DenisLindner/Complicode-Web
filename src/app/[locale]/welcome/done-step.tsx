import { ArrowRight, Check, Coins } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

export async function DoneStep({ credits }: { credits: number }) {
  const t = await getTranslations('onboarding.done');

  return (
    <div className="space-y-8 text-center">
      <div className="relative mx-auto flex size-20 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/20 [animation-iteration-count:2]" />
        <span className="relative flex size-20 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-9" strokeWidth={2.5} aria-hidden="true" />
        </span>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="mx-auto max-w-md text-pretty text-muted-foreground">
          {t('lead')}
        </p>
      </div>

      <div className="mx-auto inline-flex items-center gap-3 rounded-xl border bg-card px-5 py-4">
        <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Coins className="size-5" aria-hidden="true" />
        </span>
        <div className="text-left">
          <p className="font-mono text-2xl font-semibold tabular-nums">
            {credits}
          </p>
          <p className="text-xs text-muted-foreground">
            {t('available', { count: credits })}
          </p>
        </div>
      </div>

      <div className="flex flex-col-reverse items-stretch justify-center gap-3 sm:flex-row sm:items-center">
        <Button asChild variant="ghost">
          <Link href="/app">{t('home')}</Link>
        </Button>
        <Button asChild size="lg">
          <Link href="/app/generate">
            {t('generate')}
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
