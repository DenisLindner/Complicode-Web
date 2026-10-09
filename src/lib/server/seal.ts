import 'server-only';
import { EncryptJWT, jwtDecrypt } from 'jose';
import { env } from './env';

let key: Promise<Uint8Array> | undefined;

/** 256-bit key derived from SESSION_SECRET. */
function getKey() {
  key ??= crypto.subtle
    .digest('SHA-256', new TextEncoder().encode(env.SESSION_SECRET))
    .then((digest) => new Uint8Array(digest));
  return key;
}

/**
 * Encrypts and authenticates a payload (JWE with A256GCM). The purpose is
 * bound as the audience, so a value sealed for one cookie is rejected when
 * read as another.
 */
export async function seal(
  payload: Record<string, unknown>,
  purpose: string,
  expiresAt: Date,
) {
  return new EncryptJWT(payload)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setAudience(purpose)
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .encrypt(await getKey());
}

/** Returns the payload, or null when the value is invalid or expired. */
export async function unseal<T>(value: string | undefined, purpose: string) {
  if (!value) {
    return null;
  }

  try {
    const { payload } = await jwtDecrypt(value, await getKey(), {
      audience: purpose,
    });
    return payload as T;
  } catch {
    return null;
  }
}
