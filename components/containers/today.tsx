"use client";
import { useEffect, useMemo, useState } from "react";
import { AddTaskWrapper } from "../add-tasks/add-task-button";
import Todos from "../todos/todos";
import CompletedTodos from "../todos/completed-todos";
import { Dot } from "lucide-react";
import moment from "moment";
import { getTodos, getTodayTodos, getOverdueTodos } from "@/actions/todos"; // Import your server actions
import { Todo } from "@/types"; // Import your custom type
import { useTodos } from "@/hooks/useTodos";

export default function Today() {

  const { todos, isLoading, error, updateTodo } = useTodos();

  const { todayTodos, overdueTodos } = useMemo(() => {
    const now = new Date();
    const startOfDay = moment(now).startOf('day').toDate();
    const endOfDay = moment(now).endOf('day').toDate();
    
    // Filter for today's todos
    const today = todos.filter(todo => {
      const dueDate = todo.dueDate ? new Date(todo.dueDate) : null;
      return dueDate && dueDate >= startOfDay && dueDate <= endOfDay;
    });
    
    // Filter for overdue todos
    const overdue = todos.filter(todo => {
      const dueDate = todo.dueDate ? new Date(todo.dueDate) : null;
      return dueDate && dueDate < startOfDay && !todo.isCompleted;
    });
    
    return { todayTodos: today, overdueTodos: overdue };
  }, [todos]);

  const handleOnChangeTodo = (todo: Todo) => {
    updateTodo({ todoId: todo._id, isCompleted: !todo.isCompleted });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }
  
  if (error) {
    return <p>Error loading todos: {error.message}</p>;
  }

  return (
    <div className="xl:px-40">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Today</h1>
      </div>
      <div className="flex flex-col gap-1 py-4">
        <p className="font-bold flex text-sm">Overdue</p>
        <Todos items={overdueTodos} handleOnChangeTodo={handleOnChangeTodo} />
      </div>
      <AddTaskWrapper />
      <div className="flex flex-col gap-1 py-4">
        <p className="font-bold flex text-sm items-center border-b-2 p-2 border-gray-100">
          {moment(new Date()).format("LL")}
          <Dot />
          Today
          <Dot />
          {moment(new Date()).format("dddd")}
        </p>
        <Todos items={todayTodos} handleOnChangeTodo={handleOnChangeTodo} />
      </div>
    </div>
  );
}