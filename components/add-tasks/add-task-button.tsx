import { Plus } from "lucide-react";
import React, { Dispatch, SetStateAction, useState } from "react";
import AddTaskInline from "./add-task-inline";
import { Todo, Project } from "@/types"; // Import your custom types

export const AddTaskWrapper = ({
  parentTask,
  projectId,
  handelOnAddTodo,
  existingTodoIds,
}: {
  parentTask?: Todo;
  projectId?: Project["_id"];
  handelOnAddTodo: (task: Todo) => void;
  existingTodoIds: string[];
}) => {
  const [showAddTask, setShowAddTask] = useState(false);

  return showAddTask ? (
    <AddTaskInline
      setShowDialog={setShowAddTask}
      parentTask={parentTask}
      projectId={projectId}
      handelOnAddTodo={handelOnAddTodo}
      existingTodoIds={existingTodoIds}
    />
  ) : (
    <AddTaskButton
      onClick={() => setShowAddTask(true)}
      title={parentTask?._id ? "Add sub-task" : "Add task"}
    />
  );
};

export default function AddTaskButton({
  onClick,
  title,
}: {
  onClick: Dispatch<SetStateAction<any>>;
  title: string;
}) {
  return (
    <button className="pl-2 flex mt-2 flex-1" onClick={onClick}>
      <div className="flex flex-col items-center justify-center gap-1 text-center">
        <div className="flex items-center gap-2 justify-center">
          <Plus className="h-4 w-4 text-primary hover:bg-primary hover:rounded-xl hover:text-white" />
          <h3 className="text-base font-light tracking-tight text-foreground/70">
            {title}
          </h3>
        </div>
      </div>
    </button>
  );
}
