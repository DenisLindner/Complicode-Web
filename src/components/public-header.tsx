import Link from 'next/link';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { getAccessToken, getRefreshToken } from '@/lib/server/session';

/** Header of the public pages; links to the app when there is a session. */
export async function PublicHeader() {
  const loggedIn = Boolean(
    (await getAccessToken()) ?? (await getRefreshToken()),
  );

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="Complicode, página inicial">
          <Logo />
        </Link>
        <nav
          aria-label="Principal"
          className="flex items-center gap-1 sm:gap-1.5"
        >
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/explorar">Explorar</Link>
          </Button>
          <span className="hidden sm:contents">
            <ThemeToggle />
          </span>
          {loggedIn ? (
            <Button asChild>
              <Link href="/app">Abrir o app</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/entrar">Entrar</Link>
              </Button>
              <Button asChild>
                <Link href="/cadastro">Criar conta</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
