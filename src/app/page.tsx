import { ArrowRight, Check, Plus } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { ChallengeCard } from '@/components/challenge/challenge-card';
import { BriefingAnatomy } from '@/components/landing/briefing-anatomy';
import { ChallengeBuilder } from '@/components/landing/challenge-builder';
import { Hero } from '@/components/landing/hero';
import { LevelLadder } from '@/components/landing/level-ladder';
import { PortfolioBlock } from '@/components/landing/portfolio-block';
import { Scribble } from '@/components/landing/scribble';
import { StackMarquee } from '@/components/landing/stack-marquee';
import { PublicHeader } from '@/components/public-header';
import { SiteFooter } from '@/components/site-footer';
import { Button } from '@/components/ui/button';
import { listPublicChallenges } from '@/lib/server/challenges';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: {
    absolute: 'Complicode · Desafios técnicos baseados em problemas reais',
  },
};

const FAQ = [
  {
    question: 'Preciso pagar para começar?',
    answer:
      'Não. Ao confirmar seu email e seu telefone você ganha 2 créditos, o suficiente para gerar 2 desafios completos. Depois, 10 créditos custam R$ 10,00.',
  },
  {
    question: 'Por que vocês pedem meu telefone?',
    answer:
      'Para garantir uma conta por pessoa e manter os créditos grátis. A verificação é pelo Telegram, sem SMS e sem custo, e o número não é usado para mais nada.',
  },
  {
    question: 'E se eu não gostar do desafio?',
    answer:
      'Cada desafio pode ser regerado uma vez, de graça. As duas versões ficam salvas para você escolher.',
  },
  {
    question: 'Posso colocar no meu portfólio?',
    answer:
      'Pode e deve. Exporte o desafio em markdown para o README do repositório e, se quiser, deixe-o público com um link compartilhável.',
  },
  {
    question: 'Os desafios são únicos?',
    answer:
      'Sim. Cada geração parte de um cenário real da indústria e evita repetir os temas que você já recebeu.',
  },
];

const PLANS = [
  {
    name: 'Para começar',
    price: 'R$ 0',
    note: '2 créditos ao confirmar email e telefone',
    perks: [
      '2 desafios completos',
      'Regeração grátis em cada um',
      'Exportação em markdown',
    ],
    cta: 'Criar conta grátis',
    featured: false,
  },
  {
    name: 'Pacote de créditos',
    price: 'R$ 10',
    note: '10 créditos, pagamento único por PIX ou cartão',
    perks: [
      '10 desafios em qualquer stack e nível',
      'Créditos que não expiram',
      'Regeração grátis em cada desafio',
    ],
    cta: 'Começar agora',
    featured: true,
  },
];

async function loadGallery() {
  try {
    return (await listPublicChallenges(1, 6)).items;
  } catch {
    // The landing page never fails because of the gallery.
    return [];
  }
}

function SectionHeading({
  title,
  description,
  center = false,
  children,
}: {
  title: ReactNode;
  description?: string;
  center?: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        'mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
        center && 'items-center text-center sm:flex-col sm:items-center',
      )}
    >
      <div className={cn('max-w-2xl', center && 'mx-auto')}>
        <h2 className="text-4xl font-bold tracking-[-0.025em] text-balance sm:text-5xl">
          {title}
        </h2>
        {description && (
          <p className="mt-4 text-lg text-pretty text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

export default async function LandingPage() {
  const gallery = await loadGallery();

  return (
    <div className="flex min-h-dvh flex-col">
      <PublicHeader />
      <main className="flex-1">
        <Hero />
        <StackMarquee />

        <section
          id="como-funciona"
          className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 lg:py-28"
        >
          <SectionHeading
            center
            title={
              <>
                Escolha a stack e o nível.{' '}
                <span className="text-brand">O escopo vem junto.</span>
              </>
            }
            description="Teste aqui: troque a área e o nível e veja como o desafio muda. Na conta, o seu é gerado na hora e é só seu."
          />
          <ChallengeBuilder />
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:pb-28">
          <SectionHeading
            title="Tudo que um briefing de empresa tem."
            description="Oito seções, do problema que a empresa enfrenta ao que vai ser avaliado no seu código."
          />
          <BriefingAnatomy />
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:pb-28">
          <SectionHeading
            title="Do estágio ao sênior, a régua sobe junto."
            description="O nível muda o escopo, o prazo e o que se espera da sua solução."
          />
          <LevelLadder />
        </section>

        <PortfolioBlock />

        {gallery.length > 0 && (
          <section className="mx-auto w-full max-w-6xl px-4 pt-20 sm:px-6 lg:pt-28">
            <SectionHeading
              title="Gerados pela comunidade."
              description="Desafios que outros devs geraram e decidiram compartilhar."
            >
              <Link
                href="/explorar"
                className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-brand underline-offset-4 hover:underline"
              >
                Ver todos
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </SectionHeading>
            <ul className="-mx-4 no-scrollbar flex scroll-fade-x snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6">
              {gallery.map((challenge) => (
                <li
                  key={challenge.id}
                  className="w-[85%] shrink-0 snap-start sm:w-[22rem]"
                >
                  <ChallengeCard
                    challenge={challenge}
                    href={`/d/${challenge.id}`}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section
          id="precos"
          className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 lg:py-28"
        >
          <SectionHeading
            center
            title="Paga só o que usar."
            description="Sem assinatura. Um crédito, um desafio completo."
          />
          <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  'relative flex reveal flex-col overflow-hidden rounded-[1.75rem] p-8',
                  plan.featured
                    ? 'bg-espresso text-espresso-foreground'
                    : 'border bg-card',
                )}
              >
                {plan.featured && (
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(400px_circle_at_100%_0%,color-mix(in_oklch,var(--primary)_30%,transparent),transparent_70%)]" />
                )}
                <div className="relative flex flex-1 flex-col">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold">{plan.name}</h3>
                    {plan.featured && (
                      <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                        R$ 1 por desafio
                      </span>
                    )}
                  </div>
                  <p className="mt-6 font-heading text-6xl font-bold tracking-tight">
                    {plan.price}
                  </p>
                  <p
                    className={cn(
                      'mt-2 text-sm',
                      plan.featured
                        ? 'text-espresso-muted'
                        : 'text-muted-foreground',
                    )}
                  >
                    {plan.note}
                  </p>
                  <ul className="mt-8 mb-10 space-y-3 text-sm">
                    {plan.perks.map((perk) => (
                      <li key={perk} className="flex items-center gap-2.5">
                        <span
                          className={cn(
                            'flex size-5 shrink-0 items-center justify-center rounded-full',
                            plan.featured
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-accent text-accent-foreground',
                          )}
                        >
                          <Check
                            className="size-3"
                            strokeWidth={3}
                            aria-hidden="true"
                          />
                        </span>
                        {perk}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    size="xl"
                    variant={plan.featured ? 'default' : 'outline'}
                    className="mt-auto w-full"
                  >
                    <Link href="/cadastro">{plan.cta}</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="perguntas"
          className="mx-auto grid w-full max-w-6xl scroll-mt-20 gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:pb-28"
        >
          <div>
            <h2 className="text-4xl font-bold tracking-[-0.025em] text-balance sm:text-5xl">
              Perguntas frequentes.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              O que todo mundo pergunta antes de gerar o primeiro desafio.
            </p>
          </div>
          <div className="border-t">
            {FAQ.map(({ question, answer }) => (
              <details
                key={question}
                className="group details-animate border-b"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-lg font-medium transition-colors hover:text-brand [&::-webkit-details-marker]:hidden">
                  {question}
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted transition-[rotate,background-color] duration-300 group-open:rotate-45 group-open:bg-primary group-open:text-primary-foreground">
                    <Plus className="size-4" aria-hidden="true" />
                  </span>
                </summary>
                <p className="pr-12 pb-5 text-pretty text-muted-foreground">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="px-2 pb-4 sm:px-4">
          <div className="relative isolate overflow-hidden rounded-[2rem] bg-primary px-6 py-20 text-center text-primary-foreground sm:py-28">
            <div className="absolute inset-0 -z-10 bg-dots [mask-image:radial-gradient(ellipse_at_50%_50%,#000,transparent_75%)] opacity-60 [--dots:color-mix(in_oklch,var(--primary-foreground)_18%,transparent)]" />
            <h2 className="mx-auto max-w-3xl text-5xl font-bold tracking-[-0.03em] text-balance sm:text-7xl">
              A gente complica. Você aprende.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-pretty">
              Crie a conta, confirme email e telefone e gere seus 2 primeiros
              desafios de graça.
            </p>
            <div className="relative mx-auto mt-10 w-fit">
              <Button asChild size="xl" variant="espresso">
                <Link href="/cadastro">
                  Criar conta grátis
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
              <Scribble
                arrow="right"
                className="right-full bottom-1/2 mr-3 -mb-2.5 hidden md:flex [&_p]:text-primary-foreground [&_svg]:stroke-primary-foreground"
              >
                leva 2 minutos
              </Scribble>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
