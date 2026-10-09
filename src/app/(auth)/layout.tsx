import { Check, Circle } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';

export default function AuthLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="flex flex-col px-4 py-5 sm:px-8">
        <header className="flex items-center justify-between">
          <Link href="/" aria-label="Complicode, página inicial">
            <Logo />
          </Link>
          <ThemeToggle />
        </header>
        <main className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">{children}</div>
        </main>
      </div>
      <ChallengePreview />
    </div>
  );
}

const REQUIREMENTS = [
  { done: true, text: 'Reserva temporária de ingresso por 10 minutos' },
  { done: true, text: 'Controle de concorrência com locking otimista' },
  { done: false, text: 'Liberação automática de reservas expiradas' },
  { done: false, text: 'Checkout com gateway de pagamento simulado' },
];

/** Decorative excerpt of a real generated challenge. */
function ChallengePreview() {
  return (
    <aside
      aria-hidden="true"
      className="relative hidden overflow-hidden border-l bg-muted/40 lg:flex lg:items-center lg:justify-center"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,color-mix(in_oklch,var(--primary)_18%,transparent),transparent_55%)]" />
      <div className="relative w-full max-w-md px-10">
        <p className="mb-6 text-3xl font-semibold tracking-tight text-balance">
          Desafios técnicos que parecem{' '}
          <span className="text-brand">trabalho de verdade</span>.
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
                Eventos · Júnior · Spring Boot
              </p>
              <p className="mt-1 font-semibold">
                Sistema de Reserva e Venda de Ingressos de Alta Demanda
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Requisitos funcionais
              </p>
              <ul className="space-y-2 text-sm">
                {REQUIREMENTS.map(({ done, text }) => (
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
              <span className="text-muted-foreground">prazo</span>
              <span>1 a 2 semanas</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
