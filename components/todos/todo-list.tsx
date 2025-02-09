"use client";
import { useEffect, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import Task from "./task";
import { CircleCheckBig } from "lucide-react";
import Todos from "./todos";
import CompletedTodos from "./completed-todos";
import { AddTaskWrapper } from "../add-tasks/add-task-button";
import { getTodos, getCompletedTodos, getIncompleteTodos, getTotalTodos } from "@/actions/todos"; // Import your server actions

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [inCompleteTodos, setInCompleteTodos] = useState([]);
  const [totalTodos, setTotalTodos] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const todosData = await getTodos();
      const completedTodosData = await getCompletedTodos();
      const inCompleteTodosData = await getIncompleteTodos();
      const totalTodosCount = await getTotalTodos();

      setTodos(todosData);
      setCompletedTodos(completedTodosData);
      setInCompleteTodos(inCompleteTodosData);
      setTotalTodos(totalTodosCount);
    }
    fetchData();
  }, []);

  if (
    todos === undefined ||
    completedTodos === undefined ||
    inCompleteTodos === undefined
  ) {
    return <p>Loading...</p>;
  }

  return (
    <div className="xl:px-40">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Inbox</h1>
      </div>
      <div className="flex flex-col gap-1 py-4">
        <Todos items={inCompleteTodos} />
      </div>
      <AddTaskWrapper />
      <div className="flex flex-col gap-1 py-4">
        <Todos items={completedTodos} />
      </div>
      <CompletedTodos totalTodos={totalTodos} />
    </div>
  );
}