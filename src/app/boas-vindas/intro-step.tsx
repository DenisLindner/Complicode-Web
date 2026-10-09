import {
  ArrowRight,
  Coins,
  FileText,
  Layers,
  RefreshCw,
  Rocket,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const HOW_IT_WORKS = [
  {
    icon: Layers,
    title: 'Escolha sua stack',
    text: 'Área, framework e nível: de estagiário a sênior.',
  },
  {
    icon: FileText,
    title: 'Receba um briefing real',
    text: 'Contexto de uma empresa, requisitos, prazo, guia e critérios de avaliação.',
  },
  {
    icon: Rocket,
    title: 'Construa e mostre',
    text: 'Exporte em markdown para o README e publique no seu portfólio.',
  },
];

export function IntroStep({ firstName }: { firstName: string }) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-balance">
          Que bom ter você aqui, {firstName}!
        </h1>
        <p className="text-pretty text-muted-foreground">
          Em 2 minutos você deixa tudo pronto para gerar seu primeiro desafio.
        </p>
      </div>

      <ol className="grid gap-3 sm:grid-cols-3">
        {HOW_IT_WORKS.map(({ icon: Icon, title, text }, index) => (
          <li key={title} className="rounded-xl border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="size-4.5" aria-hidden="true" />
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                0{index + 1}
              </span>
            </div>
            <p className="font-medium">{title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{text}</p>
          </li>
        ))}
      </ol>

      <div className="rounded-xl border bg-muted/50 p-4 sm:p-5">
        <p className="mb-3 font-medium">Como funcionam os créditos</p>
        <ul className="space-y-2.5 text-sm">
          <li className="flex gap-2.5">
            <Coins
              className="mt-0.5 size-4 shrink-0 text-brand"
              aria-hidden="true"
            />
            <span>
              Cada desafio gerado custa <strong>1 crédito</strong>. Você ganha{' '}
              <strong>2 créditos</strong> ao confirmar seu email e seu telefone.
            </span>
          </li>
          <li className="flex gap-2.5">
            <RefreshCw
              className="mt-0.5 size-4 shrink-0 text-brand"
              aria-hidden="true"
            />
            <span>
              Não curtiu o desafio? Você pode{' '}
              <strong>regerar uma vez, de graça</strong>.
            </span>
          </li>
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          A verificação do telefone é pelo Telegram, sem SMS e sem custo. Ela
          garante uma conta por pessoa.
        </p>
      </div>

      <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button asChild variant="ghost">
          <Link href="/app">Fazer depois</Link>
        </Button>
        <Button asChild size="lg">
          <Link href="/boas-vindas?etapa=email">
            Começar verificação
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
