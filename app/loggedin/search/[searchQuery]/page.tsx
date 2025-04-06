"use client";
import MobileNav from "@/components/nav/mobile-nav";
import SideBar from "@/components/nav/side-bar";
import Todos from "@/components/todos/todos";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { Todo } from "@/types";
import { useTodos } from "@/hooks/useTodos";

export default function Search() {
  const params = useParams<{ searchQuery: string }>();
  const searchQuery = params?.searchQuery || "";
  const decodedQuery = decodeURIComponent(searchQuery);
  
  // Get todos from our custom hook
  const { todos, isLoading, error, updateTodo } = useTodos();
  
  // Filter todos based on search query using useMemo for performance
  const searchResults = useMemo(() => {
    if (!todos || !decodedQuery) return [];
    
    const lowerCaseQuery = decodedQuery.toLowerCase();
    
    return todos.filter((todo) => {
      // Search in task name
      const titleMatch = todo.taskName?.toLowerCase().includes(lowerCaseQuery);
      
      // Search in description
      const descriptionMatch = todo.description?.toLowerCase().includes(lowerCaseQuery);
      
      return titleMatch || descriptionMatch;
    });
  }, [todos, decodedQuery]);
  
  // Handle todo status change
  const handleOnChangeTodo = (todo: Todo) => {
    updateTodo({ todoId: todo._id, isCompleted: !todo.isCompleted });
  };

  // Split results into completed and incomplete
  const incompleteTodos = searchResults.filter(todo => !todo.isCompleted);
  const completedTodos = searchResults.filter(todo => todo.isCompleted);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <SideBar />
      <div className="flex flex-col">
        <MobileNav />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:px-8">
          <div className="xl:px-40">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold md:text-2xl">
                Search Results for{" "}
                <span className="text-primary">
                &ldquo;{decodedQuery}&rdquo;
                </span>
              </h1>
            </div>

            {isLoading ? (
              <div className="py-4">Loading results...</div>
            ) : error ? (
              <div className="py-4 text-red-500">Error: {(error as Error).message}</div>
            ) : (
              <>
                <div className="flex flex-col gap-1 py-4">
                  <p className="font-semibold">{incompleteTodos.length} incomplete tasks found</p>
                  <Todos
                    items={incompleteTodos}
                    handleOnChangeTodo={handleOnChangeTodo}
                  />
                </div>
                
                {completedTodos.length > 0 && (
                  <div className="flex flex-col gap-1 py-4">
                    <p className="font-semibold">{completedTodos.length} completed tasks found</p>
                    <Todos
                      items={completedTodos}
                      handleOnChangeTodo={handleOnChangeTodo}
                    />
                  </div>
                )}
                
                {searchResults.length === 0 && (
                  <div className="py-4">
                    No tasks found matching your search.
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}