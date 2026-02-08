import { Badge, type BadgeProps } from "./badge";
import { formatStatus } from "@/lib/utils";

type StatusVariant = BadgeProps["variant"];

const STATUS_VARIANT_MAP: Record<string, StatusVariant> = {
  // Order statuses
  pending: "warning",
  confirmed: "info",
  in_progress: "purple",
  active: "purple",
  completed: "success",
  cancelled: "destructive",
  // Proposal statuses
  draft: "secondary",
  sent: "info",
  viewed: "warning",
  signed: "success",
  declined: "destructive",
  approved: "success",
};

interface StatusBadgeProps {
  readonly status: string;
  readonly className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();
  const variant = STATUS_VARIANT_MAP[normalizedStatus] ?? "secondary";

  return (
    <Badge variant={variant} className={className}>
      {formatStatus(status)}
    </Badge>
  );
}
