import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { asLocale } from '@/i18n/locale';
import { Link } from '@/i18n/navigation';
import { requireUser } from '@/lib/server/dal';
import { DoneStep } from './done-step';
import { EmailStep } from './email-step';
import { IntroStep } from './intro-step';
import { PhoneStep } from './phone-step';
import { Stepper } from './stepper';
import { resolveStep } from './steps';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/welcome'>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: asLocale(locale),
    namespace: 'onboarding',
  });
  return { title: t('meta') };
}

export default async function OnboardingPage({
  searchParams,
}: PageProps<'/[locale]/welcome'>) {
  const [user, query, t] = await Promise.all([
    requireUser(),
    searchParams,
    getTranslations('onboarding'),
  ]);
  const step = resolveStep(user, query.step);

  return (
    <div className="space-y-10">
      <Stepper current={step} />
      <section className="rounded-2xl border bg-card p-5 shadow-xs sm:p-8">
        {step === 'start' && <IntroStep firstName={user.firstName} />}
        {step === 'email' && <EmailStep email={user.email} />}
        {step === 'phone' && <PhoneStep />}
        {step === 'done' && <DoneStep credits={user.credits} />}
      </section>
      {(step === 'email' || step === 'phone') && (
        <p className="text-center text-sm text-muted-foreground">
          {t('laterPrompt')}{' '}
          <Link
            href="/app"
            className="font-medium text-brand underline-offset-4 hover:underline"
          >
            {t('laterLink')}
          </Link>
        </p>
      )}
    </div>
  );
}
