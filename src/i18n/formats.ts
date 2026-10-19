/**
 * Named formats, used as `format.dateTime(date, 'short')`. The time zone is
 * fixed (set in request.ts) so the server and the browser print the same
 * text and hydration never mismatches.
 */
export const formats = {
  dateTime: {
    short: { day: '2-digit', month: 'short', year: 'numeric' },
    shortWithTime: {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    },
  },
  number: {
    // Payments are charged in reais (AbacatePay).
    brl: { style: 'currency', currency: 'BRL' },
  },
} as const;

export const TIME_ZONE = 'America/Sao_Paulo';
