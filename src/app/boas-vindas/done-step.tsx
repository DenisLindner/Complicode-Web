import { ArrowRight, Check, Coins } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function DoneStep({ credits }: { credits: number }) {
  return (
    <div className="space-y-8 text-center">
      <div className="relative mx-auto flex size-20 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/20 [animation-iteration-count:2]" />
        <span className="relative flex size-20 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-9" strokeWidth={2.5} aria-hidden="true" />
        </span>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Tudo pronto!</h1>
        <p className="mx-auto max-w-md text-pretty text-muted-foreground">
          Email e telefone confirmados. Seus créditos de boas-vindas já estão na
          conta.
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
            {credits === 1 ? 'crédito disponível' : 'créditos disponíveis'}
          </p>
        </div>
      </div>

      <div className="flex flex-col-reverse items-stretch justify-center gap-3 sm:flex-row sm:items-center">
        <Button asChild variant="ghost">
          <Link href="/app">Ir para o início</Link>
        </Button>
        <Button asChild size="lg">
          <Link href="/app/gerar">
            Gerar meu primeiro desafio
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
