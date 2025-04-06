import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Project } from "@/types";
import { getProjects, addProject, deleteProject } from "@/actions/projects";
import { useSession } from "next-auth/react";

const PROJECTS_QUERY_KEY = ["projects"];

export function useProjects() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: PROJECTS_QUERY_KEY,
    queryFn: () => getProjects(userId as string),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  const addProjectMutation = useMutation({
    mutationFn: ({ name }: { name: string }) => addProject(name, userId as string),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY }),
  });

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY }),
  });

  return {
    projects,
    isLoading,
    error,
    addProject: (name: string) => addProjectMutation.mutate({ name }),
    deleteProject: (id: string) => deleteProjectMutation.mutate(id),
  };
}
