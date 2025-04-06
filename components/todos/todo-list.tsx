"use client";
import { useState } from "react";
import { AddTaskWrapper } from "../add-tasks/add-task-button";
import Todos from "./todos";
import CompletedTodos from "./completed-todos";
import { Todo } from "@/types";
import { useTodos } from "@/hooks/useTodos";

export default function TodoList() {
  const { todos, addTodo, updateTodo, isLoading } = useTodos();
  
  // Derive completed and incomplete todos from the todos array
  const completedTodos = todos.filter(todo => todo.isCompleted);
  const inCompleteTodos = todos.filter(todo => !todo.isCompleted);
  const totalTodos = todos.length;
  const existingTodoIds = todos.map(todo => todo._id);

  const handelOnAddTodo = async (task: Todo) => {
    addTodo(task);
  };

  const handleOnChangeTodo = async (todo: Todo) => {
    updateTodo({ todoId : todo._id, isCompleted: !todo.isCompleted });
  };

  if (isLoading) {
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
      <AddTaskWrapper  />
      <div className="flex flex-col gap-1 py-4">
        <Todos items={completedTodos} handleOnChangeTodo={handleOnChangeTodo} />
      </div>
      <CompletedTodos totalTodos={totalTodos} />
    </div>
  );
}
