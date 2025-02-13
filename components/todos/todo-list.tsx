"use client";
import { useEffect, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import Task from "./task";
import { CircleCheckBig } from "lucide-react";
import Todos from "./todos";
import CompletedTodos from "./completed-todos";
import { AddTaskWrapper } from "../add-tasks/add-task-button";
import {
  getTodos,
  getCompletedTodos,
  getIncompleteTodos,
  getTotalTodos,
  uncheckTodo,
  checkTodo,
} from "@/actions/todos"; // Import your server actions
import { Todo } from "@/types"; // Import your custom types
import { createTask } from "@/actions/tasks";

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);
  const [inCompleteTodos, setInCompleteTodos] = useState<Todo[]>([]);
  const [totalTodos, setTotalTodos] = useState<number>(0);

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
  useEffect(() => {
    fetchData();
  }, []);

  // Extract existing todo IDs
  const existingTodoIds = todos.map((todo) => todo._id);

  const handelOnAddTodo = async (task: Todo) => {
    const previousTodos = [...todos];
    const previousInCompleteTodos = [...inCompleteTodos];

    // Optimistic UI update
    setTodos((prevTodos) => [...prevTodos, task]);
    setInCompleteTodos((prevTodos) => [...prevTodos, task]);

    try {
      const addedTask = await createTask(task);
      // Replace the temporary ID with the real ID
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === task._id ? { ...todo, _id: addedTask._id } : todo
        )
      );
      setInCompleteTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === task._id ? { ...todo, _id: addedTask._id } : todo
        )
      );
    } catch (error) {
      console.error("Failed to add todo:", error);
      // Revert the state if the backend operation fails
      setTodos(previousTodos);
      setInCompleteTodos(previousInCompleteTodos);
    }
  };

  const handleOnChangeTodo = async (task: Todo) => {
    const updatedTask = { ...task, isCompleted: !task.isCompleted };
    const previousTodos = [...todos];
    const previousCompletedTodos = [...completedTodos];
    const previousInCompleteTodos = [...inCompleteTodos];

    // Optimistic UI update
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo._id === task._id ? updatedTask : todo))
    );
    setInCompleteTodos((prevTodos) =>
      prevTodos.filter((todo) => todo._id !== task._id)
    );
    setCompletedTodos((prevTodos) =>
      task.isCompleted
        ? prevTodos.filter((todo) => todo._id !== task._id)
        : [...prevTodos, updatedTask]
    );

    try {
      if (task.isCompleted) {
        await uncheckTodo(task._id);
      } else {
        await checkTodo(task._id);
      }
      // Refetch data from the backend to ensure consistency
      await fetchData();
    } catch (error) {
      console.error("Failed to update todo:", error);
      // Revert the state if the backend operation fails
      setTodos(previousTodos);
      setCompletedTodos(previousCompletedTodos);
      setInCompleteTodos(previousInCompleteTodos);
    }
  };

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
        <Todos
          items={inCompleteTodos}
          handleOnChangeTodo={handleOnChangeTodo}
        />
      </div>
      <AddTaskWrapper
        handelOnAddTodo={handelOnAddTodo}
        existingTodoIds={existingTodoIds}
      />
      <div className="flex flex-col gap-1 py-4">
        <Todos items={completedTodos} handleOnChangeTodo={handleOnChangeTodo} />
      </div>
      <CompletedTodos totalTodos={totalTodos} />
    </div>
  );
}
