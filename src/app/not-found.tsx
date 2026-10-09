import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo />
      <div className="space-y-2">
        <p className="font-mono text-sm text-brand">404</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Página não encontrada
        </h1>
        <p className="max-w-sm text-muted-foreground">
          O endereço não existe, ou o desafio é privado ou foi removido.
        </p>
      </div>
      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href="/explorar">Explorar desafios</Link>
        </Button>
        <Button asChild>
          <Link href="/">Ir para o início</Link>
        </Button>
      </div>
    </main>
  );
}
