"use client";
import { PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { addProject } from "@/actions/projects"; // Import your server action

export default function AddProjectDialog() {
  return (
    <Dialog>
      <DialogTrigger id="closeDialog">
        <PlusIcon className="h-5 w-5" aria-label="Add a Project" />
      </DialogTrigger>
      <AddProjectDialogContent />
    </Dialog>
  );
}

function AddProjectDialogContent() {
  const form = useForm({ defaultValues: { name: "" } });
  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = async ({ name }: any) => {
    try {
      const projectId = await addProject(name);
      if (projectId) {
        toast({
          title: "🚀 Successfully created a project!",
          duration: 3000,
        });
        form.reset({ name: "" });
        router.push(`/loggedin/projects/${projectId}`);
      }
    } catch (error) {
      toast({
        title: "❌ Failed to add project",
        description: (error as Error).message,
        duration: 3000,
      });
    }
  };

  return (
    <DialogContent className="max-w-xl lg:h-56 flex flex-col md:flex-row lg:justify-between text-right">
      <DialogHeader className="w-full">
        <DialogTitle>Add a Project</DialogTitle>
        <DialogDescription className="capitalize">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-2 border-2 p-6 border-gray-200 my-2 rounded-sm border-foreground/20"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Project name"
                        required
                        className="border-0 font-semibold text-lg"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
              <Button className="">Add</Button>
            </form>
          </Form>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
}