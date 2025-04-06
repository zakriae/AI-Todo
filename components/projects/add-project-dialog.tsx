"use client";
import { useState } from "react";
import { PlusIcon, Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { useProjects } from "@/hooks/useProjects"; // Import our custom hook

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Project name must be at least 2 characters" }),
});

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
  const { toast } = useToast();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const { addProject } = useProjects();
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
    mode: "onChange"
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsAdding(true);
    try {
      // Use the mutation from our hook
      await addProject(values.name);
      
      toast({
        title: "🚀 Successfully created a project!",
        duration: 3000,
      });
      
      form.reset();
      // Close the dialog
      // document.getElementById("closeDialog")?.click();
      
      // Navigate to new project (optional)
      // Note: You might need to adjust this if your addProject hook doesn't return the ID directly
      // router.push(`/loggedin/projects/${projectId}`);
    } catch (error) {
      console.error("Error adding project:", error);
      toast({
        title: "❌ Failed to add project",
        description: (error as Error).message,
        duration: 3000,
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <DialogContent className="max-w-xl lg:h-56 flex flex-col md:flex-row lg:justify-between text-right">
      <DialogHeader className="w-full">
        <DialogTitle>Add a Project</DialogTitle>
        
        {/* Form moved outside of DialogDescription to fix nesting issue */}
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
                      className="border-0 font-semibold text-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit"
              disabled={isAdding || !form.formState.isValid} 
              className=""
            >
              {isAdding ? (
                <div className="flex gap-2">
                  <Loader className="h-5 w-5 text-primary animate-spin" />
                  <span>Adding...</span>
                </div>
              ) : (
                "Add"
              )}
            </Button>
          </form>
        </Form>
      </DialogHeader>
    </DialogContent>
  );
}