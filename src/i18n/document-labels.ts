import { getMessages } from 'next-intl/server';
import type messages from '../../messages/en.json';
import type { Locale } from './routing';

/** Section titles of the challenge document. */
export type DocumentLabels = (typeof messages)['document'];

/**
 * The labels of a challenge are in the language of the challenge, whatever
 * language the interface is in, so the document never mixes two languages.
 */
export async function getDocumentLabels(locale: Locale) {
  const all = await getMessages({ locale });
  return all.document as DocumentLabels;
}
