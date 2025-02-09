"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { addLabel } from "@/actions/labels"; // Import your server action
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Loader } from "lucide-react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react"; // Import useSession from next-auth

export default function AddLabelDialog() {
  const { data: session } = useSession(); // Get the current session
  const form = useForm({ defaultValues: { name: "" } });
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async ({ name }: any) => {
    setIsLoading(true);
    try {
      if (session?.user?.id) {
        const labelId = await addLabel(name, session.user.id);
        if (labelId) {
          toast({
            title: "😎 Successfully created a Label!",
            duration: 5000,
          });
          form.reset();
          // Close the dialog
          document.getElementById("closeDialog")?.click();
        }
      }
    } catch (error) {
      console.error("Error adding label:", error);
      toast({
        title: "❌ Failed to add label",
        description: (error as Error).message,
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent className="max-w-xl lg:h-56 flex flex-col md:flex-row lg:justify-between text-right">
      <DialogHeader className="w-full">
        <DialogTitle>Add a Label</DialogTitle>
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
                        placeholder="Label name"
                        required
                        className="border-0 font-semibold text-lg"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button disabled={isLoading} className="">
                {isLoading ? (
                  <div className="flex gap-2">
                    <Loader className="h-5 w-5 text-primary" />
                  </div>
                ) : (
                  "Add"
                )}
              </Button>
            </form>
          </Form>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
}