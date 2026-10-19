'use client';

import { Clock, PartyPopper, X } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { DocumentLabels } from '@/i18n/document-labels';
import { stackLabel } from '@/i18n/stack-label';
import type { ChallengeDetail } from '@/lib/types/challenge';
import { MAX_REGENERATIONS } from '@/lib/types/limits';
import { ChallengeActions } from './challenge-actions';
import { LevelBadge, PublicBadge } from './challenge-badges';
import { ChallengeDocument, documentSections } from './challenge-document';
import { GeneratingView } from './generating-view';
import { TableOfContents } from './table-of-contents';

/** The owner's view of a ready challenge: versions, actions and the document. */
export function ChallengeView({
  challenge,
  documentLabels,
  isNew,
}: {
  challenge: ChallengeDetail;
  /** Section titles, in the language the challenge is written in. */
  documentLabels: DocumentLabels;
  isNew: boolean;
}) {
  const t = useTranslations('challenge');
  const levels = useTranslations('levels');
  const stacks = useTranslations('stacks');
  const format = useFormatter();
  const versions = challenge.versions;
  const latest = versions.at(-1)?.version ?? 1;
  const [selected, setSelected] = useState(latest);
  const [regenerating, setRegenerating] = useState(false);
  const [showTip, setShowTip] = useState(isNew);

  const version = versions.find((item) => item.version === selected);
  const content = version?.content ?? challenge.content;
  const header = version ?? challenge;
  if (!content) return null;

  const canRegenerate = challenge.regenerationsUsed < MAX_REGENERATIONS;
  const stackName = stackLabel(
    stacks,
    challenge.stack.slug,
    challenge.stack.name,
  );
  const selection = `${stackName} · ${challenge.framework.name} · ${levels(`${challenge.level}.label`)}`;

  if (regenerating) {
    return <GeneratingView newVersion selection={selection} />;
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_200px]">
      <article className="min-w-0 space-y-8">
        {showTip && (
          <div className="flex items-start gap-3 rounded-xl border border-primary/30 bg-accent px-4 py-3 text-sm text-accent-foreground">
            <PartyPopper
              className="mt-0.5 size-4 shrink-0"
              aria-hidden="true"
            />
            <p className="flex-1">
              {t('tipReady')} {canRegenerate && t('tipRegenerate')}
            </p>
            <button
              type="button"
              onClick={() => setShowTip(false)}
              aria-label={t('closeTip')}
              className="rounded-md p-0.5 hover:bg-primary/10"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        <header className="space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {header.industry && (
              <span className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
                {header.industry}
              </span>
            )}
            <LevelBadge level={challenge.level} />
            <span className="text-muted-foreground">
              {stackName} · {challenge.framework.name}
            </span>
            {challenge.public && <PublicBadge />}
          </div>
          <div className="space-y-2">
            <h1
              lang={challenge.locale}
              className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
            >
              {header.title}
            </h1>
            {header.projectName && header.projectName !== header.title && (
              <p
                lang={challenge.locale}
                className="font-mono text-lg text-brand"
              >
                {header.projectName}
              </p>
            )}
            {header.summary && (
              <p
                lang={challenge.locale}
                className="max-w-3xl text-pretty text-muted-foreground"
              >
                {header.summary}
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {content.deadline && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4" aria-hidden="true" />
                {content.deadline}
              </span>
            )}
            <span>
              {t('generatedOn', {
                date: format.dateTime(new Date(challenge.createdAt), 'short'),
              })}
            </span>
          </div>
          <ChallengeActions
            id={challenge.id}
            isPublic={challenge.public}
            canRegenerate={canRegenerate}
            onRegenerating={setRegenerating}
          />
        </header>

        {versions.length > 1 && (
          <Tabs
            value={String(selected)}
            onValueChange={(value) => setSelected(Number(value))}
          >
            <TabsList aria-label={t('versions')}>
              {versions.map((item) => (
                <TabsTrigger key={item.version} value={String(item.version)}>
                  {t('version', { number: item.version })}
                  {item.version === latest && ` · ${t('current')}`}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        <div lang={challenge.locale}>
          <ChallengeDocument
            key={selected}
            content={content}
            labels={documentLabels}
            checklistKey={`cc:progress:${challenge.id}:v${selected}`}
          />
        </div>
      </article>

      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <TableOfContents
            key={selected}
            sections={documentSections(content, documentLabels)}
          />
        </div>
      </aside>
    </div>
  );
}
