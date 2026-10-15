import Link from 'next/link';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { getAccessToken, getRefreshToken } from '@/lib/server/session';

const LINKS = [
  { href: '/#como-funciona', label: 'Como funciona' },
  { href: '/explorar', label: 'Exemplos' },
  { href: '/#precos', label: 'Preços' },
  { href: '/#perguntas', label: 'Perguntas' },
] as const;

/** Header of the public pages; links to the app when there is a session. */
export async function PublicHeader() {
  const loggedIn = Boolean(
    (await getAccessToken()) ?? (await getRefreshToken()),
  );

  return (
    <header className="sticky top-0 z-40 header-scroll border-b bg-background/85 backdrop-blur supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="Complicode, página inicial">
          <Logo />
        </Link>
        <nav aria-label="Seções" className="hidden items-center gap-1 lg:flex">
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>
        <nav
          aria-label="Principal"
          className="flex items-center gap-1 sm:gap-1.5"
        >
          <Button
            asChild
            variant="ghost"
            className="hidden rounded-full sm:inline-flex lg:hidden"
          >
            <Link href="/explorar">Explorar</Link>
          </Button>
          <span className="hidden sm:contents">
            <ThemeToggle />
          </span>
          {loggedIn ? (
            <Button asChild className="h-9 rounded-full px-4">
              <Link href="/app">Abrir o app</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" className="h-9 rounded-full">
                <Link href="/entrar">Entrar</Link>
              </Button>
              <Button asChild className="h-9 rounded-full px-4">
                <Link href="/cadastro">Criar conta</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
