import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type Claim = {
  id: string;
  customer_name: string;
  claim_amount: number;
  claim_type: string;
  status: string;
  remarks: string | null;
  created_at: string;
  updated_at: string;
};

export type NewClaim = {
  customer_name: string;
  claim_amount: number;
  claim_type: string;
  status?: string;
  remarks?: string;
};

export function useClaims() {
  return useQuery({
    queryKey: ["claims"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("claims")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Claim[];
    },
  });
}

export function useClaimById(id: string) {
  return useQuery({
    queryKey: ["claims", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("claims")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Claim;
    },
  });
}

export function useAddClaim() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (claim: NewClaim) => {
      const { data, error } = await supabase.from("claims").insert(claim).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["claims"] });
      toast.success("Claim added successfully");
    },
    onError: () => {
      toast.error("Failed to add claim");
    },
  });
}

export function useUpdateClaimStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("claims").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["claims"] });
      toast.success("Status updated");
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });
}
