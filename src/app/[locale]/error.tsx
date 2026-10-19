'use client';

import { RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

/**
 * Shown when a page fails to render (the API is down, for example). Details
 * stay in the server logs; the digest helps to find them.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('error');

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo />
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="max-w-sm text-muted-foreground">{t('description')}</p>
        {error.digest && (
          <p className="font-mono text-xs text-muted-foreground">
            {t('code')}: {error.digest}
          </p>
        )}
      </div>
      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href="/">{t('home')}</Link>
        </Button>
        <Button onClick={reset}>
          <RotateCcw />
          {t('retry')}
        </Button>
      </div>
    </main>
  );
}
