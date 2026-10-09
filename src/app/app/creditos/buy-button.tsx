'use client';

import { Loader2, Lock } from 'lucide-react';
import { useState, useTransition } from 'react';
import { startCheckout } from '@/actions/payments';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export function BuyButton() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string>();

  const buy = () => {
    setError(undefined);
    startTransition(async () => {
      // On success the action redirects to the AbacatePay checkout.
      const result = await startCheckout();
      setError(result.error);
    });
  };

  return (
    <div className="space-y-3">
      <Button size="lg" className="w-full" onClick={buy} disabled={pending}>
        {pending ? <Loader2 className="animate-spin" /> : <Lock />}
        {pending ? 'Abrindo o pagamento…' : 'Comprar com PIX ou cartão'}
      </Button>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
