import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Label } from "@/types";
import { getLabels, addLabel, getLabelById, deleteLabel } from "@/actions/labels";
import { useSession } from "next-auth/react";

const LABELS_QUERY_KEY = ["labels"];

export function useLabels() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data: labels = [], isLoading, error } = useQuery({
    queryKey: LABELS_QUERY_KEY,
    queryFn: () => getLabels(userId as string),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  const addLabelMutation = useMutation({
    mutationFn: ({ name }: { name: string }) => addLabel(name, userId as string),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: LABELS_QUERY_KEY }),
  });

  // Note: getLabelById is a query, not a mutation
  const getLabelByIdQuery = (labelId: string) => useQuery({
    queryKey: ["label", labelId],
    queryFn: () => getLabelById(labelId),
    enabled: !!labelId,
  });

  const deleteLabelMutation = useMutation({
    mutationFn: (labelId: string) => deleteLabel(labelId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: LABELS_QUERY_KEY }),
  });

  return {
    labels,
    isLoading,
    error,
    addLabel: (name: string) => addLabelMutation.mutate({ name }),
    deleteLabel: (id: string) => deleteLabelMutation.mutate(id),
  };
}
