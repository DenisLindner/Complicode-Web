'use client';

import { Check } from 'lucide-react';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

function Lines({ widths }: { widths: string[] }) {
  return (
    <span className="block space-y-1.5">
      {widths.map((width, index) => (
        <span
          key={index}
          className="block h-1.5 rounded-full bg-muted-foreground/20"
          style={{ width }}
        />
      ))}
    </span>
  );
}

const PARTS: {
  title: string;
  text: string;
  preview: ReactNode;
}[] = [
  {
    title: 'Contexto real',
    text: 'A dor de uma empresa, com números, personagens e o que está em jogo. Você sabe por que o sistema existe antes de escrever a primeira linha.',
    preview: <Lines widths={['100%', '92%', '60%']} />,
  },
  {
    title: 'Requisitos',
    text: 'Funcionais e não funcionais, com regras e limites claros. Vira um checklist que você marca conforme avança.',
    preview: (
      <span className="block space-y-1.5">
        {[true, true, false].map((done, index) => (
          <span key={index} className="flex items-center gap-2">
            <span
              className={cn(
                'flex size-3 items-center justify-center rounded-[3px] border',
                done && 'border-primary bg-primary',
              )}
            >
              {done && (
                <Check
                  strokeWidth={4}
                  className="size-2 text-primary-foreground"
                />
              )}
            </span>
            <span className="block h-1.5 flex-1 rounded-full bg-muted-foreground/20" />
          </span>
        ))}
      </span>
    ),
  },
  {
    title: 'O que usar',
    text: 'As tecnologias de cada camada e para que cada uma serve. Nada de "use o que quiser".',
    preview: (
      <span className="flex flex-wrap gap-1.5 font-mono text-[10px]">
        {['PostgreSQL', 'Redis', 'Docker', 'pytest'].map((name) => (
          <span key={name} className="rounded border bg-muted px-1.5 py-0.5">
            {name}
          </span>
        ))}
      </span>
    ),
  },
  {
    title: 'Entregas',
    text: 'O que precisa estar no repositório no fim: código, testes, documentação e como rodar.',
    preview: <Lines widths={['70%', '55%']} />,
  },
  {
    title: 'Prazo',
    text: 'Um tempo de conclusão compatível com o nível, para você treinar estimativa também.',
    preview: (
      <span className="inline-block rounded-md bg-accent px-2 py-0.5 font-mono text-[11px] text-accent-foreground">
        2 a 3 semanas
      </span>
    ),
  },
  {
    title: 'Guia de implementação',
    text: 'Modelagem, integrações, segurança e dicas, na ordem em que fazem sentido.',
    preview: (
      <span className="block space-y-1.5 font-mono text-[10px] text-muted-foreground">
        {['1.', '2.', '3.'].map((number, index) => (
          <span key={number} className="flex items-center gap-2">
            {number}
            <span
              className="block h-1.5 rounded-full bg-muted-foreground/20"
              style={{ width: `${80 - index * 15}%` }}
            />
          </span>
        ))}
      </span>
    ),
  },
  {
    title: 'Critérios de avaliação',
    text: 'O que um revisor sênior olharia no seu código. Você sabe o padrão antes de começar.',
    preview: <Lines widths={['85%', '75%']} />,
  },
  {
    title: 'Estrutura de pastas',
    text: 'Uma árvore sugerida no padrão do framework, pronta para copiar.',
    preview: (
      <span className="block font-mono text-[10px] leading-relaxed text-muted-foreground">
        app/
        <br />
        ├─ api/
        <br />
        └─ tests/
      </span>
    ),
  },
];

/**
 * Explains the eight sections of a briefing. On large screens a document
 * stays pinned and highlights the part the reader is on.
 */
export function BriefingAnatomy() {
  const [active, setActive] = useState(0);
  const steps = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(steps.current.indexOf(entry.target as HTMLLIElement));
          }
        }
      },
      // A thin band in the middle of the viewport decides the active step.
      { rootMargin: '-45% 0px -50% 0px' },
    );
    for (const step of steps.current) {
      if (step) observer.observe(step);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
      <div aria-hidden="true" className="hidden lg:block">
        <div className="sticky top-24 rounded-[1.75rem] bg-cream p-5">
          <div className="rounded-2xl border bg-background p-4 shadow-sm">
            <p className="font-mono text-[11px] text-muted-foreground">
              ticketflow.md
            </p>
            <ol className="mt-3 space-y-1.5">
              {PARTS.map(({ title, preview }, index) => (
                <li
                  key={title}
                  className={cn(
                    'rounded-xl border border-transparent px-3 py-2.5 transition-all duration-500',
                    index === active
                      ? 'border-primary/50 bg-accent/50 shadow-sm'
                      : 'opacity-45',
                  )}
                >
                  <span className="mb-2 flex items-baseline gap-2 text-xs font-semibold">
                    <span className="font-mono font-normal text-brand">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {title}
                  </span>
                  {preview}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <ol className="space-y-4 lg:space-y-0">
        {PARTS.map(({ title, text }, index) => (
          <li
            key={title}
            ref={(node) => {
              steps.current[index] = node;
            }}
            className="rounded-2xl border bg-card p-5 lg:flex lg:min-h-[34vh] lg:items-center lg:border-0 lg:bg-transparent lg:p-0"
          >
            <div className="flex items-start gap-5">
              <span
                className={cn(
                  'flex h-7 min-w-10 shrink-0 items-center justify-center rounded-full font-mono text-sm text-brand transition-colors duration-500 lg:mt-1',
                  index === active &&
                    'lg:bg-primary lg:font-semibold lg:text-primary-foreground',
                )}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3
                  className={cn(
                    'text-xl font-semibold tracking-tight transition-colors duration-500 lg:text-3xl',
                    index !== active && 'lg:text-muted-foreground',
                  )}
                >
                  {title}
                </h3>
                <p className="mt-2 max-w-md text-pretty text-muted-foreground lg:text-lg">
                  {text}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
