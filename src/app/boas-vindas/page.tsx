import type { Metadata } from 'next';
import Link from 'next/link';
import { requireUser } from '@/lib/server/dal';
import { DoneStep } from './done-step';
import { EmailStep } from './email-step';
import { IntroStep } from './intro-step';
import { PhoneStep } from './phone-step';
import { Stepper } from './stepper';
import { resolveStep } from './steps';

export const metadata: Metadata = { title: 'Boas-vindas' };

export default async function OnboardingPage({
  searchParams,
}: PageProps<'/boas-vindas'>) {
  const user = await requireUser();
  const step = resolveStep(user, (await searchParams).etapa);

  return (
    <div className="space-y-10">
      <Stepper current={step} />
      <section className="rounded-2xl border bg-card p-5 shadow-xs sm:p-8">
        {step === 'inicio' && <IntroStep firstName={user.firstName} />}
        {step === 'email' && <EmailStep email={user.email} />}
        {step === 'telefone' && <PhoneStep />}
        {step === 'pronto' && <DoneStep credits={user.credits} />}
      </section>
      {(step === 'email' || step === 'telefone') && (
        <p className="text-center text-sm text-muted-foreground">
          Prefere terminar depois?{' '}
          <Link
            href="/app"
            className="font-medium text-brand underline-offset-4 hover:underline"
          >
            Ir para o início
          </Link>
        </p>
      )}
    </div>
  );
}
