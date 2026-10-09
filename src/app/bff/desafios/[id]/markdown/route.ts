import { getChallenge, getChallengeMarkdown } from '@/lib/server/challenges';
import { isSameOrigin } from '@/lib/server/same-origin';
import { slugify } from '@/lib/slugify';

/**
 * The challenge as a markdown file, with the same visibility rules as the
 * page. ?download=1 sends it as an attachment named after the project.
 */
export async function GET(
  request: Request,
  { params }: RouteContext<'/bff/desafios/[id]/markdown'>,
) {
  if (!isSameOrigin(request)) {
    return new Response('Forbidden', { status: 403 });
  }

  const { id } = await params;
  const markdown = await getChallengeMarkdown(id);
  if (markdown === null) {
    return new Response('Not found', { status: 404 });
  }

  const headers = new Headers({
    'Content-Type': 'text/markdown; charset=utf-8',
    'Cache-Control': 'private, no-store',
  });
  if (new URL(request.url).searchParams.get('download') === '1') {
    const challenge = await getChallenge(id);
    const name = slugify(
      challenge?.projectName ?? challenge?.title ?? 'desafio',
    );
    headers.set('Content-Disposition', `attachment; filename="${name}.md"`);
  }

  return new Response(markdown, { headers });
}
