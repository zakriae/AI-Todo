"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Loader } from "lucide-react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLabels } from "@/hooks/useLabels";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Label name must be at least 2 characters" }),
});

export default function AddLabelDialog() {
  const { toast } = useToast();
  // Use the labels hook that contains our mutation
  const { addLabel } = useLabels();
  const [isAdding, setIsAdding] = useState(false);
  
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
      addLabel(values.name);
      
      toast({
        title: "😎 Successfully created a Label!",
        duration: 3000,
      });
      
      form.reset();
      // Close the dialog
      document.getElementById("closeDialog")?.click();
    } catch (error) {
      console.error("Error adding label:", error);
      toast({
        title: "❌ Failed to add label",
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
        <DialogTitle>Add a Label</DialogTitle>
        
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