import { Info } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { asLocale } from '@/i18n/locale';
import { localizedPath } from '@/i18n/paths';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { safeRedirectPath } from '@/lib/redirect';
import { LoginForm } from './login-form';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/login'>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: asLocale(locale),
    namespace: 'auth',
  });
  return { title: t('loginMeta') };
}

export default async function LoginPage({
  params,
  searchParams,
}: PageProps<'/[locale]/login'>) {
  const [{ locale }, query, t] = await Promise.all([
    params,
    searchParams,
    getTranslations('auth.login'),
  ]);
  // Without ?next= the user lands on the home of the app in this language.
  const next = safeRedirectPath(
    query.next,
    localizedPath('/app', asLocale(locale)),
  );
  const expired = query.session === 'expired';

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
      <p className="mt-1 mb-8 text-sm text-muted-foreground">{t('subtitle')}</p>
      {expired && (
        <Alert className="mb-5">
          <Info />
          <AlertDescription>{t('expired')}</AlertDescription>
        </Alert>
      )}
      <LoginForm next={next} />
    </>
  );
}
