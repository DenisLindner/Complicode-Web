import { notFound } from 'next/navigation';

/** Unknown URLs render the localized 404 page. */
export default function CatchAll() {
  notFound();
}
