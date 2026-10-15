import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { delay } from '@/lib/motion';
import { ProductShot } from './product-shot';
import { Scribble } from './scribble';

export function Hero() {
  return (
    <section className="px-2 pt-2 sm:px-4">
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-cream bg-[radial-gradient(900px_circle_at_50%_100%,color-mix(in_oklch,var(--primary)_32%,transparent),transparent_70%)]">
        <div className="absolute inset-0 -z-10 bg-dots [mask-image:radial-gradient(ellipse_at_50%_0%,#000_20%,transparent_70%)]" />

        <div className="mx-auto flex max-w-4xl flex-col items-center px-5 pt-12 text-center sm:pt-16">
          <h1
            style={delay(80)}
            className="rise text-[2.6rem] leading-[1.02] font-bold tracking-[-0.03em] text-balance sm:text-6xl lg:text-[4.25rem]"
          >
            Chega de to-do list.
            <span className="block text-brand">
              Pratique com problemas reais.
            </span>
          </h1>
          <p
            style={delay(160)}
            className="mt-6 max-w-xl rise text-lg text-pretty text-muted-foreground sm:text-xl"
          >
            Desafios técnicos na sua stack e no seu nível, com contexto de
            empresa, requisitos, prazo e o que um revisor sênior cobraria no seu
            código.
          </p>
          <div
            style={delay(240)}
            className="mt-9 flex w-full rise flex-col items-center gap-3 sm:w-auto sm:flex-row"
          >
            <Button asChild size="xl" className="w-full sm:w-auto">
              <Link href="/cadastro">
                Gerar meu primeiro desafio
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button
              asChild
              size="xl"
              variant="ghost"
              className="w-full hover:bg-foreground/5 sm:w-auto"
            >
              <Link href="/explorar">Ver exemplos</Link>
            </Button>
          </div>
          <p
            style={delay(320)}
            className="mt-4 rise text-sm text-muted-foreground"
          >
            2 desafios grátis ao confirmar email e telefone · sem cartão
          </p>
        </div>

        <div className="relative mx-auto mt-14 max-w-5xl px-3 sm:mt-20 sm:px-8">
          <Scribble
            style={delay(1100)}
            className="-top-24 right-6 hidden sm:block lg:right-16"
          >
            um briefing de empresa, não um exercício solto
          </Scribble>
          <ProductShot className="rise-zoom [--d:400ms]" />
        </div>
      </div>
    </section>
  );
}
