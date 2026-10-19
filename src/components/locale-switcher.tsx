'use client';

import { Check, Languages } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useParams, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { setPreferredLocale } from '@/actions/locale';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePathname, useRouter } from '@/i18n/navigation';
import { type Locale, routing } from '@/i18n/routing';

/** Each language is written in itself, so it can be found whatever the page language. */
const LANGUAGES: Record<Locale, string> = {
  en: 'English',
  pt: 'Português',
  es: 'Español',
};

export function LocaleSwitcher() {
  const t = useTranslations('locale');
  const current = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const switchTo = (locale: Locale) => {
    if (locale === current) return;

    startTransition(() => {
      // Same page in the other language, keeping the query string.
      router.replace(
        {
          pathname,
          params: params as never,
          query: Object.fromEntries(searchParams),
        } as never,
        { locale },
      );
      // Emails and bot messages follow the language chosen on the website.
      void setPreferredLocale(locale);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t('label')}
          disabled={pending}
        >
          <Languages className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {routing.locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            lang={locale}
            onSelect={() => switchTo(locale)}
          >
            {LANGUAGES[locale]}
            {locale === current && <Check className="ml-auto size-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
