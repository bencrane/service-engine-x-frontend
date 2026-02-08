import { Section } from "@/components/ui/section";
import type { Client } from "@/types";

interface ClientInfoProps {
  readonly client?: Client;
  readonly clientName?: string;
}

export function ClientInfo({ client, clientName }: ClientInfoProps) {
  const name = client?.name ?? clientName ?? "Unknown Client";
  const email = client?.email;
  const phone = client?.phone;
  const address = client?.address;

  return (
    <Section title="Client">
      <div className="space-y-1">
        <p className="text-lg font-medium text-foreground">{name}</p>
        {email && (
          <p className="text-muted-foreground">
            <a href={`mailto:${email}`} className="hover:underline">
              {email}
            </a>
          </p>
        )}
        {phone && (
          <p className="text-muted-foreground">
            <a href={`tel:${phone}`} className="hover:underline">
              {phone}
            </a>
          </p>
        )}
        {address && <p className="text-muted-foreground">{address}</p>}
      </div>
    </Section>
  );
}
