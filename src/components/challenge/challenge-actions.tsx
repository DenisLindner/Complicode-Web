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
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [dialog, setDialog] = useState<'regenerate' | 'delete' | null>(null);
  const [pending, startTransition] = useTransition();
  const publicUrl = () => `${window.location.origin}/d/${id}`;

  const toggleVisibility = () =>
    startTransition(async () => {
      const result = await setChallengeVisibility(id, !isPublic);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      if (isPublic) {
        toast.success('O desafio agora é privado.');
      } else {
        await navigator.clipboard.writeText(publicUrl()).catch(() => undefined);
        toast.success('Desafio público! O link foi copiado.');
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
        toast.success('Nova versão gerada! A anterior continua salva.');
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
          <a href={`/bff/desafios/${id}/markdown?download=1`} download>
            <Download />
            Baixar .md
          </a>
        </Button>
        {canRegenerate && (
          <Button
            variant="outline"
            onClick={() => setDialog('regenerate')}
            disabled={pending}
          >
            <RefreshCw />
            Regerar
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Mais ações">
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
              {isPublic ? 'Tornar privado' : 'Tornar público'}
            </DropdownMenuItem>
            {isPublic && (
              <DropdownMenuItem
                onSelect={async () => {
                  await navigator.clipboard.writeText(publicUrl());
                  toast.success('Link público copiado.');
                }}
              >
                <Link2 />
                Copiar link público
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => setDialog('delete')}
            >
              <Trash2 />
              Excluir desafio
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
            <AlertDialogTitle>Regerar este desafio?</AlertDialogTitle>
            <AlertDialogDescription>
              É grátis, mas só dá para regerar uma vez. A IA cria um desafio
              novo com a mesma stack e o mesmo nível, e a versão atual continua
              salva para você comparar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={regenerate}>
              <RefreshCw />
              Regerar
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
            <AlertDialogTitle>Excluir este desafio?</AlertDialogTitle>
            <AlertDialogDescription>
              Ele some da sua lista e, se for público, da galeria. Essa ação não
              pode ser desfeita e o crédito não é devolvido.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={remove}>
              <Trash2 />
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
