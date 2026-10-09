import type { Metadata } from 'next';
import { requireUser } from '@/lib/server/dal';

export const metadata: Metadata = { title: 'Início' };

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight">
        Olá, {user.firstName}
      </h1>
      <p className="text-muted-foreground">
        Você tem {user.credits} {user.credits === 1 ? 'crédito' : 'créditos'}.
      </p>
    </div>
  );
}
