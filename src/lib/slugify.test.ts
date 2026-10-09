import { describe, expect, it } from 'vitest';
import { slugify } from './slugify';

describe('slugify', () => {
  it.each([
    ['TicketFlow', 'ticketflow'],
    ['MeetingInsight AI · v2', 'meetinginsight-ai-v2'],
    ['Gestão de Sinistros', 'gestao-de-sinistros'],
    ['../../etc/passwd', 'etc-passwd'],
    ['"; rm -rf', 'rm-rf'],
    ['***', 'desafio'],
  ])('%s -> %s', (value, expected) => {
    expect(slugify(value)).toBe(expected);
  });
});
