import { useTranslations } from 'next-intl';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo />
      <div className="space-y-2">
        <p className="font-mono text-sm text-brand">404</p>
        <h1 className="text-3xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="max-w-sm text-muted-foreground">{t('description')}</p>
      </div>
      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href="/explore">{t('explore')}</Link>
        </Button>
        <Button asChild>
          <Link href="/">{t('home')}</Link>
        </Button>
      </div>
    </main>
  );
}
