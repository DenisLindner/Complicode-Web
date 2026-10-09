'use client';

import { CopyButton } from '@/components/copy-button';

export async function loadMarkdown(id: string) {
  const response = await fetch(`/bff/desafios/${id}/markdown`, {
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Markdown unavailable');
  return response.text();
}

export function CopyMarkdownButton({ id }: { id: string }) {
  return (
    <CopyButton
      getText={() => loadMarkdown(id)}
      label="Copiar markdown"
      successMessage="Markdown copiado. É só colar no README!"
      variant="outline"
      size="default"
    />
  );
}
