import { defineRouting } from 'next-intl/routing';

/**
 * English is the base language and has no URL prefix (`/pricing`); the other
 * languages are prefixed (`/pt/precos`). Page names are translated per
 * language; the keys below are the canonical (English) names used in code.
 */
export const routing = defineRouting({
  locales: ['en', 'pt', 'es'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/login': { en: '/login', pt: '/entrar', es: '/ingresar' },
    '/signup': { en: '/signup', pt: '/cadastro', es: '/registro' },
    '/welcome': { en: '/welcome', pt: '/boas-vindas', es: '/bienvenida' },
    '/explore': { en: '/explore', pt: '/explorar', es: '/explorar' },
    '/c/[id]': { en: '/c/[id]', pt: '/d/[id]', es: '/d/[id]' },
    '/app': '/app',
    '/app/generate': {
      en: '/app/generate',
      pt: '/app/gerar',
      es: '/app/generar',
    },
    '/app/challenges': {
      en: '/app/challenges',
      pt: '/app/desafios',
      es: '/app/desafios',
    },
    '/app/challenges/[id]': {
      en: '/app/challenges/[id]',
      pt: '/app/desafios/[id]',
      es: '/app/desafios/[id]',
    },
    '/app/credits': {
      en: '/app/credits',
      pt: '/app/creditos',
      es: '/app/creditos',
    },
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;

export const LOCALE_COOKIE = 'NEXT_LOCALE';
