import { Check, Clock, Coins } from 'lucide-react';
import { LogoMark } from '@/components/logo';
import { delay } from '@/lib/motion';
import { cn } from '@/lib/utils';

const REQUIREMENTS = [
  'Importação de extratos OFX e CNAB 240',
  'Conciliação automática por valor, data e documento',
  'Regras de tolerância configuráveis por banco',
  'Fila de divergências com aprovação manual',
  'Relatório de fechamento mensal exportável',
];
// The first three get checked, one after the other, once the shot is in.
const CHECKED = 3;
const FIRST_TICK_MS = 1400;
const TICK_GAP_MS = 550;

const SECTIONS = [
  'Contexto',
  'Requisitos',
  'O que usar',
  'Entregas',
  'Prazo',
  'Guia de implementação',
  'O que será avaliado',
  'Estrutura de pastas',
];

/**
 * The challenge page as the app shows it, built from markup instead of a
 * screenshot so it follows the theme. Decorative.
 */
export function ProductShot({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative h-[440px] overflow-hidden rounded-t-[1.75rem] border border-b-0 bg-background shadow-[0_-12px_60px_-20px] shadow-primary/30 select-none sm:h-[540px]',
        className,
      )}
    >
      <div className="flex h-12 items-center justify-between gap-4 border-b px-4 sm:px-6">
        <div className="flex items-center gap-5">
          <LogoMark className="size-6" />
          <div className="hidden items-center gap-1 text-xs sm:flex">
            <span className="rounded-md px-2.5 py-1 text-muted-foreground">
              Início
            </span>
            <span className="rounded-md px-2.5 py-1 text-muted-foreground">
              Gerar desafio
            </span>
            <span className="rounded-md bg-muted px-2.5 py-1 font-medium">
              Meus desafios
            </span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-xs">
          <Coins className="size-3.5 text-brand" />8
        </span>
      </div>

      <div className="grid gap-10 px-5 pt-7 sm:px-10 sm:pt-9 lg:grid-cols-[minmax(0,1fr)_180px]">
        <div className="min-w-0 space-y-6">
          <div className="space-y-2">
            <p className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
              Serviços financeiros · Pleno · FastAPI
            </p>
            <p className="font-heading text-2xl leading-tight font-semibold tracking-tight sm:text-3xl">
              Conciliação bancária automatizada
            </p>
            <p className="font-mono text-sm text-brand">ConciliaPay</p>
            <p className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
              <Clock className="size-3.5" />2 a 3 semanas
            </p>
          </div>

          <div className="space-y-2">
            <p className="flex items-baseline gap-2 font-heading font-semibold">
              <span className="font-mono text-xs font-normal text-brand">
                01
              </span>
              Contexto
            </p>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              Uma rede de clínicas fecha o mês com 3 dias de atraso porque o
              financeiro confere 4 mil lançamentos à mão. Seu desafio é
              automatizar essa conferência.
            </p>
          </div>

          <div className="space-y-3">
            <p className="flex items-baseline gap-2 font-heading font-semibold">
              <span className="font-mono text-xs font-normal text-brand">
                02
              </span>
              Requisitos funcionais
            </p>
            <ul className="space-y-2.5 text-sm">
              {REQUIREMENTS.map((text, index) => {
                const checked = index < CHECKED;
                const tick = delay(FIRST_TICK_MS + index * TICK_GAP_MS);
                return (
                  <li key={text} className="flex items-start gap-2.5">
                    <span
                      style={tick}
                      className={cn(
                        'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-[5px] border border-input',
                        checked &&
                          'animate-[tick_0.35s_var(--ease-spring)_var(--d)_both]',
                      )}
                    >
                      {checked && (
                        <Check
                          style={tick}
                          strokeWidth={3}
                          className="size-3 pop text-primary-foreground"
                        />
                      )}
                    </span>
                    <span>{text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="hidden space-y-4 lg:block">
          <div className="space-y-1.5">
            <p className="text-xs font-medium">Progresso</p>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                style={delay(FIRST_TICK_MS)}
                className="h-full w-[38%] origin-left animate-[grow_1.8s_var(--ease-out)_var(--d)_both] rounded-full bg-primary"
              />
            </div>
            <p className="font-mono text-[11px] text-muted-foreground">
              3 de 8 requisitos
            </p>
          </div>
          <ul className="space-y-1 border-l text-xs">
            {SECTIONS.map((title, index) => (
              <li
                key={title}
                className={cn(
                  '-ml-px border-l py-1 pl-3',
                  index === 1
                    ? 'border-primary font-medium text-foreground'
                    : 'border-transparent text-muted-foreground',
                )}
              >
                {title}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background" />
    </div>
  );
}
