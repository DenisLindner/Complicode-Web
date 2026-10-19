import { render as renderBare, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactElement, ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import messages from '../../../messages/pt.json';
import type { ChallengeContent } from '@/lib/types/challenge';
import { ChallengeDocument, documentSections } from './challenge-document';

// The labels come in the language of the challenge (Portuguese here).
const labels = messages.document;

function Providers({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider locale="pt" messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

const render = (ui: ReactElement) => renderBare(ui, { wrapper: Providers });

const content: ChallengeContent = {
  context: ['Primeiro parágrafo.', 'Segundo parágrafo.'],
  functionalRequirements: [
    {
      title: 'Reserva',
      description: 'Reserva por **10 minutos**.',
      details: [],
    },
  ],
  nonFunctionalRequirements: [],
  technologies: [
    { category: 'Backend', items: [{ name: 'NestJS', purpose: 'API REST' }] },
  ],
  deliverables: ['README'],
  deadline: '1 semana',
  implementationGuide: [],
  evaluationCriteria: [],
  folderStructure: 'src/\n└── app/',
  closingNote: 'Boa sorte!',
};

describe('ChallengeDocument', () => {
  it('lists only the sections that have content', () => {
    expect(documentSections(content, labels).map(({ id }) => id)).toEqual([
      'context',
      'requirements',
      'what-to-use',
      'deliverables',
      'deadline',
      'structure',
    ]);
  });

  it('renders the sections with numbered headings', () => {
    render(<ChallengeDocument content={content} labels={labels} />);

    expect(
      screen.getByRole('heading', { level: 2, name: /Contexto/ }),
    ).toBeInTheDocument();
    expect(screen.getByText('10 minutos').tagName).toBe('STRONG');
    expect(screen.queryByText('Requisitos não funcionais')).toBeNull();
    expect(screen.getByText('Boa sorte!')).toBeInTheDocument();
  });

  it('shows the checklist only when a storage key is given', () => {
    const { rerender } = render(
      <ChallengeDocument content={content} labels={labels} />,
    );
    expect(screen.queryByRole('checkbox')).toBeNull();

    rerender(
      <ChallengeDocument content={content} labels={labels} checklistKey="k" />,
    );
    expect(
      screen.getByRole('checkbox', { name: 'Reserva' }),
    ).toBeInTheDocument();
  });
});
