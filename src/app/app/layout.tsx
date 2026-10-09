import { Coins } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserMenu } from '@/components/user-menu';
import { requireUser } from '@/lib/server/dal';

export default async function AppLayout({ children }: LayoutProps<'/app'>) {
  const user = await requireUser();

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-backdrop-filter:bg-background/70">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/app" aria-label="Complicode, início">
            <Logo />
          </Link>
          <div className="flex items-center gap-1.5">
            <span
              className="mr-1 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-xs"
              title="Seus créditos"
            >
              <Coins className="size-3.5 text-brand" aria-hidden="true" />
              {user.credits}
              <span className="sr-only">créditos</span>
            </span>
            <ThemeToggle />
            <UserMenu name={user.name} email={user.email} />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
