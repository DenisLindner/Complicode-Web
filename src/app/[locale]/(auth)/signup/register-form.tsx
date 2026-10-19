'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Circle, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState, useTransition } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { register as registerAccount } from '@/actions/auth';
import { PasswordInput } from '@/components/password-input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import {
  createAuthSchemas,
  PASSWORD_RULES,
  type RegisterInput,
} from '@/lib/validation/auth';

export function RegisterForm() {
  const t = useTranslations('auth.signup');
  const validation = useTranslations('validation');
  const passwordRules = useTranslations('password');
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<{
    message: string;
    emailTaken: boolean;
  }>();
  const schema = useMemo(
    () => createAuthSchemas(validation).registerSchema,
    [validation],
  );
  const form = useForm<RegisterInput>({
    resolver: zodResolver(schema),
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
      setError(
        result.error
          ? {
              message: result.error,
              emailTaken: result.code === 'EMAIL_TAKEN',
            }
          : undefined,
      );
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
            {error.message}{' '}
            {error.emailTaken && (
              <Link href="/login" className="font-medium underline">
                {t('signIn')}
              </Link>
            )}
          </AlertDescription>
        </Alert>
      )}

      <Field data-invalid={!!errors.name}>
        <FieldLabel htmlFor="name">{t('name')}</FieldLabel>
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
                {passwordRules(rule.id)}
                <span className="sr-only">
                  {passed ? t('ruleMet') : t('rulePending')}
                </span>
              </li>
            );
          })}
        </ul>
        <FieldError errors={[errors.password]} />
      </Field>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending && <Loader2 className="animate-spin" />}
        {t('submit')}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t('haveAccount')}{' '}
        <Link
          href="/login"
          className="font-medium text-brand underline-offset-4 hover:underline"
        >
          {t('signIn')}
        </Link>
      </p>
    </form>
  );
}
