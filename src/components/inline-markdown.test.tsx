import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { InlineMarkdown } from './inline-markdown';

describe('InlineMarkdown', () => {
  it('renders bold and code', () => {
    const { container } = render(
      <p>
        <InlineMarkdown text="Use **JWT** no header `Authorization`." />
      </p>,
    );

    expect(container.querySelector('strong')?.textContent).toBe('JWT');
    expect(container.querySelector('code')?.textContent).toBe('Authorization');
    expect(container.textContent).toBe('Use JWT no header Authorization.');
  });

  it('never turns generated text into HTML', () => {
    const { container } = render(
      <p>
        <InlineMarkdown
          text={'<img src=x onerror=alert(1)> **<script>x</script>**'}
        />
      </p>,
    );

    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('script')).toBeNull();
    expect(container.textContent).toContain('<img src=x onerror=alert(1)>');
  });

  it('keeps unmatched markers as text', () => {
    const { container } = render(
      <p>
        <InlineMarkdown text="2 ** 3 e um ` solto" />
      </p>,
    );

    expect(container.textContent).toBe('2 ** 3 e um ` solto');
  });
});
