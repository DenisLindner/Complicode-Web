import {
  ArrowDownLeft,
  ArrowUpRight,
  Coins,
  ExternalLink,
  Gift,
  type LucideIcon,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PaginationLinks, parsePage } from '@/components/pagination-links';
import { Badge } from '@/components/ui/badge';
import { formatCents, formatDateTime } from '@/lib/format';
import {
  getPayment,
  listPayments,
  listTransactions,
} from '@/lib/server/credits';
import { requireUser } from '@/lib/server/dal';
import {
  CREDIT_PACKAGE,
  type CreditTransactionType,
  type PaymentStatus,
} from '@/lib/types/credits';
import { cn } from '@/lib/utils';
import { BuyButton } from './buy-button';
import { PaymentReturn } from './payment-return';

export const metadata: Metadata = { title: 'Créditos' };

const LIMIT = 10;

const TRANSACTION_LABELS: Record<
  CreditTransactionType,
  { label: string; icon: LucideIcon }
> = {
  SIGNUP_BONUS: { label: 'Bônus de verificação', icon: Gift },
  PURCHASE: { label: 'Compra de créditos', icon: ArrowDownLeft },
  CHALLENGE_GENERATION: { label: 'Desafio gerado', icon: Sparkles },
  REFUND: { label: 'Estorno de geração que falhou', icon: RotateCcw },
  PURCHASE_REFUND: { label: 'Reembolso de compra', icon: ArrowUpRight },
};

const PAYMENT_STATUS: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  PENDING: { label: 'Pendente', className: 'text-brand' },
  PAID: { label: 'Pago', className: 'text-success' },
  CANCELLED: { label: 'Cancelado', className: 'text-muted-foreground' },
  REFUNDED: { label: 'Reembolsado', className: 'text-destructive' },
};

export default async function CreditsPage({
  searchParams,
}: PageProps<'/app/creditos'>) {
  const query = await searchParams;
  const page = parsePage(query.page);
  const paymentId = typeof query.payment === 'string' ? query.payment : null;

  const [user, transactions, payments, returning] = await Promise.all([
    requireUser(),
    listTransactions(page, LIMIT),
    listPayments(),
    paymentId ? getPayment(paymentId) : null,
  ]);
  const unitPrice = formatCents(
    CREDIT_PACKAGE.amountCents / CREDIT_PACKAGE.credits,
  );

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Créditos
        </h1>
        <p className="text-muted-foreground">
          Cada desafio custa 1 crédito. Regerar é grátis.
        </p>
      </div>

      {returning && (
        <PaymentReturn
          paymentId={returning.id}
          initialStatus={returning.status}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="space-y-6">
          <section className="rounded-2xl border bg-card p-6">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Coins className="size-4 text-brand" aria-hidden="true" />
              Seu saldo
            </p>
            <p className="mt-2 font-mono text-5xl font-semibold tabular-nums">
              {user.credits}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {user.credits === 1
                ? 'crédito disponível'
                : 'créditos disponíveis'}
            </p>
            {!user.verified && (
              <Link
                href="/boas-vindas"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand underline-offset-4 hover:underline"
              >
                <Gift className="size-4" aria-hidden="true" />
                Verifique email e telefone e ganhe 2 grátis
              </Link>
            )}
          </section>

          <section className="relative overflow-hidden rounded-2xl border border-primary/40 bg-card p-6">
            <div className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-primary/15 blur-2xl" />
            <div className="relative space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-brand">
                    Pacote de créditos
                  </p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight">
                    {CREDIT_PACKAGE.credits} créditos
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-2xl font-semibold">
                    {formatCents(CREDIT_PACKAGE.amountCents)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {unitPrice} por desafio
                  </p>
                </div>
              </div>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>• 10 desafios completos, em qualquer stack e nível</li>
                <li>• Cada um pode ser regerado uma vez, de graça</li>
                <li>• Os créditos não expiram</li>
              </ul>
              <BuyButton />
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                Pagamento pela AbacatePay. Não guardamos dados do seu cartão.
              </p>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border bg-card">
            <h2 className="border-b px-5 py-4 font-semibold">Extrato</h2>
            {transactions.items.length > 0 ? (
              <ul className="divide-y">
                {transactions.items.map((item) => {
                  const { label, icon: Icon } = TRANSACTION_LABELS[item.type];
                  const positive = item.amount > 0;
                  return (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 px-5 py-3"
                    >
                      <span
                        className={cn(
                          'flex size-8 shrink-0 items-center justify-center rounded-lg',
                          positive
                            ? 'bg-success/10 text-success'
                            : 'bg-muted text-muted-foreground',
                        )}
                      >
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{label}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(item.createdAt)}
                        </p>
                      </div>
                      <div className="text-right font-mono">
                        <p
                          className={cn(
                            'text-sm font-semibold tabular-nums',
                            positive ? 'text-success' : 'text-foreground',
                          )}
                        >
                          {positive ? '+' : ''}
                          {item.amount}
                        </p>
                        <p className="text-xs text-muted-foreground tabular-nums">
                          saldo {item.balanceAfter}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="px-5 py-10 text-center text-sm text-muted-foreground">
                Nenhuma movimentação ainda.
              </p>
            )}
            <div className="px-5 pb-4">
              <PaginationLinks
                page={page}
                total={transactions.total}
                limit={LIMIT}
                basePath="/app/creditos"
              />
            </div>
          </section>

          {payments.length > 0 && (
            <section className="rounded-2xl border bg-card">
              <h2 className="border-b px-5 py-4 font-semibold">Pagamentos</h2>
              <ul className="divide-y">
                {payments.map((payment) => (
                  <li
                    key={payment.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm"
                  >
                    <div>
                      <p className="font-medium">
                        {payment.credits} créditos ·{' '}
                        {formatCents(payment.amountCents)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(payment.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {payment.checkoutUrl && (
                        <a
                          href={payment.checkoutUrl}
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-brand underline-offset-4 hover:underline"
                        >
                          Continuar pagamento
                          <ExternalLink className="size-3" aria-hidden="true" />
                        </a>
                      )}
                      <Badge
                        variant="outline"
                        className={PAYMENT_STATUS[payment.status].className}
                      >
                        {PAYMENT_STATUS[payment.status].label}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
