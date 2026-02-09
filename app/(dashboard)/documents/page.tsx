import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Documents</h1>
        <p className="mt-1 text-muted-foreground">
          Shared files and deliverables from your projects
        </p>
      </header>

      <Card>
        <CardContent className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            No documents yet. Files and deliverables will appear here as your projects progress.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
