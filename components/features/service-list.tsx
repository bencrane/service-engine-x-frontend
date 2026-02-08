import { Section, SectionList, SectionListItem } from "@/components/ui/section";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils";
import type { Service } from "@/types";

interface SingleServiceProps {
  readonly service: string;
}

export function SingleService({ service }: SingleServiceProps) {
  return (
    <Section title="Service">
      <p className="text-lg font-medium text-foreground">{service}</p>
    </Section>
  );
}

interface ServiceListProps {
  readonly services: ReadonlyArray<Service>;
}

export function ServiceList({ services }: ServiceListProps) {
  if (services.length === 0) {
    return null;
  }

  return (
    <SectionList title="Services">
      {services.map((service) => (
        <SectionListItem key={service.id}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h3 className="font-medium text-foreground">{service.name}</h3>
              {service.description && (
                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>
              )}
              {service.scheduledDate && (
                <p className="text-sm text-muted-foreground">
                  Scheduled: {formatDate(service.scheduledDate)}
                </p>
              )}
            </div>
            {service.status && <StatusBadge status={service.status} />}
          </div>
        </SectionListItem>
      ))}
    </SectionList>
  );
}
