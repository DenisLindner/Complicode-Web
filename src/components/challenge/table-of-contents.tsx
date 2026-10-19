'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { DocumentSection } from './challenge-document';

/** Sticky section links that follow the reading position. */
export function TableOfContents({ sections }: { sections: DocumentSection[] }) {
  const t = useTranslations('challenge.toc');
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-20% 0px -70% 0px' },
    );
    for (const { id } of sections) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label={t('aria')} className="text-sm">
      <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {t('title')}
      </p>
      <ul className="space-y-1 border-l">
        {sections.map(({ id, title }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={active === id ? 'location' : undefined}
              className={cn(
                '-ml-px block border-l-2 border-transparent py-1 pl-3 text-muted-foreground transition-colors hover:text-foreground',
                active === id && 'border-primary font-medium text-foreground',
              )}
            >
              {title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
