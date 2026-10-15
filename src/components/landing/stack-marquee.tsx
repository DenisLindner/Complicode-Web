import {
  siAngular,
  siDjango,
  siDotnet,
  siFastapi,
  siFlutter,
  siGin,
  siLaravel,
  siNestjs,
  siNextdotjs,
  siPandas,
  siPytorch,
  siReact,
  siSpringboot,
  siSwift,
  siVuedotjs,
  type SimpleIcon,
} from 'simple-icons';

const FRAMEWORKS: { name: string; icon: SimpleIcon }[] = [
  { name: 'NestJS', icon: siNestjs },
  { name: 'Spring Boot', icon: siSpringboot },
  { name: 'FastAPI', icon: siFastapi },
  { name: 'ASP.NET Core', icon: siDotnet },
  { name: 'Django', icon: siDjango },
  { name: 'Laravel', icon: siLaravel },
  { name: 'Gin', icon: siGin },
  { name: 'React', icon: siReact },
  { name: 'Next.js', icon: siNextdotjs },
  { name: 'Angular', icon: siAngular },
  { name: 'Vue', icon: siVuedotjs },
  { name: 'Flutter', icon: siFlutter },
  { name: 'React Native', icon: siReact },
  { name: 'SwiftUI', icon: siSwift },
  { name: 'Pandas', icon: siPandas },
  { name: 'PyTorch', icon: siPytorch },
];

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-10 pr-10"
    >
      {FRAMEWORKS.map(({ name, icon }) => (
        <li
          key={name}
          className="flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="size-5 fill-current"
          >
            <path d={icon.path} />
          </svg>
          <span className="text-sm font-medium whitespace-nowrap">{name}</span>
        </li>
      ))}
    </ul>
  );
}

/** Endless strip of the supported frameworks; pauses on hover. */
export function StackMarquee() {
  return (
    <section
      aria-label="Frameworks disponíveis"
      className="group overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)] py-10"
    >
      <div className="flex w-max marquee group-hover:[animation-play-state:paused]">
        <Row />
        <Row hidden />
      </div>
    </section>
  );
}
