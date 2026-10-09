import Link from 'next/link';
import { Logo } from '@/components/logo';

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Logo className="opacity-80" />
        <nav aria-label="Rodapé" className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/explorar" className="hover:text-foreground">
            Explorar desafios
          </Link>
          <Link href="/#precos" className="hover:text-foreground">
            Preços
          </Link>
          <Link href="/#perguntas" className="hover:text-foreground">
            Perguntas
          </Link>
          <Link href="/entrar" className="hover:text-foreground">
            Entrar
          </Link>
        </nav>
        <p>Feito para devs que aprendem construindo.</p>
      </div>
    </footer>
  );
}
