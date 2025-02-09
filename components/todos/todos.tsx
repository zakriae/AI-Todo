import React from "react";
import Task from "./task";
import { useToast } from "../ui/use-toast";
import { checkTodo, uncheckTodo } from "@/actions/todos"; // Import your server actions// Import ObjectId from mongodb
import { Todo } from "@/types"; // Import your custom type

export default function Todos({ items }: { items: Todo[] }) {
  const { toast } = useToast();

  const handleOnChangeTodo = async (task: Todo) => {
      await uncheckTodo(task._id);
      await checkTodo(task._id);
      toast({
        title: "✅ Task completed",
        description: "You're a rockstar",
        duration: 3000,
      });
  };

  return items.map((task: Todo, idx: number) => (
    <Task
      key={task._id.toString()}
      data={task}
      isCompleted={task.completed}
      handleOnChange={() => handleOnChangeTodo(task)}
    />
  ));
}