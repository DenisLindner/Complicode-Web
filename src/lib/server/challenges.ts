import 'server-only';
import { cache } from 'react';
import { z } from 'zod';
import type {
  ChallengeDetail,
  ChallengeSummary,
  ChallengeVersion,
  Paginated,
  Stack,
} from '@/lib/types/challenge';
import { api } from './api';
import { isApiError } from './api-error';

/** Everything the API sends that the interface needs (no user ids). */
type ApiChallenge = ChallengeSummary & {
  content?: ChallengeDetail['content'];
  versions?: ChallengeVersion[];
};

export const challengeIdSchema = z.uuid();

export function toSummary(challenge: ApiChallenge): ChallengeSummary {
  return {
    id: challenge.id,
    level: challenge.level,
    status: challenge.status,
    title: challenge.title,
    projectName: challenge.projectName,
    industry: challenge.industry,
    summary: challenge.summary,
    public: challenge.public,
    regenerationsUsed: challenge.regenerationsUsed,
    createdAt: challenge.createdAt,
    stack: { slug: challenge.stack.slug, name: challenge.stack.name },
    framework: {
      slug: challenge.framework.slug,
      name: challenge.framework.name,
      language: challenge.framework.language,
    },
  };
}

function toDetail(challenge: ApiChallenge): ChallengeDetail {
  return {
    ...toSummary(challenge),
    content: challenge.content ?? null,
    isOwner: Array.isArray(challenge.versions),
    versions: (challenge.versions ?? []).map((version) => ({
      version: version.version,
      title: version.title,
      projectName: version.projectName,
      industry: version.industry,
      summary: version.summary,
      content: version.content,
      createdAt: version.createdAt,
    })),
  };
}

export const getStacks = cache(() =>
  api<Stack[]>('/catalog/stacks', { auth: 'none' }),
);

export async function listMyChallenges(page = 1, limit = 12) {
  const result = await api<Paginated<ApiChallenge>>(
    `/challenges?page=${page}&limit=${limit}`,
  );
  return { ...result, items: result.items.map(toSummary) };
}

/**
 * The challenge as the current visitor may see it (the owner sees every
 * version; others only public ones), or null when it does not exist for them.
 */
export const getChallenge = cache(async (id: string) => {
  if (!challengeIdSchema.safeParse(id).success) {
    return null;
  }

  try {
    return toDetail(
      await api<ApiChallenge>(`/challenges/${id}`, { auth: 'optional' }),
    );
  } catch (error) {
    if (isApiError(error, 404)) {
      return null;
    }
    throw error;
  }
});

export async function getChallengeMarkdown(id: string) {
  if (!challengeIdSchema.safeParse(id).success) {
    return null;
  }

  try {
    return await api<string>(`/challenges/${id}/markdown`, {
      auth: 'optional',
      as: 'text',
    });
  } catch (error) {
    if (isApiError(error, 404) || isApiError(error, 409)) {
      return null;
    }
    throw error;
  }
}
