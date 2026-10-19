import { describe, expect, it } from 'vitest';
import { isPage, localizedPath, splitLocale } from './paths';

describe('localizedPath', () => {
  it('has no prefix in English, the base language', () => {
    expect(localizedPath('/', 'en')).toBe('/');
    expect(localizedPath('/login', 'en')).toBe('/login');
    expect(localizedPath('/app/challenges', 'en')).toBe('/app/challenges');
  });

  it('prefixes and translates the other languages', () => {
    expect(localizedPath('/', 'pt')).toBe('/pt');
    expect(localizedPath('/login', 'pt')).toBe('/pt/entrar');
    expect(localizedPath('/login', 'es')).toBe('/es/ingresar');
    expect(localizedPath('/welcome', 'pt')).toBe('/pt/boas-vindas');
    expect(localizedPath('/app/generate', 'es')).toBe('/es/app/generar');
  });
});

describe('splitLocale', () => {
  it('reads the language prefix', () => {
    expect(splitLocale('/pt/entrar')).toEqual({
      locale: 'pt',
      path: '/entrar',
    });
    expect(splitLocale('/es')).toEqual({ locale: 'es', path: '/' });
  });

  it('treats a path without prefix as the base language', () => {
    expect(splitLocale('/login')).toEqual({ locale: 'en', path: '/login' });
    expect(splitLocale('/')).toEqual({ locale: 'en', path: '/' });
  });

  it('does not take the base language as a prefix', () => {
    expect(splitLocale('/en/login')).toEqual({
      locale: 'en',
      path: '/en/login',
    });
  });
});

describe('isPage', () => {
  it('matches the page and what is below it, in the language of the path', () => {
    expect(isPage('/app', 'en', '/app')).toBe(true);
    expect(isPage('/app/challenges/1', 'pt', '/app')).toBe(true);
    expect(isPage('/boas-vindas', 'pt', '/welcome')).toBe(true);
    expect(isPage('/boas-vindas/x', 'pt', '/welcome')).toBe(true);
  });

  it('does not match other pages or other languages', () => {
    expect(isPage('/welcome', 'pt', '/welcome')).toBe(false);
    expect(isPage('/application', 'en', '/app')).toBe(false);
    expect(isPage('/login', 'en', '/signup')).toBe(false);
  });
});
