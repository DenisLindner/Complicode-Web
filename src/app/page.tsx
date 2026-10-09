import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Logo />
        <ThemeToggle />
      </header>
      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
        <span className="rounded-full border px-3 py-1 font-mono text-xs text-muted-foreground">
          em construção
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Desafios técnicos que parecem{' '}
          <span className="text-brand">trabalho de verdade</span>.
        </h1>
        <p className="max-w-xl text-pretty text-muted-foreground">
          Escolha a stack, o framework e o nível. A gente gera um briefing
          completo, baseado em problemas reais da indústria.
        </p>
      </section>
    </main>
  );
}
