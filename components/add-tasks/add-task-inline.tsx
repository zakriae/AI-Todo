"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast, useToast } from "@/components/ui/use-toast";
import { CalendarIcon, Text } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { CardFooter } from "../ui/card";
import { Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import moment from "moment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { createTask } from "@/actions/tasks";
import { Project, Todo } from "@/types"; // Import your custom types
import { useSession } from "next-auth/react"; // Import useSession from next-auth

const FormSchema = z.object({
  taskName: z.string().min(2, {
    message: "Task name must be at least 2 characters.",
  }),
  description: z.string().optional().default(""),
  dueDate: z.date({ required_error: "A due date is required" }),
  priority: z.string().min(1, { message: "Please select a priority" }),
  projectId: z.string().min(1, { message: "Please select a Project" }),
  labelId: z.string().min(1, { message: "Please select a Label" }),
});

export default function AddTaskInline({
  setShowDialog,
  parentTask,
  projectId: myProjectId,
}: {
  setShowDialog: Dispatch<SetStateAction<boolean>>;
  parentTask?: Todo;
  projectId?: Project["_id"];
}) {
  const { data: session } = useSession(); // Get the current session
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      taskName: "",
      description: "",
      dueDate: new Date(),
      priority: parentTask?.priority?.toString() || "1",
      projectId: myProjectId || parentTask?.projectId || "defaultProjectId", // Replace with your default project ID
      labelId: parentTask?.labelId || "defaultLabelId", // Replace with your default label ID
    },
  });

  const onSubmit = async (values: any) => {
    try {
      if (session?.user?.id) {
        await createTask({ ...values, userId: session.user.id });
        toast({
          title: "✅ Task added successfully",
          duration: 3000,
        });
        setShowDialog(false);
      }
    } catch (error) {
      toast({
        title: "❌ Failed to add task",
        description: (error as Error).message,
        duration: 3000,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2 border-2 p-2 border-gray-200 my-2 rounded-xl px-3 pt-4 border-foreground/20"
      >
        <FormField
          control={form.control}
          name="taskName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  id="taskName"
                  type="text"
                  placeholder="Enter your Task name"
                  required
                  className="border-0 font-semibold text-lg"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-start gap-2">
                  <Text className="ml-auto h-4 w-4 opacity-50" />
                  <Textarea
                    id="description"
                    placeholder="Description"
                    className="resize-none"
                    {...field}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "flex gap-2 w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Priority 1</SelectItem>
                    <SelectItem value="2">Priority 2</SelectItem>
                    <SelectItem value="3">Priority 3</SelectItem>
                    <SelectItem value="4">Priority 4</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="labelId"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Label" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* Replace with your labels data */}
                    <SelectItem value="defaultLabelId">Default Label</SelectItem>
                    <SelectItem value="label2">Label 2</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <FormItem>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Project" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* Replace with your projects data */}
                  <SelectItem value="defaultProjectId">Default Project</SelectItem>
                  <SelectItem value="project2">Project 2</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <CardFooter className="flex flex-col lg:flex-row lg:justify-between gap-2 border-t-2 pt-3">
          <div className="w-full lg:w-1/4"></div>
          <div className="flex gap-3 self-end">
            <Button
              className="bg-gray-300/40 text-gray-950 px-6 hover:bg-gray-300"
              variant={"outline"}
              onClick={() => setShowDialog(false)}
            >
              Cancel
            </Button>
            <Button className="px-6" type="submit">
              Add task
            </Button>
          </div>
        </CardFooter>
      </form>
    </Form>
  );
}