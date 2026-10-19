'use client';

import { LogOut, Monitor, Moon, Search, Sparkles, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
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
import { useRouter } from '@/i18n/navigation';
import { stackLabel } from '@/i18n/stack-label';

/** ⌘K / Ctrl+K: jump anywhere, start a challenge in a stack, switch theme. */
export function CommandMenu({
  stacks,
}: {
  stacks: { slug: string; name: string }[];
}) {
  const t = useTranslations('commandMenu');
  const nav = useTranslations('nav');
  const stackNames = useTranslations('stacks');
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
        {t('search')}
        <kbd className="rounded border bg-muted px-1.5 font-mono text-[10px]">
          Ctrl K
        </kbd>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title={t('title')}
        description={t('description')}
      >
        <Command>
          <CommandInput placeholder={t('placeholder')} />
          <CommandList>
            <CommandEmpty>{t('empty')}</CommandEmpty>
            <CommandGroup heading={t('goTo')}>
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                <CommandItem
                  key={href}
                  onSelect={() => run(() => router.push(href))}
                >
                  <Icon />
                  {nav(label)}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading={t('generateFrom')}>
              {stacks.map((stack) => {
                const name = stackLabel(stackNames, stack.slug, stack.name);
                return (
                  <CommandItem
                    key={stack.slug}
                    value={`${t('generateKeyword')} ${name}`}
                    onSelect={() =>
                      run(() =>
                        router.push({
                          pathname: '/app/generate',
                          query: { stack: stack.slug },
                        }),
                      )
                    }
                  >
                    <StackIcon slug={stack.slug} />
                    {name}
                    <CommandShortcut>
                      <Sparkles className="size-3" />
                    </CommandShortcut>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading={t('theme')}>
              <CommandItem onSelect={() => run(() => setTheme('light'))}>
                <Sun />
                {t('themeLight')}
              </CommandItem>
              <CommandItem onSelect={() => run(() => setTheme('dark'))}>
                <Moon />
                {t('themeDark')}
              </CommandItem>
              <CommandItem onSelect={() => run(() => setTheme('system'))}>
                <Monitor />
                {t('themeSystem')}
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading={t('account')}>
              <CommandItem onSelect={() => run(() => void logout())}>
                <LogOut />
                {t('logout')}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
