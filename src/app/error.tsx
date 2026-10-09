'use client';

import { RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';

/**
 * Shown when a page fails to render (the API is down, for example). Details
 * stay in the server logs; the digest helps to find them.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo />
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Algo deu errado
        </h1>
        <p className="max-w-sm text-muted-foreground">
          Não conseguimos carregar esta página agora. Tente de novo em alguns
          instantes.
        </p>
        {error.digest && (
          <p className="font-mono text-xs text-muted-foreground">
            código: {error.digest}
          </p>
        )}
      </div>
      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href="/">Ir para o início</Link>
        </Button>
        <Button onClick={reset}>
          <RotateCcw />
          Tentar de novo
        </Button>
      </div>
    </main>
  );
}
