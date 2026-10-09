'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export function CopyButton({
  getText,
  label = 'Copiar',
  successMessage = 'Copiado!',
  variant = 'ghost',
  size = 'sm',
  showLabel = true,
}: {
  /** Text to copy, or a function that loads it. */
  getText: string | (() => Promise<string>);
  label?: string;
  successMessage?: string;
  variant?: 'ghost' | 'outline' | 'secondary';
  size?: 'sm' | 'default' | 'icon-sm';
  showLabel?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      const text = typeof getText === 'string' ? getText : await getText();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(successMessage);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Não foi possível copiar.');
    }
  };

  const Icon = copied ? Check : Copy;
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={copy}
      aria-label={showLabel ? undefined : label}
    >
      <Icon />
      {showLabel && label}
    </Button>
  );
}
