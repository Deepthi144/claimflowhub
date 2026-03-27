import { useState } from "react";
import { useAddClaim, type NewClaim } from "@/hooks/useClaims";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const claimTypes = ["Health", "Auto", "Property", "Life", "Travel", "Other"];

export function AddClaimDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const addClaim = useAddClaim();
  const [form, setForm] = useState<NewClaim>({
    customer_name: "",
    claim_amount: 0,
    claim_type: "",
    remarks: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customer_name.trim() || !form.claim_type || form.claim_amount <= 0) return;
    addClaim.mutate(form, {
      onSuccess: () => {
        onOpenChange(false);
        setForm({ customer_name: "", claim_amount: 0, claim_type: "", remarks: "" });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Claim</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Customer Name</Label>
            <Input
              id="name"
              value={form.customer_name}
              onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
              placeholder="Enter customer name"
              required
              maxLength={255}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Claim Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              min={0.01}
              step={0.01}
              value={form.claim_amount || ""}
              onChange={(e) => setForm({ ...form, claim_amount: parseFloat(e.target.value) || 0 })}
              placeholder="Enter amount"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Claim Type</Label>
            <Select
              value={form.claim_type}
              onValueChange={(v) => setForm({ ...form, claim_type: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {claimTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={form.remarks}
              onChange={(e) => setForm({ ...form, remarks: e.target.value })}
              placeholder="Optional remarks..."
              maxLength={1000}
              rows={3}
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={addClaim.isPending}>
              {addClaim.isPending ? "Adding..." : "Add Claim"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
