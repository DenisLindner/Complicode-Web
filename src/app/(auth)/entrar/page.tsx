import { Info } from 'lucide-react';
import type { Metadata } from 'next';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { safeRedirectPath } from '@/lib/redirect';
import { LoginForm } from './login-form';

export const metadata: Metadata = { title: 'Entrar' };

export default async function LoginPage({
  searchParams,
}: PageProps<'/entrar'>) {
  const params = await searchParams;
  const next = safeRedirectPath(params.next);
  const expired = params.sessao === 'expirada';

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">
        Bem-vindo de volta
      </h1>
      <p className="mt-1 mb-8 text-sm text-muted-foreground">
        Entre para gerar e acompanhar seus desafios.
      </p>
      {expired && (
        <Alert className="mb-5">
          <Info />
          <AlertDescription>
            Sua sessão expirou. Entre novamente para continuar.
          </AlertDescription>
        </Alert>
      )}
      <LoginForm next={next} />
    </>
  );
}
