import type { useTranslations } from 'next-intl';

type StacksTranslator = ReturnType<typeof useTranslations<'stacks'>>;

/**
 * Name of a stack in the language of the page. The API sends the English
 * name; stacks it does not know (added later) keep that name.
 */
export function stackLabel(t: StacksTranslator, slug: string, name: string) {
  return t.has(slug as never) ? t(slug as never) : name;
}
