import { Clock, Quote } from 'lucide-react';
import type { ReactNode } from 'react';
import { CopyButton } from '@/components/copy-button';
import { InlineMarkdown } from '@/components/inline-markdown';
import type { DocumentLabels } from '@/i18n/document-labels';
import type { ChallengeContent } from '@/lib/types/challenge';
import { RequirementList } from './requirement-list';

export interface DocumentSection {
  id: string;
  title: string;
}

/** Sections present in the content (old challenges miss some). */
export function documentSections(
  content: ChallengeContent,
  labels: DocumentLabels,
): DocumentSection[] {
  return [
    {
      id: 'context',
      title: labels.context,
      show: content.context.length > 0,
    },
    {
      id: 'requirements',
      title: labels.requirements,
      show:
        content.functionalRequirements.length > 0 ||
        content.nonFunctionalRequirements.length > 0,
    },
    {
      id: 'what-to-use',
      title: labels.whatToUse,
      show: content.technologies.length > 0,
    },
    {
      id: 'deliverables',
      title: labels.deliverables,
      show: content.deliverables.length > 0,
    },
    { id: 'deadline', title: labels.deadline, show: !!content.deadline },
    {
      id: 'guide',
      title: labels.guide,
      show: content.implementationGuide.length > 0,
    },
    {
      id: 'evaluation',
      title: labels.evaluation,
      show: content.evaluationCriteria.length > 0,
    },
    {
      id: 'structure',
      title: labels.structure,
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
 * text (plus **bold** and `code`), never as HTML. The section titles come in
 * `labels`, in the language the challenge was written in.
 */
export function ChallengeDocument({
  content,
  labels,
  checklistKey,
}: {
  content: ChallengeContent;
  labels: DocumentLabels;
  /** Enables the requirements checklist (owner only). */
  checklistKey?: string;
}) {
  const sections = documentSections(content, labels);
  const index = (id: string) => sections.findIndex((item) => item.id === id);
  const has = (id: string) => index(id) >= 0;

  return (
    <div className="space-y-14">
      {has('context') && (
        <Section id="context" index={index('context')} title={labels.context}>
          <div className="space-y-4 leading-relaxed text-pretty text-muted-foreground">
            {content.context.map((paragraph) => (
              <p key={paragraph}>
                <InlineMarkdown text={paragraph} />
              </p>
            ))}
          </div>
        </Section>
      )}

      {has('requirements') && (
        <Section
          id="requirements"
          index={index('requirements')}
          title={labels.requirements}
        >
          <div className="space-y-8">
            {content.functionalRequirements.length > 0 && (
              <div>
                <h3 className="mb-3 font-medium">{labels.functional}</h3>
                <RequirementList
                  requirements={content.functionalRequirements}
                  storageKey={checklistKey}
                  progressLabel={labels.progress}
                />
              </div>
            )}
            {content.nonFunctionalRequirements.length > 0 && (
              <div>
                <h3 className="mb-3 font-medium">{labels.nonFunctional}</h3>
                <RequirementList
                  requirements={content.nonFunctionalRequirements}
                  progressLabel={labels.progress}
                />
              </div>
            )}
          </div>
        </Section>
      )}

      {has('what-to-use') && (
        <Section
          id="what-to-use"
          index={index('what-to-use')}
          title={labels.whatToUse}
        >
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

      {has('deliverables') && (
        <Section
          id="deliverables"
          index={index('deliverables')}
          title={labels.deliverables}
        >
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

      {has('deadline') && (
        <Section
          id="deadline"
          index={index('deadline')}
          title={labels.deadline}
        >
          <p className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-3 font-medium">
            <Clock className="size-4 text-brand" aria-hidden="true" />
            {content.deadline}
          </p>
        </Section>
      )}

      {has('guide') && (
        <Section id="guide" index={index('guide')} title={labels.guide}>
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

      {has('evaluation') && (
        <Section
          id="evaluation"
          index={index('evaluation')}
          title={labels.evaluation}
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

      {has('structure') && (
        <Section
          id="structure"
          index={index('structure')}
          title={labels.structure}
        >
          <div className="relative rounded-xl border bg-muted/50">
            <div className="absolute top-2 right-2">
              <CopyButton
                getText={content.folderStructure}
                label={labels.copyStructure}
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
