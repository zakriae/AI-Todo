// components/add-tasks/suggest-tasks.tsx
"use client";

import React, { useState } from "react";
import { Loader } from "lucide-react";
import { Button } from "../ui/button";
import { suggestTasksWithAI, suggestSubtasksWithAI } from "@/actions/openai";
import { useToast } from "../ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function SuggestMissingTasks({
  projectId,
  isSubTask = false,
  taskName = "",
  description = "",
  parentId,
}: {
  projectId: string; // Changed from Id<"projects">
  isSubTask?: boolean;
  taskName?: string;
  description?: string;
  parentId?: string; // Changed from Id<"todos">
}) {
  const [isLoadingSuggestMissingTasks, setIsLoadingSuggestMissingTasks] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleMissingTasks = async () => {
    setIsLoadingSuggestMissingTasks(true);
    try {
      const result = await suggestTasksWithAI({ projectId });
      
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['todos'] });
        toast({
          title: "✅ Tasks generated successfully",
          description: `Generated ${result.tasksCount} tasks`,
          duration: 3000,
        });
      } else {
        toast({
          title: "❌ Error generating tasks",
          description: result.error || "Something went wrong",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.log("Error in suggestMissingTasks", error);
      toast({
        title: "❌ Failed to generate tasks",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoadingSuggestMissingTasks(false);
    }
  };

  const handleMissingSubTasks = async () => {
    setIsLoadingSuggestMissingTasks(true);
    try {
      if (parentId) {
        const result = await suggestSubtasksWithAI({
          projectId,
          taskName,
          description,
          parentId,
        });
        
        if (result.success) {
          queryClient.invalidateQueries({ queryKey: ['todos'] });
          toast({
            title: "✅ Subtasks generated successfully",
            description: `Generated ${result.tasksCount} subtasks`,
            duration: 3000,
          });
        } else {
          toast({
            title: "❌ Error generating subtasks",
            description: result.error || "Something went wrong",
            variant: "destructive",
            duration: 3000,
          });
        }
      }
    } catch (error) {
      console.log("Error in suggestMissingSubTasks", error);
      toast({
        title: "❌ Failed to generate subtasks",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoadingSuggestMissingTasks(false);
    }
  };

  return (
    <>
      <Button
        variant={"outline"}
        disabled={isLoadingSuggestMissingTasks}
        onClick={isSubTask ? handleMissingSubTasks : handleMissingTasks}
      >
        {isLoadingSuggestMissingTasks ? (
          <div className="flex gap-2">
            Loading Tasks (AI)
            <Loader className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : (
          "Suggest Missing Tasks (AI) 💖"
        )}
      </Button>
    </>
  );
}