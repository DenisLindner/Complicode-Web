import { ArrowRight, Coins, Gift } from 'lucide-react';
import Link from 'next/link';
import { DesktopNav, MobileNav } from '@/components/app-nav';
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
          <div className="flex items-center gap-6">
            <Link href="/app" aria-label="Complicode, início">
              <Logo />
            </Link>
            <DesktopNav />
          </div>
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
      {!user.verified && <VerifyBanner />}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-8 pb-28 sm:px-6 md:pb-12">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}

function VerifyBanner() {
  return (
    <div className="border-b bg-accent text-accent-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-2.5 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="flex items-center gap-2">
          <Gift className="size-4 shrink-0" aria-hidden="true" />
          Confirme seu email e seu telefone e ganhe 2 créditos grátis.
        </p>
        <Link
          href="/boas-vindas"
          className="inline-flex items-center gap-1 font-medium underline-offset-4 hover:underline"
        >
          Continuar verificação
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
