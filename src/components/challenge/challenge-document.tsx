import { Clock, Quote } from 'lucide-react';
import type { ReactNode } from 'react';
import { CopyButton } from '@/components/copy-button';
import { InlineMarkdown } from '@/components/inline-markdown';
import type { ChallengeContent } from '@/lib/types/challenge';
import { RequirementList } from './requirement-list';

export interface DocumentSection {
  id: string;
  title: string;
}

/** Sections present in the content (old challenges miss some). */
export function documentSections(content: ChallengeContent): DocumentSection[] {
  return [
    { id: 'contexto', title: 'Contexto', show: content.context.length > 0 },
    {
      id: 'requisitos',
      title: 'Requisitos',
      show:
        content.functionalRequirements.length > 0 ||
        content.nonFunctionalRequirements.length > 0,
    },
    {
      id: 'o-que-usar',
      title: 'O que usar',
      show: content.technologies.length > 0,
    },
    {
      id: 'entregas',
      title: 'Entregas',
      show: content.deliverables.length > 0,
    },
    { id: 'prazo', title: 'Tempo para conclusão', show: !!content.deadline },
    {
      id: 'guia',
      title: 'Guia de implementação',
      show: content.implementationGuide.length > 0,
    },
    {
      id: 'avaliacao',
      title: 'O que será avaliado',
      show: content.evaluationCriteria.length > 0,
    },
    {
      id: 'estrutura',
      title: 'Estrutura de pastas',
      show: !!content.folderStructure,
    },
  ]
    .filter(({ show }) => show)
    .map(({ id, title }) => ({ id, title }));
}

function Section({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24">
      <h2
        id={`${id}-title`}
        className="mb-4 flex items-baseline gap-3 text-xl font-semibold tracking-tight"
      >
        <span className="font-mono text-sm font-normal text-brand">
          {String(index + 1).padStart(2, '0')}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

/**
 * The challenge document. All text comes from the AI and is rendered as plain
 * text (plus **bold** and `code`), never as HTML.
 */
export function ChallengeDocument({
  content,
  checklistKey,
}: {
  content: ChallengeContent;
  /** Enables the requirements checklist (owner only). */
  checklistKey?: string;
}) {
  const sections = documentSections(content);
  const index = (id: string) => sections.findIndex((item) => item.id === id);
  const has = (id: string) => index(id) >= 0;

  return (
    <div className="space-y-14">
      {has('contexto') && (
        <Section id="contexto" index={index('contexto')} title="Contexto">
          <div className="space-y-4 leading-relaxed text-pretty text-muted-foreground">
            {content.context.map((paragraph) => (
              <p key={paragraph}>
                <InlineMarkdown text={paragraph} />
              </p>
            ))}
          </div>
        </Section>
      )}

      {has('requisitos') && (
        <Section id="requisitos" index={index('requisitos')} title="Requisitos">
          <div className="space-y-8">
            {content.functionalRequirements.length > 0 && (
              <div>
                <h3 className="mb-3 font-medium">Requisitos funcionais</h3>
                <RequirementList
                  requirements={content.functionalRequirements}
                  storageKey={checklistKey}
                />
              </div>
            )}
            {content.nonFunctionalRequirements.length > 0 && (
              <div>
                <h3 className="mb-3 font-medium">Requisitos não funcionais</h3>
                <RequirementList
                  requirements={content.nonFunctionalRequirements}
                />
              </div>
            )}
          </div>
        </Section>
      )}

      {has('o-que-usar') && (
        <Section id="o-que-usar" index={index('o-que-usar')} title="O que usar">
          <div className="grid gap-4 sm:grid-cols-2">
            {content.technologies.map((group) => (
              <div
                key={group.category}
                className="rounded-xl border bg-card p-4"
              >
                <h3 className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {group.category}
                </h3>
                <ul className="space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item.name} className="text-sm">
                      <span className="font-medium">{item.name}</span>
                      {item.purpose && (
                        <span className="block text-muted-foreground">
                          <InlineMarkdown text={item.purpose} />
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}

      {has('entregas') && (
        <Section id="entregas" index={index('entregas')} title="Entregas">
          <ul className="space-y-2">
            {content.deliverables.map((item) => (
              <li key={item} className="flex gap-3 text-sm">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                <span className="text-muted-foreground">
                  <InlineMarkdown text={item} />
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {has('prazo') && (
        <Section id="prazo" index={index('prazo')} title="Tempo para conclusão">
          <p className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-3 font-medium">
            <Clock className="size-4 text-brand" aria-hidden="true" />
            {content.deadline}
          </p>
        </Section>
      )}

      {has('guia') && (
        <Section id="guia" index={index('guia')} title="Guia de implementação">
          <div className="space-y-4">
            {content.implementationGuide.map((section, position) => (
              <div
                key={section.title}
                className="rounded-xl border bg-card p-5"
              >
                <h3 className="font-medium">
                  <span className="mr-2 font-mono text-sm text-muted-foreground">
                    {position + 1}.
                  </span>
                  {section.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  <InlineMarkdown text={section.description} />
                </p>
                {section.items.length > 0 && (
                  <ul className="mt-3 list-disc space-y-1.5 pl-4 text-sm text-muted-foreground marker:text-primary">
                    {section.items.map((item) => (
                      <li key={item}>
                        <InlineMarkdown text={item} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {has('avaliacao') && (
        <Section
          id="avaliacao"
          index={index('avaliacao')}
          title="O que será avaliado"
        >
          <ol className="space-y-3">
            {content.evaluationCriteria.map((criterion, position) => (
              <li key={criterion.title} className="flex gap-3 text-sm">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent font-mono text-xs text-accent-foreground">
                  {position + 1}
                </span>
                <span>
                  <span className="font-medium">{criterion.title}</span>
                  <span className="block text-muted-foreground">
                    <InlineMarkdown text={criterion.description} />
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {has('estrutura') && (
        <Section
          id="estrutura"
          index={index('estrutura')}
          title="Estrutura de pastas"
        >
          <div className="relative rounded-xl border bg-muted/50">
            <div className="absolute top-2 right-2">
              <CopyButton
                getText={content.folderStructure}
                label="Copiar estrutura"
                showLabel={false}
                size="icon-sm"
              />
            </div>
            <pre className="overflow-x-auto p-4 pr-12 font-mono text-[13px] leading-relaxed">
              {content.folderStructure}
            </pre>
          </div>
        </Section>
      )}

      {content.closingNote && (
        <figure className="flex gap-3 rounded-xl border-l-4 border-primary bg-accent/50 p-5">
          <Quote className="size-5 shrink-0 text-brand" aria-hidden="true" />
          <blockquote className="text-pretty italic">
            <InlineMarkdown text={content.closingNote} />
          </blockquote>
        </figure>
      )}
    </div>
  );
}
