import { describe, expect, it } from 'vitest';
import {
  buildSessionCookies,
  expiredSessionCookies,
  readAccessToken,
  readRefreshToken,
  REFRESH_COOKIE,
  SESSION_COOKIE,
} from './session-cookies';

const tokens = {
  accessToken: 'access.jwt',
  refreshToken: 'refresh.jwt',
  expiresIn: 1800,
  refreshExpiresIn: 259200,
};

describe('session cookies', () => {
  it('encrypts the tokens in two hardened cookies', async () => {
    const [session, refresh] = await buildSessionCookies(tokens);

    expect(session).toMatchObject({
      name: SESSION_COOKIE,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 1800,
    });
    expect(refresh).toMatchObject({ name: REFRESH_COOKIE, maxAge: 259200 });
    expect(session.value).not.toContain('access.jwt');
    expect(refresh.value).not.toContain('refresh.jwt');

    await expect(readAccessToken(session.value)).resolves.toBe('access.jwt');
    await expect(readRefreshToken(refresh.value)).resolves.toBe('refresh.jwt');
  });

  it('rejects a cookie read as the other one', async () => {
    const [session, refresh] = await buildSessionCookies(tokens);

    await expect(readRefreshToken(session.value)).resolves.toBeNull();
    await expect(readAccessToken(refresh.value)).resolves.toBeNull();
  });

  it('rejects tampered values', async () => {
    const [session] = await buildSessionCookies(tokens);
    const tampered = `${session.value.slice(0, -2)}xx`;

    await expect(readAccessToken(tampered)).resolves.toBeNull();
    await expect(readAccessToken('not-a-jwe')).resolves.toBeNull();
    await expect(readAccessToken(undefined)).resolves.toBeNull();
  });

  it('treats an access token about to expire as missing', async () => {
    const [session] = await buildSessionCookies({ ...tokens, expiresIn: 30 });

    await expect(readAccessToken(session.value)).resolves.toBeNull();
  });

  it('expires both cookies keeping the __Host- attributes', () => {
    expect(expiredSessionCookies()).toEqual([
      expect.objectContaining({
        name: SESSION_COOKIE,
        maxAge: 0,
        secure: true,
      }),
      expect.objectContaining({
        name: REFRESH_COOKIE,
        maxAge: 0,
        secure: true,
      }),
    ]);
  });
});
