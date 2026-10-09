/** An error answered by the Complicode API, or 503 when it is unreachable. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly messages: string[] = [],
  ) {
    super(`API request failed with ${status}`);
    this.name = 'ApiError';
  }
}

export function isApiError(error: unknown, status?: number): error is ApiError {
  return (
    error instanceof ApiError &&
    (status === undefined || error.status === status)
  );
}
