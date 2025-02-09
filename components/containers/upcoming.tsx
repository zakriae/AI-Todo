"use client";
import { useEffect, useState } from "react";
import { Dot } from "lucide-react";
import moment from "moment";
import { AddTaskWrapper } from "../add-tasks/add-task-button";
import Todos from "../todos/todos";
import { getTodos, getOverdueTodos } from "@/actions/todos"; // Import your MongoDB functions
import { Todo } from "@/types"; // Import your custom type

export default function Upcoming() {
  const [groupTodosByDate, setGroupTodosByDate] = useState<{ [key: string]: Todo[] }>({});
  const [overdueTodos, setOverdueTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const todosData = await getTodos();
      const overdueTodosData = await getOverdueTodos();

      const groupedTodosData = todosData.reduce((acc: { [key: string]: Todo[] }, todo: Todo) => {
        const dueDate = moment(todo.dueDate).format("YYYY-MM-DD");
        if (!acc[dueDate]) {
          acc[dueDate] = [];
        }
        acc[dueDate].push(todo);
        return acc;
      }, {});

      setGroupTodosByDate(groupedTodosData);
      setOverdueTodos(overdueTodosData);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="xl:px-40">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Upcoming</h1>
      </div>
      <div className="flex flex-col gap-1 py-4">
        <p className="font-bold flex text-sm">Overdue</p>
        <Todos items={overdueTodos} />
      </div>
      <div className="pb-6">
        <AddTaskWrapper />
      </div>
      <div className="flex flex-col gap-1 py-4">
        {Object.keys(groupTodosByDate || {}).map((dueDate) => {
          return (
            <div key={dueDate} className="mb-6">
              <p className="font-bold flex text-sm items-center">
                {moment(dueDate).format("LL")} <Dot />
                {moment(dueDate).format("dddd")}
              </p>
              <ul>
                <Todos items={groupTodosByDate[dueDate]} />
                <AddTaskWrapper />
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}