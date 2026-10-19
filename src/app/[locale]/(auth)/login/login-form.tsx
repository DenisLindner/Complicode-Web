'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { login } from '@/actions/auth';
import { PasswordInput } from '@/components/password-input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Link } from '@/i18n/navigation';
import { createAuthSchemas, type LoginInput } from '@/lib/validation/auth';

export function LoginForm({ next }: { next?: string }) {
  const t = useTranslations('auth.login');
  const validation = useTranslations('validation');
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string>();
  const schema = useMemo(
    () => createAuthSchemas(validation).loginSchema,
    [validation],
  );
  const form = useForm<LoginInput>({
    resolver: zodResolver(schema),
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
        <FieldLabel htmlFor="email">{t('email')}</FieldLabel>
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
        <FieldLabel htmlFor="password">{t('password')}</FieldLabel>
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
        {t('submit')}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t('noAccount')}{' '}
        <Link
          href="/signup"
          className="font-medium text-brand underline-offset-4 hover:underline"
        >
          {t('createFree')}
        </Link>
      </p>
    </form>
  );
}
