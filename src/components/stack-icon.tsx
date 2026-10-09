import {
  BrainCircuit,
  Code2,
  Layers,
  type LucideIcon,
  MonitorSmartphone,
  PanelsTopLeft,
  Server,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  backend: Server,
  frontend: PanelsTopLeft,
  fullstack: Layers,
  mobile: MonitorSmartphone,
  data: BrainCircuit,
};

export function StackIcon({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const Icon = ICONS[slug] ?? Code2;
  return <Icon className={className} aria-hidden="true" />;
}
