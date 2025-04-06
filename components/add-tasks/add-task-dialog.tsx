"use client";
import { useMemo } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Calendar, ChevronDown, Flag, Hash, Tag, Trash2 } from "lucide-react";
import { format } from "date-fns";
import Task from "../todos/task";
import { AddTaskWrapper } from "./add-task-button";
import { useToast } from "../ui/use-toast";
import { useLabels } from "@/hooks/useLabels";
import { useProjects } from "@/hooks/useProjects";
import { useTodos } from "@/hooks/useTodos";
import { Todo } from "@/types";
import SuggestMissingTasks from "./suggest-tasks";

export default function AddTaskDialog({ data }: { data: Todo }) {
  const { taskName, description, projectId, labelId, priority, dueDate, _id } = data;
  const { toast } = useToast();

  // Use custom hooks
  const { labels } = useLabels();
  const { projects } = useProjects();
  const { todos, deleteTodo, updateTodo } = useTodos();

  // Find project and label from custom hooks (using useMemo to prevent infinite loops)
  const project = useMemo(() => 
    projects?.find(p => p._id === projectId),
  [projects, projectId]);
  
  const label = useMemo(() => 
    labels?.find(l => l._id === labelId),
  [labels, labelId]);

  // Filter subtasks from todos (using useMemo for performance)
  const subtodos = useMemo(() => 
    todos.filter(todo => todo.parentId === _id),
  [todos, _id]);
  
  const incompletedSubtodos = useMemo(() => 
    subtodos.filter(todo => !todo.isCompleted),
  [subtodos]);
  
  const completedSubtodos = useMemo(() => 
    subtodos.filter(todo => todo.isCompleted),
  [subtodos]);

  // Replace useState + useEffect with useMemo to prevent infinite loop
  const todoDetails = useMemo(() => [
    {
      labelName: "Project",
      value: project?.name || "",
      icon: <Hash className="w-4 h-4 text-primary capitalize" />,
    },
    {
      labelName: "Due date",
      value: dueDate ? format(new Date(dueDate), "MMM dd yyyy") : "",
      icon: <Calendar className="w-4 h-4 text-primary capitalize" />,
    },
    {
      labelName: "Priority",
      value: priority?.toString() || "",
      icon: <Flag className="w-4 h-4 text-primary capitalize" />,
    },
    {
      labelName: "Label",
      value: label?.name || "",
      icon: <Tag className="w-4 h-4 text-primary capitalize" />,
    },
  ], [project?.name, dueDate, priority, label?.name]);

  // Handle checking/unchecking subtasks
  const handleCheckSubTodo = (todo: Todo) => {
    updateTodo({ todoId: todo._id, isCompleted: !todo.isCompleted });
    toast({
      title: todo.isCompleted ? "❌ Subtask unchecked" : "✅ Subtask completed",
      duration: 3000,
    });
  };

  // Handle deleting the main task
  const handleDeleteTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    await deleteTodo(_id);
    toast({
      title: "🗑️ Task deleted",
      duration: 3000,
    });
    // Close the dialog after deletion
    document.getElementById("closeDialog")?.click();
  };

  return (
    <DialogContent className="max-w-4xl lg:h-4/6 flex flex-col md:flex-row lg:justify-between text-right">
      <DialogHeader className="w-full">
        <DialogTitle>{taskName}</DialogTitle>
        <DialogDescription asChild>
          <div>
            <p className="my-2 capitalize">{description}</p>
            <div className="flex items-center gap-1 mt-12 border-b-2 border-gray-100 pb-2 flex-wrap sm:justify-between lg:gap-0 ">
              <div className="flex gap-1 justify-between w-full">
                <div className="flex items-center gap-1">
                  <ChevronDown className="w-5 h-5 text-primary" />
                  <p className="font-bold flex text-sm text-gray-900">Sub-tasks</p>
                </div>
               
                <SuggestMissingTasks projectId={projectId} isSubTask={true} taskName={taskName} description={description} parentId={_id}/>
              </div>
            </div>
            <div className="pl-4">
              {/* Incomplete subtasks */}
              {incompletedSubtodos.map((task) => (
                <Task
                  key={task._id}
                  data={task}
                  isCompleted={task.isCompleted}
                  handleOnChange={() => handleCheckSubTodo(task)}
                />
              ))}
              
              {/* Add subtask component */}
              <div className="pb-4">
                <AddTaskWrapper
                  parentTask={data}                />
              </div>
              
              {/* Completed subtasks */}
              {completedSubtodos.map((task) => (
                <Task
                  key={task._id}
                  data={task}
                  isCompleted={task.isCompleted}
                  handleOnChange={() => handleCheckSubTodo(task)}
                />
              ))}
            </div>
          </div>
        </DialogDescription>
      </DialogHeader>
      
      {/* Right sidebar for task details */}
      <div className="flex flex-col gap-2 bg-gray-100 md:w-1/2">
        {todoDetails.map(({ labelName, value, icon }, idx) => (
          <div
            key={`${value}-${idx}`}
            className="grid gap-2 p-4 border-b-2 w-full"
          >
            <Label className="flex items-start">{labelName}</Label>
            <div className="flex text-left items-center justify-start gap-2 pb-2">
              {icon}
              <p className="text-sm">{value}</p>
            </div>
          </div>
        ))}
        <div className="flex gap-2 p-4 w-full justify-end">
          <form onSubmit={(e) => handleDeleteTodo(e)}>
            <button type="submit">
              <Trash2 className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </DialogContent>
  );
} 