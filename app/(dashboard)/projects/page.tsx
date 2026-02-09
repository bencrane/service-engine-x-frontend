import { Suspense } from "react";
import { FolderKanban } from "lucide-react";
import { fetchProjects, ApiError } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PROJECT_PHASES } from "@/types";
import type { Project } from "@/types";

export default function ProjectsPage() {
  return (
    <Suspense fallback={<ProjectsSkeleton />}>
      <ProjectsContent />
    </Suspense>
  );
}

async function ProjectsContent() {
  let projects: ReadonlyArray<Project> = [];
  let error: string | null = null;

  try {
    projects = await fetchProjects().catch(() => []);
  } catch (err) {
    if (err instanceof ApiError) {
      error = err.message;
    } else {
      error = "Failed to load projects";
    }
  }

  if (error) {
    return (
      <EmptyState
        title="Unable to load projects"
        description={error}
        action={{ label: "Try again", href: "/projects" }}
      />
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Projects
        </h1>
        <p className="mt-1 text-muted-foreground">
          Track progress across all your active projects
        </p>
      </header>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <FolderKanban className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-center text-muted-foreground">
              No projects yet. Projects will appear here once your engagement begins.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <ProjectRow key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectRow({ project }: { readonly project: Project }) {
  const currentPhase = PROJECT_PHASES.find((p) => p.id === project.phaseId);

  return (
    <Card className="transition-colors hover:bg-accent/50">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-foreground">{project.name}</h3>
            {project.description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {project.description}
              </p>
            )}
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-foreground">
              {currentPhase?.label}
            </span>
            <p className="mt-1 text-xs text-muted-foreground">
              Phase {project.phaseId} of 6
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex h-1.5 overflow-hidden rounded-full bg-muted">
            {PROJECT_PHASES.map((phase, index) => (
              <div
                key={phase.id}
                className={`flex-1 ${
                  index < project.phaseId ? "bg-primary" : "bg-transparent"
                } ${index > 0 ? "ml-0.5" : ""}`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectsSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <div className="h-8 w-32 rounded bg-muted animate-pulse" />
        <div className="mt-2 h-4 w-64 rounded bg-muted animate-pulse" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <div className="h-5 w-48 rounded bg-muted animate-pulse" />
                  <div className="h-4 w-72 rounded bg-muted animate-pulse" />
                </div>
                <div className="h-5 w-20 rounded bg-muted animate-pulse" />
              </div>
              <div className="mt-4 h-1.5 rounded-full bg-muted animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
