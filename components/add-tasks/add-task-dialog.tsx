import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Calendar, ChevronDown, Flag, Hash, Tag, Trash2 } from "lucide-react";
import { format } from "date-fns";
import Task from "../todos/task";
import { AddTaskWrapper } from "./add-task-button";
import SuggestMissingTasks from "./suggest-tasks";
import { useToast } from "../ui/use-toast";
import { getProjectById } from "@/actions/projects"; // Import your server actions
import { getLabelById } from "@/actions/labels"; // Import your server actions
import {
  getIncompleteSubTodos,
  getCompleteSubTodos,
  checkSubTodo,
  uncheckSubTodo,
} from "@/actions/subtodos"; // Import your server actions
import { deleteTodo } from "@/actions/todos"; // Import your server actions
import { usePathname } from "next/navigation"; // Import usePathname

export default function AddTaskDialog({ data }: { data: any }) {
  const { taskName, description, projectId, labelId, priority, dueDate, _id } =
    data;
  const [project, setProject] = useState<any>(null);
  const [label, setLabel] = useState<any>(null);
  const [inCompletedSubtodosByProject, setInCompletedSubtodosByProject] =
    useState<any[]>([]);
  const [completedSubtodosByProject, setCompletedSubtodosByProject] = useState<
    any[]
  >([]);
  const { toast } = useToast();
  const pathname = usePathname(); // Get the current path

  useEffect(() => {
    async function fetchData() {
      const projectData = await getProjectById(projectId);
      const labelData = await getLabelById(labelId);
      setProject(projectData);
      setLabel(labelData);

      if (_id) {
        const incompleteSubTodos = await getIncompleteSubTodos(_id);
        const completeSubTodos = await getCompleteSubTodos(_id);
        setInCompletedSubtodosByProject(incompleteSubTodos);
        setCompletedSubtodosByProject(completeSubTodos);
      }
    }
    fetchData();
  }, [projectId, labelId, _id]);

  const handleCheckSubTodo = async (todoId: string) => {
    await checkSubTodo(todoId);
    toast({
      title: "✅ Subtask completed",
      duration: 3000,
    });
  };

  const handleUncheckSubTodo = async (todoId: string) => {
    await uncheckSubTodo(todoId);
    toast({
      title: "❌ Subtask unchecked",
      duration: 3000,
    });
  };

  const handleDeleteTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    await deleteTodo(_id);
    toast({
      title: "🗑️ Task deleted",
      duration: 3000,
    });
  };

  const [todoDetails, setTodoDetails] = useState<
    Array<{ labelName: string; value: string; icon: React.ReactNode }>
  >([]);

  useEffect(() => {
    setTodoDetails([
      {
        labelName: "Project",
        value: project?.name || "",
        icon: <Hash className="w-5 h-5" />,
      },
      {
        labelName: "Label",
        value: label?.name || "",
        icon: <Tag className="w-5 h-5" />,
      },
      {
        labelName: "Priority",
        value: priority,
        icon: <Flag className="w-5 h-5" />,
      },
      {
        labelName: "Due Date",
        value: dueDate ? format(new Date(dueDate), "PPP") : "",
        icon: <Calendar className="w-5 h-5" />,
      },
    ]);
  }, [project, label, priority, dueDate]);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{taskName}</DialogTitle>
        <DialogDescription>
          <p>{description}</p>
          <div className="flex flex-col gap-2 mt-4">
            <AddTaskWrapper
              parentTask={data}
              handelOnAddTodo={() => {}}
              existingTodoIds={[]}
            />
            {completedSubtodosByProject.map((task) => (
              <Task
                key={task._id}
                data={task}
                isCompleted={task.completed}
                handleOnChange={() => handleUncheckSubTodo(task._id)}
              />
            ))}
          </div>
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-2 bg-gray-100 lg:w-1/2">
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
