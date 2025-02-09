import React, { useState } from "react";
import { Loader } from "lucide-react";
import { Button } from "../ui/button";
import { suggestMissingTasks } from "@/actions/tasks"; // Updated import statement for tasks
import { suggestMissingSubTasks } from "@/actions/subtodos"; // Updated import statement for subtasks

export default function SuggestMissingTasks({
  projectId,
  isSubTask = false,
  taskName = "",
  description = "",
  parentId,
}: {
  projectId: string;
  isSubTask?: boolean;
  taskName?: string;
  description?: string;
  parentId?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleMissingTasks = async () => {
    setIsLoading(true);
    try {
      await suggestMissingTasks({ projectId });
    } catch (error) {
      console.log("Error in suggestMissingTasks", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMissingSubTasks = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await suggestMissingSubTasks({ parentId: parentId || "", taskName, description });
    } catch (error) {
      console.log("Error in suggestMissingSubTasks", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={isSubTask ? handleMissingSubTasks : handleMissingTasks}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader className="animate-spin" />
      ) : (
        "Suggest Missing Tasks"
      )}
    </Button>
  );
}