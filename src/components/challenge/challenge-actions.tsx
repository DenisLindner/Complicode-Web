'use client';

import {
  Download,
  Globe,
  Link2,
  Loader2,
  Lock,
  MoreHorizontal,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import {
  deleteChallenge,
  regenerateChallenge,
  setChallengeVisibility,
} from '@/actions/challenges';
import { CopyMarkdownButton } from './copy-markdown-button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getPathname, useRouter } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';

export function ChallengeActions({
  id,
  isPublic,
  canRegenerate,
  onRegenerating,
}: {
  id: string;
  isPublic: boolean;
  canRegenerate: boolean;
  onRegenerating: (regenerating: boolean) => void;
}) {
  const t = useTranslations('challenge.actions');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [dialog, setDialog] = useState<'regenerate' | 'delete' | null>(null);
  const [pending, startTransition] = useTransition();
  const publicUrl = () =>
    `${window.location.origin}${getPathname({
      href: { pathname: '/c/[id]', params: { id } },
      locale,
    })}`;

  const toggleVisibility = () =>
    startTransition(async () => {
      const result = await setChallengeVisibility(id, !isPublic);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      if (isPublic) {
        toast.success(t('nowPrivate'));
      } else {
        await navigator.clipboard.writeText(publicUrl()).catch(() => undefined);
        toast.success(t('nowPublic'));
      }
      router.refresh();
    });

  const regenerate = () => {
    setDialog(null);
    onRegenerating(true);
    startTransition(async () => {
      const result = await regenerateChallenge(id);
      onRegenerating(false);
      if (result.ok) {
        toast.success(t('newVersion'));
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  const remove = () =>
    startTransition(async () => {
      // On success the action redirects to the list.
      const result = await deleteChallenge(id);
      if (!result.ok) toast.error(result.error);
    });

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <CopyMarkdownButton id={id} />
        <Button variant="outline" asChild>
          <a href={`/bff/challenges/${id}/markdown?download=1`} download>
            <Download />
            {t('download')}
          </a>
        </Button>
        {canRegenerate && (
          <Button
            variant="outline"
            onClick={() => setDialog('regenerate')}
            disabled={pending}
          >
            <RefreshCw />
            {t('regenerate')}
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={t('more')}>
              {pending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <MoreHorizontal />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onSelect={toggleVisibility}>
              {isPublic ? <Lock /> : <Globe />}
              {isPublic ? t('makePrivate') : t('makePublic')}
            </DropdownMenuItem>
            {isPublic && (
              <DropdownMenuItem
                onSelect={async () => {
                  await navigator.clipboard.writeText(publicUrl());
                  toast.success(t('linkCopied'));
                }}
              >
                <Link2 />
                {t('copyLink')}
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => setDialog('delete')}
            >
              <Trash2 />
              {t('delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog
        open={dialog === 'regenerate'}
        onOpenChange={(open) => !open && setDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('regenerateTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('regenerateText')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={regenerate}>
              <RefreshCw />
              {t('regenerate')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={dialog === 'delete'}
        onOpenChange={(open) => !open && setDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>{t('deleteText')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={remove}>
              <Trash2 />
              {t('deleteConfirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
