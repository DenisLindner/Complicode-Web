/** "TicketFlow AI · v2" → "ticketflow-ai-v2" (safe for file names). */
export function slugify(value: string) {
  const slug = value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

  return slug || 'desafio';
}
