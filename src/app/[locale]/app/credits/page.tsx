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
import { getFormatter, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { asLocale } from '@/i18n/locale';
import { PaginationLinks, parsePage } from '@/components/pagination-links';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/i18n/navigation';
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

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/app/credits'>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: asLocale(locale),
    namespace: 'credits',
  });
  return { title: t('meta') };
}

const LIMIT = 10;

const TRANSACTION_ICONS: Record<CreditTransactionType, LucideIcon> = {
  SIGNUP_BONUS: Gift,
  PURCHASE: ArrowDownLeft,
  CHALLENGE_GENERATION: Sparkles,
  REFUND: RotateCcw,
  PURCHASE_REFUND: ArrowUpRight,
};

const PAYMENT_STATUS_STYLE: Record<PaymentStatus, string> = {
  PENDING: 'text-brand',
  PAID: 'text-success',
  CANCELLED: 'text-muted-foreground',
  REFUNDED: 'text-destructive',
};

export default async function CreditsPage({
  searchParams,
}: PageProps<'/[locale]/app/credits'>) {
  const [query, t, format] = await Promise.all([
    searchParams,
    getTranslations('credits'),
    getFormatter(),
  ]);
  const money = (cents: number) => format.number(cents / 100, 'brl');
  const dateTime = (iso: string) =>
    format.dateTime(new Date(iso), 'shortWithTime');
  const page = parsePage(query.page);
  const paymentId = typeof query.payment === 'string' ? query.payment : null;

  const [user, transactions, payments, returning] = await Promise.all([
    requireUser(),
    listTransactions(page, LIMIT),
    listPayments(),
    paymentId ? getPayment(paymentId) : null,
  ]);
  const unitPrice = money(CREDIT_PACKAGE.amountCents / CREDIT_PACKAGE.credits);

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t('title')}
        </h1>
        <p className="text-muted-foreground">{t('lead')}</p>
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
              {t('balance')}
            </p>
            <p className="mt-2 font-mono text-5xl font-semibold tabular-nums">
              {user.credits}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t('available', { count: user.credits })}
            </p>
            {!user.verified && (
              <Link
                href="/welcome"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand underline-offset-4 hover:underline"
              >
                <Gift className="size-4" aria-hidden="true" />
                {t('verify')}
              </Link>
            )}
          </section>

          <section className="relative overflow-hidden rounded-2xl border border-primary/40 bg-card p-6">
            <div className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-primary/15 blur-2xl" />
            <div className="relative space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-brand">
                    {t('package')}
                  </p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight">
                    {t('packageAmount', { count: CREDIT_PACKAGE.credits })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-2xl font-semibold">
                    {money(CREDIT_PACKAGE.amountCents)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('perChallenge', { price: unitPrice })}
                  </p>
                </div>
              </div>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>• {t('perk1')}</li>
                <li>• {t('perk2')}</li>
                <li>• {t('perk3')}</li>
              </ul>
              <BuyButton />
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                {t('payNote')}
              </p>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border bg-card">
            <h2 className="border-b px-5 py-4 font-semibold">{t('history')}</h2>
            {transactions.items.length > 0 ? (
              <ul className="divide-y">
                {transactions.items.map((item) => {
                  const Icon = TRANSACTION_ICONS[item.type];
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
                        <p className="truncate text-sm font-medium">
                          {t(`tx.${item.type}`)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {dateTime(item.createdAt)}
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
                          {t('balanceAfter', { balance: item.balanceAfter })}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="px-5 py-10 text-center text-sm text-muted-foreground">
                {t('historyEmpty')}
              </p>
            )}
            <div className="px-5 pb-4">
              <PaginationLinks
                page={page}
                total={transactions.total}
                limit={LIMIT}
                basePath="/app/credits"
              />
            </div>
          </section>

          {payments.length > 0 && (
            <section className="rounded-2xl border bg-card">
              <h2 className="border-b px-5 py-4 font-semibold">
                {t('payments')}
              </h2>
              <ul className="divide-y">
                {payments.map((payment) => (
                  <li
                    key={payment.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm"
                  >
                    <div>
                      <p className="font-medium">
                        {t('paymentLine', {
                          credits: payment.credits,
                          price: money(payment.amountCents),
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {dateTime(payment.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {payment.checkoutUrl && (
                        <a
                          href={payment.checkoutUrl}
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-brand underline-offset-4 hover:underline"
                        >
                          {t('continuePayment')}
                          <ExternalLink className="size-3" aria-hidden="true" />
                        </a>
                      )}
                      <Badge
                        variant="outline"
                        className={PAYMENT_STATUS_STYLE[payment.status]}
                      >
                        {t(`status.${payment.status}`)}
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
