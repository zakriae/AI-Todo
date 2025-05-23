import clsx from "clsx";
import AddTaskDialog from "../add-tasks/add-task-dialog";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { Calendar, GitBranch } from "lucide-react";
import moment from "moment";
import { Todo } from "@/types"; // Import your custom types
import { useState } from "react";

function isSubTodo(data: Todo): boolean {
  return "parentId" in data;
}

export default function Task({
  data,
  isCompleted: isCompletedProps,
  handleOnChange,
  showDetails,
}: {
  data: Todo;
  isCompleted: boolean;
  handleOnChange: any;
  showDetails?: boolean;
}) {
  const [isCompleted, setIsCompleted] = useState(isCompletedProps);
  const { taskName, dueDate } = data;
  const handleCheck = () => {
    setIsCompleted(!isCompleted);
    handleOnChange();
  };
  return (
    <div
      key={data._id}
      className="flex items-center space-x-2 border-b-2 p-2 border-gray-100 animate-in fade-in"
    >
      <Dialog>
        <div className="flex gap-2 items-center justify-end w-full">
          <div className="flex gap-2 w-full">
            <Checkbox
              id="todo"
              className={clsx(
                "w-5 h-5 rounded-xl",
                isCompleted &&
                  "data-[state=checked]:bg-gray-300 border-gray-300"
              )}
              checked={isCompleted}
              onCheckedChange={handleCheck}
            />
            <DialogTrigger asChild>
              <div className="flex flex-col items-start">
                <button
                  className={clsx(
                    "text-sm font-normal text-left",
                    isCompleted && "line-through text-foreground/30"
                  )}
                >
                  {taskName}
                </button>
                {showDetails && (
                  <div className="flex gap-2">
                    <div className="flex items-center justify-center gap-1">
                      <GitBranch className="w-3 h-3 text-foreground/70" />
                      <p className="text-xs text-foreground/70"></p>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <Calendar className="w-3 h-3 text-primary" />
                      <p className="text-xs text-primary">
                        {moment(dueDate).format("LL")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </DialogTrigger>
          </div>
          {!isSubTodo(data) && <AddTaskDialog data={data} />}
        </div>
      </Dialog>
    </div>
  );
}


