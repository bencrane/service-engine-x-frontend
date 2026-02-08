import { Section } from "@/components/ui/section";

interface NotesSectionProps {
  readonly notes: string;
}

export function NotesSection({ notes }: NotesSectionProps) {
  return (
    <Section title="Notes">
      <p className="text-muted-foreground whitespace-pre-wrap">{notes}</p>
    </Section>
  );
}
