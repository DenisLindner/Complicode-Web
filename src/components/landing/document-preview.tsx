import { Check, Circle, Clock, FolderTree } from 'lucide-react';

const REQUIREMENTS = [
  { done: true, text: 'Conciliação automática de extratos e boletos' },
  { done: true, text: 'Regras de tolerância de valor e data por banco' },
  { done: false, text: 'Fila de divergências com aprovação manual' },
];

/** Decorative excerpt of a generated challenge for the hero. */
export function DocumentPreview() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-xl">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_30%_20%,color-mix(in_oklch,var(--primary)_28%,transparent),transparent_60%)] blur-2xl" />
      <div className="overflow-hidden rounded-2xl border bg-card shadow-xl shadow-primary/5">
        <div className="flex items-center gap-1.5 border-b bg-muted/40 px-4 py-3">
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="ml-2 font-mono text-xs text-muted-foreground">
            conciliapay.md
          </span>
        </div>
        <div className="space-y-5 p-6">
          <div className="space-y-1.5">
            <p className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
              Serviços financeiros · Pleno · FastAPI
            </p>
            <p className="text-lg leading-snug font-semibold">
              Sistema de Conciliação Bancária Automatizada
            </p>
            <p className="font-mono text-sm text-brand">ConciliaPay</p>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Uma rede de clínicas fecha o mês com 3 dias de atraso porque o
            financeiro confere 4 mil lançamentos à mão. Seu desafio é
            automatizar essa conferência…
          </p>
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
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
              <Clock className="size-3.5 text-brand" />
              <span>2 a 3 semanas</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 font-mono">
              <FolderTree className="size-3.5 text-brand" />
              <span>app/ · tests/</span>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-5 -left-4 hidden rounded-xl border bg-card px-3 py-2 text-xs shadow-lg sm:block">
        <span className="font-mono text-brand">+ 8 seções</span>
        <span className="text-muted-foreground"> · guia, avaliação…</span>
      </div>
    </div>
  );
}
