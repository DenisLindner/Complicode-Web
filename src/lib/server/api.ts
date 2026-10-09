import 'server-only';
import { headers } from 'next/headers';
import { ApiError } from './api-error';
import { apiRequest, type ApiRequestOptions } from './api-request';
import { getClientIp } from './client-ip';
import { getAccessToken } from './session';

interface ApiOptions extends Omit<
  ApiRequestOptions,
  'accessToken' | 'clientIp'
> {
  /**
   * required: fails with 401 without a session. optional: sends the token
   * when there is one (public pages). none: never sends it.
   */
  auth?: 'required' | 'optional' | 'none';
}

/**
 * Calls the API on behalf of the current visitor: adds their access token
 * (from the encrypted cookie) and their IP for the API rate limit.
 */
export async function api<T>(path: `/${string}`, options: ApiOptions = {}) {
  const { auth = 'required', ...rest } = options;
  const accessToken = auth === 'none' ? null : await getAccessToken();
  if (auth === 'required' && !accessToken) {
    throw new ApiError(401, ['No session']);
  }

  return apiRequest<T>(path, {
    ...rest,
    accessToken,
    clientIp: getClientIp(await headers()),
  });
}
