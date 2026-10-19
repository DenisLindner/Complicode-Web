'use client';

import { useTranslations } from 'next-intl';
import { CopyButton } from '@/components/copy-button';

export async function loadMarkdown(id: string) {
  const response = await fetch(`/bff/challenges/${id}/markdown`, {
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Markdown unavailable');
  return response.text();
}

export function CopyMarkdownButton({ id }: { id: string }) {
  const t = useTranslations('challenge.actions');

  return (
    <CopyButton
      getText={() => loadMarkdown(id)}
      label={t('copyMarkdown')}
      successMessage={t('markdownCopied')}
      variant="outline"
      size="default"
    />
  );
}
