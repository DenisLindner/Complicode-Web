import { describe, expect, it } from 'vitest';
import en from '../../messages/en.json';
import es from '../../messages/es.json';
import pt from '../../messages/pt.json';

type Tree = { [key: string]: string | Tree };

function flatten(tree: Tree, prefix = ''): Record<string, string> {
  return Object.entries(tree).reduce<Record<string, string>>(
    (flat, [key, value]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      return typeof value === 'string'
        ? { ...flat, [path]: value }
        : { ...flat, ...flatten(value, path) };
    },
    {},
  );
}

/** Variables and rich text tags of a message: `{name}` and `<strong>`. */
function placeholders(message: string) {
  const variables = [...message.matchAll(/\{(\w+)(?:,|\})/g)].map(
    (match) => match[1],
  );
  const tags = [...message.matchAll(/<(\w+)>/g)].map(
    (match) => `<${match[1]}>`,
  );
  return [...new Set([...variables, ...tags])].sort();
}

const base = flatten(en);

describe.each([
  ['pt', pt],
  ['es', es],
])('messages (%s)', (_name, messages) => {
  const translated = flatten(messages);

  it('has exactly the keys of the base language', () => {
    expect(Object.keys(translated).sort()).toEqual(Object.keys(base).sort());
  });

  it('has no empty message', () => {
    const empty = Object.entries(translated)
      .filter(([, message]) => message.trim() === '')
      .map(([key]) => key);

    expect(empty).toEqual([]);
  });

  it('uses the same variables and tags as the base language', () => {
    const different = Object.entries(base)
      .filter(
        ([key, message]) =>
          placeholders(translated[key]).join() !== placeholders(message).join(),
      )
      .map(([key]) => key);

    expect(different).toEqual([]);
  });
});
