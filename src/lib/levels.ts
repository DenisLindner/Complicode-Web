import type { ChallengeLevel } from './types/challenge';

/** Same scope the API asks the model for (src/ai/prompts/challenge.prompt.ts). */
export const LEVELS: Record<
  ChallengeLevel,
  { label: string; deadline: string; description: string }
> = {
  INTERN: {
    label: 'Estagiário',
    deadline: '3 a 5 dias',
    description:
      'Fundamentos da linguagem e do framework, regras de negócio simples e validação.',
  },
  JUNIOR: {
    label: 'Júnior',
    deadline: '1 a 2 semanas',
    description:
      'Autenticação, persistência, tratamento de erros, uma integração externa e testes.',
  },
  MID: {
    label: 'Pleno',
    deadline: '2 a 3 semanas',
    description:
      'Integrações resilientes, filas ou processamento assíncrono, cache e concorrência.',
  },
  SENIOR: {
    label: 'Sênior',
    deadline: '3 a 4 semanas',
    description:
      'Escala, disponibilidade, observabilidade e arquitetura com trade-offs documentados.',
  },
};

export const LEVEL_ORDER: ChallengeLevel[] = [
  'INTERN',
  'JUNIOR',
  'MID',
  'SENIOR',
];
