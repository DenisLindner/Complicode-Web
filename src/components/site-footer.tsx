import Link from 'next/link';
import { Logo } from '@/components/logo';

const COLUMNS = [
  {
    title: 'Produto',
    links: [
      { href: '/#como-funciona', label: 'Como funciona' },
      { href: '/explorar', label: 'Explorar desafios' },
      { href: '/#precos', label: 'Preços' },
      { href: '/#perguntas', label: 'Perguntas' },
    ],
  },
  {
    title: 'Conta',
    links: [
      { href: '/cadastro', label: 'Criar conta' },
      { href: '/entrar', label: 'Entrar' },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="overflow-hidden border-t">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 pt-14 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] sm:px-6">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            Desafios técnicos baseados em problemas reais, para devs que
            aprendem construindo.
          </p>
        </div>
        {COLUMNS.map(({ title, links }) => (
          <nav key={title} aria-label={title} className="space-y-3 text-sm">
            <p className="font-medium">{title}</p>
            <ul className="space-y-2">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="mx-auto w-full max-w-6xl px-4 pt-10 text-xs text-muted-foreground sm:px-6">
        © Complicode
      </div>
      <p
        aria-hidden="true"
        className="mx-auto -mb-[0.22em] max-w-6xl px-2 pt-4 text-center font-heading text-[clamp(4rem,17vw,13.5rem)] leading-none font-bold tracking-[-0.06em] text-foreground/[0.06] select-none"
      >
        complicode
      </p>
    </footer>
  );
}
