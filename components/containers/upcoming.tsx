"use client";
import { useEffect, useMemo, useState } from "react";
import { Dot } from "lucide-react";
import moment from "moment";
import { AddTaskWrapper } from "../add-tasks/add-task-button";
import Todos from "../todos/todos";
import { getTodos, getOverdueTodos } from "@/actions/todos"; // Import your MongoDB functions
import { Todo } from "@/types"; // Import your custom type
import { useTodos } from "@/hooks/useTodos";

export default function Upcoming() {
  
  const { todos, isLoading, error, updateTodo } = useTodos();

  const { groupedTodos, overdueTodos } = useMemo(() => {
    const now = new Date();
    const startOfDay = moment(now).startOf('day').toDate();
    
    // Filter overdue todos
    const overdue = todos.filter(todo => {
      const dueDate = todo.dueDate ? new Date(todo.dueDate) : null;
      return dueDate && dueDate < startOfDay && !todo.isCompleted;
    });
    
    // Group todos by date
    const grouped = todos.reduce((acc: { [key: string]: Todo[] }, todo: Todo) => {
      // Skip todos without due date
      if (!todo.dueDate) return acc;
      
      const dueDate = moment(todo.dueDate).format("YYYY-MM-DD");
      if (!acc[dueDate]) {
        acc[dueDate] = [];
      }
      acc[dueDate].push(todo);
      return acc;
    }, {});
    
    return { groupedTodos: grouped, overdueTodos: overdue };
  }, [todos]);
  
  // Handler for checkbox changes
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
      <h1 className="text-lg font-semibold md:text-2xl">Upcoming</h1>
    </div>
    <div className="flex flex-col gap-1 py-4">
      <p className="font-bold flex text-sm">Overdue</p>
      <Todos items={overdueTodos} handleOnChangeTodo={handleOnChangeTodo} showDetails={true} />
    </div>
    <div className="pb-6">
      <AddTaskWrapper />
    </div>
    <div className="flex flex-col gap-1 py-4">
      {Object.keys(groupedTodos || {})
        .sort() // Sort dates chronologically
        .map((dueDate) => (
          <div key={dueDate} className="mb-6">
            <p className="font-bold flex text-sm items-center border-b-2 p-2 border-gray-100">
              {moment(dueDate).format("LL")} <Dot />
              {moment(dueDate).format("dddd")}
            </p>
            <ul>
              <Todos 
                items={groupedTodos[dueDate]} 
                handleOnChangeTodo={handleOnChangeTodo} 
              />
            </ul>
          </div>
        ))}
    </div>
  </div>
  );
}