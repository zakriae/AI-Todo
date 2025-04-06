import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useToast } from "../ui/use-toast";
import { useProjects } from "@/hooks/useProjects";
import { GET_STARTED_PROJECT_ID } from "@/utils";

export default function DeleteProject({
  projectId,
}: {
  projectId?: string;
}) {
  const form = useForm({ defaultValues: { name: "" } });
  const { toast } = useToast();
  const router = useRouter();
  const { deleteProject } = useProjects();

  const onSubmit = async () => {
    if (!projectId) {
      toast({
        title: "❌ Error",
        description: "No project ID provided",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    if (projectId === GET_STARTED_PROJECT_ID) {
      toast({
        title: "🤗 Just a reminder",
        description: "System projects are protected from deletion.",
        duration: 3000,
      });
    } else {
      try {
        // Use the deleteProject method from the useProjects hook
        await deleteProject(projectId);
        
        toast({
          title: "🗑️ Successfully deleted the project",
          duration: 3000,
        });
        
        // Redirect to projects page after deletion
        router.push("/loggedin/projects");
        router.refresh();
      } catch (error) {
        toast({
          title: "❌ Failed to delete the project",
          description: error instanceof Error ? error.message : "Unknown error",
          variant: "destructive",
          duration: 3000,
        });
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisIcon className="h-5 w-5" aria-label="Delete Project" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Delete Project</DropdownMenuLabel>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <button 
            type="submit"
            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}