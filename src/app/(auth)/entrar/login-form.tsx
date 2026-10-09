'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { login } from '@/actions/auth';
import { PasswordInput } from '@/components/password-input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { loginSchema, type LoginInput } from '@/lib/validation/auth';

export function LoginForm({ next }: { next?: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string>();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  });
  const { errors } = form.formState;

  const onSubmit = form.handleSubmit((values) => {
    setError(undefined);
    startTransition(async () => {
      // On success the action redirects, so a result means it failed.
      const result = await login(values, next);
      setError(result.error);
      for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
        form.setError(field as keyof LoginInput, { message });
      }
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Field data-invalid={!!errors.email}>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          className="h-10"
          aria-invalid={!!errors.email}
          {...form.register('email')}
        />
        <FieldError errors={[errors.email]} />
      </Field>

      <Field data-invalid={!!errors.password}>
        <FieldLabel htmlFor="password">Senha</FieldLabel>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          className="h-10"
          aria-invalid={!!errors.password}
          {...form.register('password')}
        />
        <FieldError errors={[errors.password]} />
      </Field>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending && <Loader2 className="animate-spin" />}
        Entrar
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Ainda não tem conta?{' '}
        <Link
          href="/cadastro"
          className="font-medium text-brand underline-offset-4 hover:underline"
        >
          Criar conta grátis
        </Link>
      </p>
    </form>
  );
}
