import { Gift } from 'lucide-react';
import type { Metadata } from 'next';
import { RegisterForm } from './register-form';

export const metadata: Metadata = { title: 'Criar conta' };

export default function RegisterPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Crie sua conta</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">
        Leva menos de um minuto.
      </p>
      <div className="mb-6 flex items-start gap-3 rounded-lg border border-primary/30 bg-accent px-3 py-2.5 text-sm text-accent-foreground">
        <Gift className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <p>
          Confirme seu email e seu telefone e ganhe <strong>2 créditos</strong>{' '}
          para gerar seus primeiros desafios.
        </p>
      </div>
      <RegisterForm />
    </>
  );
}
