import { cn } from "@/lib/utils";

const statusConfig: Record<string, { bg: string; text: string }> = {
  Approved: { bg: "bg-[hsl(var(--success))]/15", text: "text-[hsl(var(--success))]" },
  Rejected: { bg: "bg-destructive/15", text: "text-destructive" },
  "Under Review": { bg: "bg-[hsl(var(--warning))]/15", text: "text-[hsl(var(--warning))]" },
  Submitted: { bg: "bg-muted", text: "text-muted-foreground" },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? statusConfig.Submitted;
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        config.bg,
        config.text
      )}
    >
      {status}
    </span>
  );
}
