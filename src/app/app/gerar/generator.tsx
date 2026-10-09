'use client';

import { ArrowRight, Coins, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { generateChallenge } from '@/actions/challenges';
import { StackIcon } from '@/components/stack-icon';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { LEVEL_ORDER, LEVELS } from '@/lib/levels';
import type { ChallengeLevel, Stack } from '@/lib/types/challenge';
import { ChoiceCard } from './choice-card';
import { GeneratingView } from '@/components/challenge/generating-view';

interface Selection {
  stackId?: string;
  frameworkId?: string;
  level?: ChallengeLevel;
}

function Section({
  step,
  title,
  description,
  children,
}: {
  step: number;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-4">
      <legend className="mb-4 flex items-start gap-3">
        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border font-mono text-xs">
          {step}
        </span>
        <span>
          <span className="block font-medium">{title}</span>
          <span className="block text-sm text-muted-foreground">
            {description}
          </span>
        </span>
      </legend>
      {children}
    </fieldset>
  );
}

export function Generator({
  stacks,
  credits,
  verified,
  initial,
}: {
  stacks: Stack[];
  credits: number;
  verified: boolean;
  initial: Selection;
}) {
  const [selection, setSelection] = useState<Selection>(initial);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  const stack = stacks.find(({ id }) => id === selection.stackId);
  const framework = stack?.frameworks.find(
    ({ id }) => id === selection.frameworkId,
  );
  const ready = stack && framework && selection.level;
  const canGenerate = ready && credits > 0 && !pending;

  const chooseStack = (stackId: string) =>
    setSelection((current) => {
      const next = stacks.find(({ id }) => id === stackId);
      const keepsFramework = next?.frameworks.some(
        ({ id }) => id === current.frameworkId,
      );
      return {
        ...current,
        stackId,
        frameworkId: keepsFramework ? current.frameworkId : undefined,
      };
    });

  const generate = () => {
    if (!stack || !framework || !selection.level) return;
    const input = {
      stackId: stack.id,
      frameworkId: framework.id,
      level: selection.level,
    };
    setError(undefined);
    startTransition(async () => {
      // On success the action redirects to the new challenge.
      const result = await generateChallenge(input);
      setError(result.error);
    });
  };

  if (pending && ready) {
    return (
      <GeneratingView
        selection={`${stack.name} · ${framework.name} · ${LEVELS[selection.level!].label}`}
      />
    );
  }

  return (
    <div className="space-y-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Gerar desafio
        </h1>
        <p className="text-muted-foreground">
          Escolha onde quer praticar. O desafio simula um problema real de uma
          empresa, no seu nível.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Section step={1} title="Área" description="Onde fica o foco do projeto.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {stacks.map((item) => (
            <ChoiceCard
              key={item.id}
              name="stack"
              value={item.id}
              checked={selection.stackId === item.id}
              onChange={chooseStack}
              className="flex-col gap-3"
            >
              <StackIcon
                slug={item.slug}
                className="size-5 text-muted-foreground group-has-checked:text-brand"
              />
              <span className="font-medium">{item.name}</span>
            </ChoiceCard>
          ))}
        </div>
      </Section>

      <Section
        step={2}
        title="Framework"
        description={
          stack
            ? `Frameworks disponíveis para ${stack.name}.`
            : 'Escolha uma área primeiro.'
        }
      >
        {stack ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {stack.frameworks.map((item) => (
              <ChoiceCard
                key={item.id}
                name="framework"
                value={item.id}
                checked={selection.frameworkId === item.id}
                onChange={(frameworkId) =>
                  setSelection((current) => ({ ...current, frameworkId }))
                }
                className="flex-col gap-0.5"
              >
                <span className="font-medium">{item.name}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {item.language}
                </span>
              </ChoiceCard>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            Os frameworks aparecem aqui.
          </div>
        )}
      </Section>

      <Section
        step={3}
        title="Nível"
        description="Define o escopo, o prazo e o que será avaliado."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {LEVEL_ORDER.map((level) => (
            <ChoiceCard
              key={level}
              name="level"
              value={level}
              checked={selection.level === level}
              onChange={(value) =>
                setSelection((current) => ({
                  ...current,
                  level: value as ChallengeLevel,
                }))
              }
              className="flex-col gap-2"
            >
              <span className="flex items-center justify-between">
                <span className="font-medium">{LEVELS[level].label}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {LEVELS[level].deadline}
                </span>
              </span>
              <span className="text-sm text-muted-foreground">
                {LEVELS[level].description}
              </span>
            </ChoiceCard>
          ))}
        </div>
      </Section>

      <div className="sticky bottom-20 z-30 md:bottom-4">
        <div className="flex flex-col gap-3 rounded-2xl border bg-card/95 p-3 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:pl-5">
          <div className="min-w-0 text-sm">
            <p className="truncate font-medium">
              {ready
                ? `${stack.name} · ${framework.name} · ${LEVELS[selection.level!].label}`
                : 'Escolha a área, o framework e o nível'}
            </p>
            <p className="flex items-center gap-1.5 text-muted-foreground">
              <Coins className="size-3.5 text-brand" aria-hidden="true" />
              Custa 1 crédito · você tem {credits}
            </p>
          </div>
          {credits > 0 ? (
            <Button size="lg" onClick={generate} disabled={!canGenerate}>
              <Sparkles data-icon="inline-start" />
              Gerar desafio
            </Button>
          ) : (
            <Button asChild size="lg">
              <Link href={verified ? '/app/creditos' : '/boas-vindas'}>
                {verified ? 'Comprar créditos' : 'Ganhar 2 créditos grátis'}
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
