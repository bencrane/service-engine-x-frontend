import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function FilesPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Files
        </h1>
        <p className="mt-1 text-muted-foreground">
          Documents and deliverables shared with you
        </p>
      </header>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-center text-muted-foreground">
            No files yet. Documents will appear here as your projects progress.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
