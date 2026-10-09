import {
  ArrowRight,
  Building2,
  ClipboardCheck,
  Clock,
  FileCode2,
  FolderTree,
  Gift,
  Layers,
  ListChecks,
  Map as MapIcon,
  Rocket,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChallengeCard } from '@/components/challenge/challenge-card';
import { DocumentPreview } from '@/components/landing/document-preview';
import { PublicHeader } from '@/components/public-header';
import { SiteFooter } from '@/components/site-footer';
import { Button } from '@/components/ui/button';
import { LEVEL_ORDER, LEVELS } from '@/lib/levels';
import { listPublicChallenges } from '@/lib/server/challenges';

export const metadata: Metadata = {
  title: {
    absolute: 'Complicode · Desafios técnicos que parecem trabalho de verdade',
  },
};

const FRAMEWORKS = [
  'NestJS',
  'Spring Boot',
  'FastAPI',
  'ASP.NET Core',
  'Django',
  'Laravel',
  'Gin',
  'React',
  'Next.js',
  'Angular',
  'Vue',
  'Flutter',
  'React Native',
  'SwiftUI',
  'Pandas',
  'PyTorch',
];

const STEPS = [
  {
    icon: Layers,
    title: 'Escolha a stack',
    text: 'Área, framework e nível, de estagiário a sênior.',
  },
  {
    icon: Sparkles,
    title: 'Receba o briefing',
    text: 'A IA parte de um problema real de empresa e monta o desafio completo em segundos.',
  },
  {
    icon: Rocket,
    title: 'Construa e publique',
    text: 'Exporte em markdown, marque o progresso e mostre no portfólio.',
  },
];

const SECTIONS = [
  {
    icon: Building2,
    title: 'Contexto real',
    text: 'A dor de uma empresa, com números e personagens.',
  },
  {
    icon: ListChecks,
    title: 'Requisitos',
    text: 'Funcionais e não funcionais, com regras e limites.',
  },
  {
    icon: FileCode2,
    title: 'O que usar',
    text: 'Tecnologias por camada e para que cada uma serve.',
  },
  {
    icon: ClipboardCheck,
    title: 'Entregas',
    text: 'O que precisa estar no repositório no fim.',
  },
  {
    icon: Clock,
    title: 'Prazo',
    text: 'Tempo para conclusão adequado ao nível.',
  },
  {
    icon: MapIcon,
    title: 'Guia de implementação',
    text: 'Modelagem, integrações, segurança e dicas.',
  },
  {
    icon: ShieldCheck,
    title: 'Critérios de avaliação',
    text: 'O que um revisor sênior olharia no seu código.',
  },
  {
    icon: FolderTree,
    title: 'Estrutura de pastas',
    text: 'Uma árvore sugerida no padrão do framework.',
  },
];

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

async function loadGallery() {
  try {
    return (await listPublicChallenges(1, 3)).items;
  } catch {
    // The landing page never fails because of the gallery.
    return [];
  }
}

export default async function LandingPage() {
  const gallery = await loadGallery();

  return (
    <div className="flex min-h-dvh flex-col">
      <PublicHeader />
      <main className="flex-1">
        <section className="mx-auto grid w-full max-w-6xl items-center gap-14 overflow-x-clip px-4 pt-14 pb-20 sm:px-6 lg:grid-cols-2 lg:pt-24">
          <div className="space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs">
              <span className="size-1.5 rounded-full bg-primary" />
              Briefings baseados em problemas reais
            </span>
            <h1 className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Desafios técnicos que parecem{' '}
              <span className="text-brand">trabalho de verdade</span>.
            </h1>
            <p className="max-w-xl text-lg text-pretty text-muted-foreground">
              Escolha sua stack e seu nível. O Complicode gera um projeto único,
              com contexto de empresa, requisitos, prazo, guia de implementação
              e o que seria avaliado numa revisão de código.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-11 px-5">
                <Link href="/cadastro">
                  Começar grátis
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-11 px-5">
                <Link href="/explorar">Ver desafios de exemplo</Link>
              </Button>
            </div>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Gift className="size-4 text-brand" aria-hidden="true" />2
              desafios grátis ao confirmar email e telefone. Sem cartão.
            </p>
          </div>
          <DocumentPreview />
        </section>

        <section aria-label="Frameworks" className="border-y bg-muted/30">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap justify-center gap-x-6 gap-y-3 px-4 py-6 font-mono text-sm text-muted-foreground sm:px-6">
            {FRAMEWORKS.map((name) => (
              <span key={name}>{name}</span>
            ))}
          </div>
        </section>

        <section
          id="como-funciona"
          className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6"
        >
          <h2 className="text-3xl font-semibold tracking-tight">
            Como funciona
          </h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, text }, index) => (
              <li
                key={title}
                className="relative rounded-2xl border bg-card p-6"
              >
                <span className="font-mono text-xs text-muted-foreground">
                  0{index + 1}
                </span>
                <span className="mt-4 flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-y bg-muted/30">
          <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight">
                Não é uma ideia solta. É um briefing completo.
              </h2>
              <p className="mt-3 text-muted-foreground">
                Cada desafio vem estruturado como um projeto de empresa, do
                contexto aos critérios de avaliação.
              </p>
            </div>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {SECTIONS.map(({ icon: Icon, title, text }) => (
                <li key={title} className="rounded-xl border bg-card p-5">
                  <Icon className="size-5 text-brand" aria-hidden="true" />
                  <h3 className="mt-3 font-medium">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="text-3xl font-semibold tracking-tight">
            Do primeiro estágio ao sênior
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            O nível muda o escopo, o prazo e o que se espera da sua solução.
          </p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LEVEL_ORDER.map((level) => (
              <li key={level} className="rounded-xl border bg-card p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{LEVELS[level].label}</h3>
                  <span className="font-mono text-xs text-brand">
                    {LEVELS[level].deadline}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {LEVELS[level].description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {gallery.length > 0 && (
          <section className="border-y bg-muted/30">
            <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-3xl font-semibold tracking-tight">
                    Desafios da comunidade
                  </h2>
                  <p className="mt-3 text-muted-foreground">
                    Gerados por outros devs e compartilhados publicamente.
                  </p>
                </div>
                <Link
                  href="/explorar"
                  className="inline-flex items-center gap-1 text-sm font-medium text-brand underline-offset-4 hover:underline"
                >
                  Ver todos
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
              <ul className="mt-10 grid gap-4 md:grid-cols-3">
                {gallery.map((challenge) => (
                  <li key={challenge.id}>
                    <ChallengeCard
                      challenge={challenge}
                      href={`/d/${challenge.id}`}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section
          id="precos"
          className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6"
        >
          <h2 className="text-3xl font-semibold tracking-tight">
            Preços simples
          </h2>
          <p className="mt-3 text-muted-foreground">
            Sem assinatura. Você paga só pelos desafios que gerar.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border bg-card p-7">
              <h3 className="font-semibold">Para começar</h3>
              <p className="mt-4 font-mono text-4xl font-semibold">R$ 0</p>
              <p className="mt-1 text-sm text-muted-foreground">
                2 créditos ao confirmar email e telefone
              </p>
              <ul className="mt-6 space-y-2 text-sm">
                <li>• 2 desafios completos</li>
                <li>• Regeração grátis em cada um</li>
                <li>• Exportação em markdown</li>
              </ul>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="mt-7 w-full"
              >
                <Link href="/cadastro">Criar conta grátis</Link>
              </Button>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-primary/50 bg-card p-7">
              <div className="pointer-events-none absolute -top-20 -right-20 size-56 rounded-full bg-primary/15 blur-2xl" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Pacote de créditos</h3>
                  <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
                    R$ 1 por desafio
                  </span>
                </div>
                <p className="mt-4 font-mono text-4xl font-semibold">R$ 10</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  10 créditos, pagamento único por PIX ou cartão
                </p>
                <ul className="mt-6 space-y-2 text-sm">
                  <li>• 10 desafios em qualquer stack e nível</li>
                  <li>• Créditos que não expiram</li>
                  <li>• Regeração grátis em cada desafio</li>
                </ul>
                <Button asChild size="lg" className="mt-7 w-full">
                  <Link href="/cadastro">Começar agora</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section
          id="perguntas"
          className="mx-auto w-full max-w-3xl scroll-mt-20 px-4 pb-20 sm:px-6"
        >
          <h2 className="text-3xl font-semibold tracking-tight">
            Perguntas frequentes
          </h2>
          <div className="mt-8 divide-y rounded-2xl border bg-card">
            {FAQ.map(({ question, answer }) => (
              <details key={question} className="group px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                  {question}
                  <span
                    aria-hidden="true"
                    className="font-mono text-muted-foreground transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-foreground px-6 py-14 text-center text-background sm:px-12">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklch,var(--primary)_45%,transparent),transparent_60%)]" />
            <div className="relative space-y-5">
              <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                Seu próximo projeto de portfólio começa aqui.
              </h2>
              <p className="mx-auto max-w-xl opacity-80">
                Crie a conta, confirme email e telefone e gere seus 2 primeiros
                desafios de graça.
              </p>
              <Button asChild size="lg" className="h-11 px-6">
                <Link href="/cadastro">
                  Criar conta grátis
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
