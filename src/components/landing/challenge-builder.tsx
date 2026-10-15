'use client';

import { ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { StackIcon } from '@/components/stack-icon';
import { Button } from '@/components/ui/button';
import { LEVEL_ORDER, LEVELS } from '@/lib/levels';
import type { ChallengeLevel } from '@/lib/types/challenge';
import { cn } from '@/lib/utils';

interface Sample {
  slug: string;
  area: string;
  framework: string;
  industry: string;
  title: string;
  project: string;
  context: string;
  /** Ordered by difficulty: each level adds the next one. */
  requirements: string[];
}

const SAMPLES: Sample[] = [
  {
    slug: 'backend',
    area: 'Backend',
    framework: 'NestJS',
    industry: 'Logística',
    title: 'Rastreamento de entregas em tempo real',
    project: 'RotaViva',
    context:
      'Uma transportadora atende 1.200 ligações por dia de clientes querendo saber onde está o pedido.',
    requirements: [
      'Cadastro de entregas com status e histórico',
      'Validação de CEP e janelas de coleta',
      'Autenticação de motoristas e de lojistas',
      'Webhook para a loja quando o status mudar',
      'Fila de eventos com reprocessamento idempotente',
      'Particionamento por região e métricas de latência p99',
    ],
  },
  {
    slug: 'frontend',
    area: 'Frontend',
    framework: 'React',
    industry: 'Educação',
    title: 'Chamada digital para escolas públicas',
    project: 'ChamadaFácil',
    context:
      'Professores perdem 10 minutos de cada aula passando chamada no papel e digitando tudo no fim do mês.',
    requirements: [
      'Lista de turmas com busca e filtros',
      'Chamada com validação e confirmação',
      'Login de professores e rotas protegidas',
      'Modo offline com sincronização ao reconectar',
      'Atualização otimista e cache de consultas',
      'Orçamento de performance e acessibilidade auditada',
    ],
  },
  {
    slug: 'fullstack',
    area: 'Fullstack',
    framework: 'Next.js',
    industry: 'Saúde',
    title: 'Agendamento online para clínicas',
    project: 'AgendaClin',
    context:
      'Uma clínica com 14 profissionais perde 1 em cada 5 consultas porque o paciente esquece o horário.',
    requirements: [
      'Agenda por profissional com horários livres',
      'Regras de antecedência e de cancelamento',
      'Contas de paciente e de recepção',
      'Lembrete por email 24 horas antes',
      'Reserva com bloqueio contra horário duplo',
      'Várias clínicas com dados isolados e auditoria',
    ],
  },
  {
    slug: 'mobile',
    area: 'Mobile',
    framework: 'Flutter',
    industry: 'Varejo',
    title: 'Fidelidade para uma rede de padarias',
    project: 'PãoPonto',
    context:
      'Uma rede com 9 lojas ainda usa cartão de papel carimbado e não sabe quem são os clientes fiéis.',
    requirements: [
      'Cartão de pontos com QR code',
      'Catálogo de prêmios com regras de resgate',
      'Login social e perfil do cliente',
      'Notificações push de promoções',
      'Pontos que funcionam offline e sincronizam',
      'Feature flags, rollout gradual e crash reporting',
    ],
  },
  {
    slug: 'data',
    area: 'Dados',
    framework: 'Pandas',
    industry: 'Agronegócio',
    title: 'Previsão de safra para cooperativas',
    project: 'SafraCerta',
    context:
      'Uma cooperativa planeja a armazenagem com planilhas de 6 safras que ninguém consegue comparar.',
    requirements: [
      'Limpeza e padronização das planilhas de colheita',
      'Análise exploratória por região e cultura',
      'Pipeline reproduzível com testes de dados',
      'Integração com uma API de clima',
      'Modelo de previsão com validação temporal',
      'Monitoramento de drift e retreino agendado',
    ],
  },
];

const REQUIREMENTS_PER_LEVEL: Record<ChallengeLevel, number> = {
  INTERN: 3,
  JUNIOR: 4,
  MID: 5,
  SENIOR: 6,
};

/** Landing demo: pick an area and a level and watch the scope change. */
export function ChallengeBuilder() {
  const [slug, setSlug] = useState(SAMPLES[0].slug);
  const [level, setLevel] = useState<ChallengeLevel>('JUNIOR');

  const sample = SAMPLES.find((item) => item.slug === slug) ?? SAMPLES[0];
  const levelIndex = LEVEL_ORDER.indexOf(level);
  const requirements = sample.requirements.slice(
    0,
    REQUIREMENTS_PER_LEVEL[level],
  );

  return (
    <div className="grid gap-4 rounded-[2rem] border bg-card p-3 sm:p-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="flex flex-col gap-8 p-3 sm:p-5">
        <fieldset>
          <legend className="mb-3 text-sm font-medium">Área</legend>
          <div className="flex flex-wrap gap-2">
            {SAMPLES.map((item) => (
              <label
                key={item.slug}
                className={cn(
                  'inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all',
                  'hover:border-primary/60 has-focus-visible:ring-3 has-focus-visible:ring-ring/50',
                  'has-checked:border-espresso has-checked:bg-espresso has-checked:text-espresso-foreground dark:has-checked:border-primary dark:has-checked:bg-primary dark:has-checked:text-primary-foreground',
                )}
              >
                <input
                  type="radio"
                  name="builder-area"
                  value={item.slug}
                  checked={slug === item.slug}
                  onChange={() => setSlug(item.slug)}
                  className="sr-only"
                />
                <StackIcon slug={item.slug} className="size-4" />
                {item.area}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-sm font-medium">Nível</legend>
          <div className="grid grid-cols-4 gap-1.5">
            {LEVEL_ORDER.map((value, index) => (
              <label
                key={value}
                className="group cursor-pointer has-focus-visible:[&>span:first-of-type]:ring-3 has-focus-visible:[&>span:first-of-type]:ring-ring/50"
              >
                <input
                  type="radio"
                  name="builder-level"
                  value={value}
                  checked={level === value}
                  onChange={() => setLevel(value)}
                  className="sr-only"
                />
                <span
                  className={cn(
                    'block h-2 rounded-full transition-colors duration-300',
                    index <= levelIndex
                      ? 'bg-primary'
                      : 'bg-muted group-hover:bg-primary/30',
                  )}
                />
                <span
                  className={cn(
                    'mt-2 block text-xs transition-colors sm:text-sm',
                    index === levelIndex
                      ? 'font-semibold text-foreground'
                      : 'text-muted-foreground',
                  )}
                >
                  {LEVELS[value].label}
                </span>
              </label>
            ))}
          </div>
          <p className="mt-4 text-sm text-pretty text-muted-foreground">
            {LEVELS[level].description}
          </p>
        </fieldset>

        <div className="mt-auto hidden lg:block">
          <Button asChild size="xl">
            <Link href="/cadastro">
              Gerar o meu de verdade
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[1.5rem] bg-cream p-5 sm:p-8">
        <div className="absolute inset-0 bg-graph [mask-image:linear-gradient(to_bottom,#000,transparent)] opacity-60" />
        <article
          key={sample.slug}
          aria-live="polite"
          className="relative rise rounded-2xl border bg-background p-5 shadow-sm sm:p-6"
        >
          <p className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
            {sample.industry} · {LEVELS[level].label} · {sample.framework}
          </p>
          <h3 className="mt-2 text-xl leading-snug font-semibold tracking-tight">
            {sample.title}
          </h3>
          <p className="font-mono text-sm text-brand">{sample.project}</p>
          <p className="mt-3 text-sm text-pretty text-muted-foreground">
            {sample.context}
          </p>

          <p className="mt-5 mb-2.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Requisitos funcionais
          </p>
          <ul className="space-y-2 text-sm">
            {requirements.map((text) => (
              <li key={text} className="flex rise items-start gap-2.5">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                {text}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center gap-3 border-t pt-4 text-sm">
            <Clock className="size-4 shrink-0 text-brand" aria-hidden="true" />
            <span className="font-medium">{LEVELS[level].deadline}</span>
            <span className="ml-auto h-1.5 w-24 overflow-hidden rounded-full bg-muted">
              <span
                className="block h-full rounded-full bg-primary transition-[width] duration-500 ease-(--ease-out)"
                style={{ width: `${((levelIndex + 1) / 4) * 100}%` }}
              />
            </span>
          </div>
        </article>
        <p className="relative mt-4 text-center text-xs text-muted-foreground">
          Exemplo ilustrativo. O seu desafio é gerado na hora e é único.
        </p>
      </div>

      <Button asChild size="xl" className="m-3 mt-0 lg:hidden">
        <Link href="/cadastro">
          Gerar o meu de verdade
          <ArrowRight data-icon="inline-end" />
        </Link>
      </Button>
    </div>
  );
}
