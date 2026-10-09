import { CircleAlert, Globe, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LEVELS } from '@/lib/levels';
import type { ChallengeLevel, ChallengeStatus } from '@/lib/types/challenge';

export function LevelBadge({ level }: { level: ChallengeLevel }) {
  return (
    <Badge variant="secondary" className="font-mono font-normal">
      {LEVELS[level].label}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: ChallengeStatus }) {
  if (status === 'GENERATING') {
    return (
      <Badge variant="outline" className="gap-1 text-brand">
        <Loader2 className="animate-spin" aria-hidden="true" />
        Gerando
      </Badge>
    );
  }
  if (status === 'FAILED') {
    return (
      <Badge variant="outline" className="gap-1 text-destructive">
        <CircleAlert aria-hidden="true" />
        Falhou
      </Badge>
    );
  }
  return null;
}

export function PublicBadge() {
  return (
    <Badge variant="outline" className="gap-1">
      <Globe aria-hidden="true" />
      Público
    </Badge>
  );
}
