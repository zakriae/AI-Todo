import React from "react";
import Task from "./task";
import { useToast } from "../ui/use-toast";
import { checkTodo, uncheckTodo } from "@/actions/todos"; // Import your server actions
import { Todo } from "@/types"; // Import your custom type
import { usePathname } from "next/navigation"; // Import usePathname

export default function Todos({
  items,
  handleOnChangeTodo,
  showDetails= false
}: {
  items: Todo[];
  handleOnChangeTodo: (task: Todo) => void;
  showDetails?: boolean;

}) {
  const { toast } = useToast();
  const pathname = usePathname(); // Get the current path

  return items.map((task: Todo, idx: number) => (
    <Task
      key={task._id ? task._id.toString() : `task-${idx}`} // Add a fallback key
      data={task}
      isCompleted={task.isCompleted}
      handleOnChange={() => handleOnChangeTodo(task)}
      showDetails={showDetails}

    />
  ));
}
