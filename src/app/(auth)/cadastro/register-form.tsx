'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Circle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { register as registerAccount } from '@/actions/auth';
import { PasswordInput } from '@/components/password-input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  PASSWORD_RULES,
  registerSchema,
  type RegisterInput,
} from '@/lib/validation/auth';

export function RegisterForm() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string>();
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
    mode: 'onTouched',
  });
  const { errors } = form.formState;
  const password = useWatch({ control: form.control, name: 'password' });

  const onSubmit = form.handleSubmit((values) => {
    setError(undefined);
    startTransition(async () => {
      // On success the action redirects, so a result means it failed.
      const result = await registerAccount(values);
      setError(result.error);
      for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
        form.setError(field as keyof RegisterInput, { message });
      }
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error}{' '}
            {error.includes('cadastrado') && (
              <Link href="/entrar" className="font-medium underline">
                Entrar
              </Link>
            )}
          </AlertDescription>
        </Alert>
      )}

      <Field data-invalid={!!errors.name}>
        <FieldLabel htmlFor="name">Nome</FieldLabel>
        <Input
          id="name"
          autoComplete="name"
          className="h-10"
          aria-invalid={!!errors.name}
          {...form.register('name')}
        />
        <FieldError errors={[errors.name]} />
      </Field>

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
          autoComplete="new-password"
          className="h-10"
          aria-invalid={!!errors.password}
          aria-describedby="password-rules"
          {...form.register('password')}
        />
        <ul
          id="password-rules"
          className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-1 text-xs"
        >
          {PASSWORD_RULES.map((rule) => {
            const passed = rule.test(password);
            const Icon = passed ? Check : Circle;
            return (
              <li
                key={rule.id}
                className={cn(
                  'flex items-center gap-1.5 transition-colors',
                  passed ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                <Icon
                  className={cn('size-3.5', passed && 'text-success')}
                  aria-hidden="true"
                />
                {rule.label}
                <span className="sr-only">
                  {passed ? '(atendido)' : '(pendente)'}
                </span>
              </li>
            );
          })}
        </ul>
        <FieldError errors={[errors.password]} />
      </Field>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending && <Loader2 className="animate-spin" />}
        Criar conta
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Já tem conta?{' '}
        <Link
          href="/entrar"
          className="font-medium text-brand underline-offset-4 hover:underline"
        >
          Entrar
        </Link>
      </p>
    </form>
  );
}
