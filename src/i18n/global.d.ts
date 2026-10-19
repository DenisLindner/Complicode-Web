import type en from '../../messages/en.json';
import type { formats } from './formats';
import type { Locale } from './routing';

// Makes `t('some.key')` fail the type check when the key does not exist.
declare module 'next-intl' {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof en;
    Formats: typeof formats;
  }
}
