'use client';

import { LogOut, Monitor, Moon, Search, Sparkles, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { logout } from '@/actions/auth';
import { NAV_ITEMS } from '@/components/app-nav';
import { StackIcon } from '@/components/stack-icon';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';

/** ⌘K / Ctrl+K: jump anywhere, start a challenge in a stack, switch theme. */
export function CommandMenu({
  stacks,
}: {
  stacks: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const run = (action: () => void) => {
    setOpen(false);
    action();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden h-8 items-center gap-2 rounded-lg border bg-background px-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground lg:inline-flex"
      >
        <Search className="size-3.5" aria-hidden="true" />
        Buscar…
        <kbd className="rounded border bg-muted px-1.5 font-mono text-[10px]">
          Ctrl K
        </kbd>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Menu de comandos"
        description="Navegue e execute ações"
      >
        <Command>
          <CommandInput placeholder="O que você quer fazer?" />
          <CommandList>
            <CommandEmpty>Nada encontrado.</CommandEmpty>
            <CommandGroup heading="Ir para">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                <CommandItem
                  key={href}
                  onSelect={() => run(() => router.push(href))}
                >
                  <Icon />
                  {label}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Gerar desafio de">
              {stacks.map((stack) => (
                <CommandItem
                  key={stack.slug}
                  value={`gerar ${stack.name}`}
                  onSelect={() =>
                    run(() => router.push(`/app/gerar?stack=${stack.slug}`))
                  }
                >
                  <StackIcon slug={stack.slug} />
                  {stack.name}
                  <CommandShortcut>
                    <Sparkles className="size-3" />
                  </CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Tema">
              <CommandItem onSelect={() => run(() => setTheme('light'))}>
                <Sun />
                Tema claro
              </CommandItem>
              <CommandItem onSelect={() => run(() => setTheme('dark'))}>
                <Moon />
                Tema escuro
              </CommandItem>
              <CommandItem onSelect={() => run(() => setTheme('system'))}>
                <Monitor />
                Tema do sistema
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Conta">
              <CommandItem onSelect={() => run(() => void logout())}>
                <LogOut />
                Sair
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
