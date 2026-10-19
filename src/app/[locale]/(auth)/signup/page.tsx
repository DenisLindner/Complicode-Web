import { Gift } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { asLocale } from '@/i18n/locale';
import { RegisterForm } from './register-form';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/signup'>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: asLocale(locale),
    namespace: 'auth',
  });
  return { title: t('signupMeta') };
}

export default async function RegisterPage() {
  const t = await getTranslations('auth.signup');

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">{t('subtitle')}</p>
      <div className="mb-6 flex items-start gap-3 rounded-lg border border-primary/30 bg-accent px-3 py-2.5 text-sm text-accent-foreground">
        <Gift className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <p>
          {t.rich('bonus', { strong: (chunks) => <strong>{chunks}</strong> })}
        </p>
      </div>
      <RegisterForm />
    </>
  );
}
