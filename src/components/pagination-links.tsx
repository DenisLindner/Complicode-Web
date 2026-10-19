import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import type { AppPathname } from '@/i18n/routing';

export async function PaginationLinks({
  page,
  total,
  limit,
  basePath,
}: {
  page: number;
  total: number;
  limit: number;
  /** Page the links point to (the canonical name, translated by language). */
  basePath: Extract<
    AppPathname,
    '/explore' | '/app/challenges' | '/app/credits'
  >;
}) {
  const pages = Math.max(1, Math.ceil(total / limit));
  if (pages === 1) {
    return null;
  }

  const t = await getTranslations('pagination');
  const href = (target: number) => ({
    pathname: basePath,
    query: { page: target },
  });

  return (
    <nav
      aria-label={t('aria')}
      className="flex items-center justify-between gap-4 pt-2"
    >
      <Button variant="outline" asChild>
        {page > 1 ? (
          <Link href={href(page - 1)}>
            <ChevronLeft />
            {t('previous')}
          </Link>
        ) : (
          <span aria-disabled="true" className="pointer-events-none opacity-50">
            <ChevronLeft />
            {t('previous')}
          </span>
        )}
      </Button>
      <span className="font-mono text-sm text-muted-foreground">
        {page} / {pages}
      </span>
      <Button variant="outline" asChild>
        {page < pages ? (
          <Link href={href(page + 1)}>
            {t('next')}
            <ChevronRight />
          </Link>
        ) : (
          <span aria-disabled="true" className="pointer-events-none opacity-50">
            {t('next')}
            <ChevronRight />
          </span>
        )}
      </Button>
    </nav>
  );
}

/** Page number from the query string, clamped to a sane range. */
export function parsePage(value: unknown) {
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 && page <= 10_000 ? page : 1;
}
