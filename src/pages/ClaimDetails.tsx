import { useParams, Link } from "react-router-dom";
import { useClaimById, useUpdateClaimStatus } from "@/hooks/useClaims";
import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Calendar, DollarSign, User, FileText, Tag } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

const STATUSES = ["Submitted", "Under Review", "Approved", "Rejected"];

export default function ClaimDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: claim, isLoading } = useClaimById(id!);
  const updateStatus = useUpdateClaimStatus();
  const [newStatus, setNewStatus] = useState("");

  const handleUpdate = () => {
    if (!newStatus || !id) return;
    updateStatus.mutate({ id, status: newStatus });
    setNewStatus("");
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </AppLayout>
    );
  }

  if (!claim) {
    return (
      <AppLayout>
        <div className="text-center py-20 text-muted-foreground">
          <p>Claim not found</p>
          <Link to="/claims" className="text-primary hover:underline mt-2 inline-block">
            Back to Claims
          </Link>
        </div>
      </AppLayout>
    );
  }

  const details = [
    { label: "Customer Name", value: claim.customer_name, icon: User },
    { label: "Claim Amount", value: `$${Number(claim.claim_amount).toLocaleString()}`, icon: DollarSign },
    { label: "Claim Type", value: claim.claim_type, icon: Tag },
    { label: "Created", value: format(new Date(claim.created_at), "MMM d, yyyy h:mm a"), icon: Calendar },
    { label: "Updated", value: format(new Date(claim.updated_at), "MMM d, yyyy h:mm a"), icon: Calendar },
  ];

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <Link to="/claims">
            <Button variant="ghost" size="icon" className="rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Claim Details</h1>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <StatusBadge status={claim.status} />
            <span className="text-xs text-muted-foreground font-mono">ID: {claim.id.slice(0, 8)}</span>
          </div>

          <div className="grid gap-4">
            {details.map((d) => (
              <div key={d.label} className="flex items-center gap-3 p-3 rounded-lg bg-accent/30">
                <d.icon className="w-5 h-5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{d.label}</p>
                  <p className="text-sm font-medium text-foreground">{d.value}</p>
                </div>
              </div>
            ))}
            {claim.remarks && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/30">
                <FileText className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Remarks</p>
                  <p className="text-sm text-foreground">{claim.remarks}</p>
                </div>
              </div>
            )}
          </div>

          {/* Update Status */}
          <div className="border-t border-border pt-4">
            <p className="text-sm font-medium text-foreground mb-3">Update Status</p>
            <div className="flex gap-3">
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.filter((s) => s !== claim.status).map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleUpdate} disabled={!newStatus || updateStatus.isPending}>
                {updateStatus.isPending ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
