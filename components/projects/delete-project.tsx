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
import { deleteProjectAndItsTasks } from "@/actions/projects"; // Updated import statement
import { ObjectId } from "mongodb";
import { GET_STARTED_PROJECT_ID } from "@/utils";

export default function DeleteProject({
  projectId,
}: {
  projectId: ObjectId;
}) {
  const form = useForm({ defaultValues: { name: "" } });
  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = async () => {
    if (projectId.toString() === GET_STARTED_PROJECT_ID) {
      toast({
        title: "🤗 Just a reminder",
        description: "System projects are protected from deletion.",
        duration: 3000,
      });
    } else {
      const deleteTaskId = await deleteProjectAndItsTasks(projectId);

      if (deleteTaskId !== undefined) {
        toast({
          title: "🗑️ Successfully deleted the project",
          duration: 3000,
        });
        router.refresh();
      } else {
        toast({
          title: "❌ Failed to delete the project",
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
      <DropdownMenuContent>
        <DropdownMenuLabel>Delete Project</DropdownMenuLabel>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <button type="submit">
            <Trash2 className="h-5 w-5" />
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}