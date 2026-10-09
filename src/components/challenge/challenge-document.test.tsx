import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ChallengeContent } from '@/lib/types/challenge';
import { ChallengeDocument, documentSections } from './challenge-document';

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
    expect(documentSections(content).map(({ id }) => id)).toEqual([
      'contexto',
      'requisitos',
      'o-que-usar',
      'entregas',
      'prazo',
      'estrutura',
    ]);
  });

  it('renders the sections with numbered headings', () => {
    render(<ChallengeDocument content={content} />);

    expect(
      screen.getByRole('heading', { level: 2, name: /Contexto/ }),
    ).toBeInTheDocument();
    expect(screen.getByText('10 minutos').tagName).toBe('STRONG');
    expect(screen.queryByText('Requisitos não funcionais')).toBeNull();
    expect(screen.getByText('Boa sorte!')).toBeInTheDocument();
  });

  it('shows the checklist only when a storage key is given', () => {
    const { rerender } = render(<ChallengeDocument content={content} />);
    expect(screen.queryByRole('checkbox')).toBeNull();

    rerender(<ChallengeDocument content={content} checklistKey="k" />);
    expect(
      screen.getByRole('checkbox', { name: 'Reserva' }),
    ).toBeInTheDocument();
  });
});
