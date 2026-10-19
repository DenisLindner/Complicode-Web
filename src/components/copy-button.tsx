'use client';

import { Check, Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export function CopyButton({
  getText,
  label,
  successMessage,
  variant = 'ghost',
  size = 'sm',
  showLabel = true,
}: {
  /** Text to copy, or a function that loads it. */
  getText: string | (() => Promise<string>);
  /** Defaults to "Copy" in the language of the page. */
  label?: string;
  successMessage?: string;
  variant?: 'ghost' | 'outline' | 'secondary';
  size?: 'sm' | 'default' | 'icon-sm';
  showLabel?: boolean;
}) {
  const t = useTranslations('copy');
  const [copied, setCopied] = useState(false);
  const buttonLabel = label ?? t('label');

  const copy = async () => {
    try {
      const text = typeof getText === 'string' ? getText : await getText();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(successMessage ?? t('success'));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t('error'));
    }
  };

  const Icon = copied ? Check : Copy;
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={copy}
      aria-label={showLabel ? undefined : buttonLabel}
    >
      <Icon />
      {showLabel && buttonLabel}
    </Button>
  );
}
