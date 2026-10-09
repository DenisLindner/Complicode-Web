import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function PaginationLinks({
  page,
  total,
  limit,
  basePath,
}: {
  page: number;
  total: number;
  limit: number;
  basePath: string;
}) {
  const pages = Math.max(1, Math.ceil(total / limit));
  if (pages === 1) {
    return null;
  }

  const href = (target: number) => `${basePath}?page=${target}`;

  return (
    <nav
      aria-label="Paginação"
      className="flex items-center justify-between gap-4 pt-2"
    >
      <Button variant="outline" asChild>
        {page > 1 ? (
          <Link href={href(page - 1)}>
            <ChevronLeft />
            Anterior
          </Link>
        ) : (
          <span aria-disabled="true" className="pointer-events-none opacity-50">
            <ChevronLeft />
            Anterior
          </span>
        )}
      </Button>
      <span className="font-mono text-sm text-muted-foreground">
        {page} / {pages}
      </span>
      <Button variant="outline" asChild>
        {page < pages ? (
          <Link href={href(page + 1)}>
            Próxima
            <ChevronRight />
          </Link>
        ) : (
          <span aria-disabled="true" className="pointer-events-none opacity-50">
            Próxima
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
