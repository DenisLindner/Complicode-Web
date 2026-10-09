import { Fragment } from 'react';

const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`)/g;

/**
 * Renders the only markdown the generated texts use: **bold** and `code`.
 * Everything else is plain text escaped by React, so content written by the
 * AI can never inject HTML.
 */
export function InlineMarkdown({ text }: { text: string }) {
  return text.split(TOKEN).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={index} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={index}
          className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.85em] [overflow-wrap:anywhere] text-foreground"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
}
